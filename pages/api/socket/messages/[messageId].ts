import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content } = req.body;
    const { channelId, workspaceId, messageId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(401).json({ error: "Workspace ID missing" });
    }

    if (!channelId) {
      return res.status(401).json({ error: "Channel ID missing" });
    }

    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        workspaceId: workspaceId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({
        error: "Channel not found",
      });
    }

    const member = workspace.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          deleted: true,
          content: "This message has been deleted.",
          fileUrl: null,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[MESSAGES_ID]", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
