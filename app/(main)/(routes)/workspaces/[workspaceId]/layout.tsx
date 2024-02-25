import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const WorkspaceIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: params.workspaceId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!workspace) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full md:w-60 lg:w-96 z-20 flex-col inset-y-0 fixed">
        <WorkspaceSidebar workspaceId={params.workspaceId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default WorkspaceIdLayout;
