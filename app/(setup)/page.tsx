import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

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
  return <InitialModal />;
};

export default SetupPage;
