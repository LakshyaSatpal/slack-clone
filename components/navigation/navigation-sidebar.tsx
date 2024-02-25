import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NavigationAction } from "./navigation-action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const workspaces = await db.workspace.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#652568] dark:bg-[#300A34] py-3">
      <ScrollArea className="flex-1 w-full pt-3">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="mb-4 w-full flex items-center justify-center"
          >
            <NavigationItem
              id={workspace.id}
              imageUrl={workspace.imageUrl}
              name={workspace.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-2">
        <NavigationAction />
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
          <ModeToggle />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-[48px] w-[48px]",
              },
            }}
          ></UserButton>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
