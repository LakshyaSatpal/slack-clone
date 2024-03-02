import { Menu } from "lucide-react";
import React from "react";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

export const MobileToggle = ({ workspaceId }: { workspaceId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex p-0 gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <WorkspaceSidebar workspaceId={workspaceId} />
      </SheetContent>
    </Sheet>
  );
};
