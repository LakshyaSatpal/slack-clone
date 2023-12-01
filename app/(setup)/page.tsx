import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();
  const workspace = await db.workspace.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (workspace) {
    return redirect(`/workspaces/${workspace.id}`);
  }
  return <div>Create a Workspace</div>;
};

export default SetupPage;
