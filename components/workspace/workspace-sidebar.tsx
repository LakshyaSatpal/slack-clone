import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceChannels } from "./workpace-channels";
import { ScrollArea } from "../ui/scroll-area";
import { WorkspaceMembers } from "./workspace-members";

interface WorkspaceSidebarProps {
  workspaceId: string;
}

export const WorkspaceSidebar = async ({
  workspaceId,
}: WorkspaceSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!workspace) {
    return redirect("/");
  }

  const channels = workspace?.channels;

  const members = workspace?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = workspace.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full bg-[#402145] dark:bg-[#251229]">
      <WorkspaceHeader workspace={workspace} role={role} />
      <ScrollArea className="w-full flex-1 p-3">
        <WorkspaceChannels workspace={workspace} role={role} />
        <WorkspaceMembers profile={profile} workspace={workspace} />
      </ScrollArea>
    </div>
  );
};
