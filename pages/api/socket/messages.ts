import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { redirectToSignIn } from "@clerk/nextjs";
import { rmdirSync } from "fs";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { workspaceId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!workspaceId) {
      return res.status(401).json({ error: "Workspace ID missing" });
    }

    if (!channelId) {
      return res.status(401).json({ error: "Channel ID missing" });
    }

    if (!content) {
      return res.status(401).json({ error: "Content missing" });
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
      return res.status(404).json({ error: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        workspaceId: workspaceId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = workspace.members.find(
      (mem) => mem.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        memberId: member.id,
        channelId: channel.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res.socket.server.io.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[MESSAGES_POST]", err);
    return res.status(500).json({ message: "Internal error" });
  }
}
