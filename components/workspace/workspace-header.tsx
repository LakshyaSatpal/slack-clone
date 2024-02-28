"use client";
import { WorkspaceWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/use-modal-store";

interface WorkspaceHeaderProps {
  workspace: WorkspaceWithMembersWithProfiles;
  role?: MemberRole;
}

export const WorkspaceHeader = ({ workspace, role }: WorkspaceHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR;

  return (
    <div className="w-full p-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="w-full flex items-center py-2 px-2 rounded text-md font-medium text-neutral-200 transition-all hover:bg-[#300A34]">
            <div className="mr-1">{workspace.name}</div>
            <ChevronDown className="h-5 w-5 ml-auto" />
          </div>
        </DropdownMenuTrigger>
        <Separator className="bg-[#543A57] -mx-3 mt-2" decorative />
        <DropdownMenuContent
          align="start"
          className="w-56 text-sm bg-white text-black dark:text-neutral-200 dark:bg-[#222529] space-y-[2px]"
        >
          {(isModerator || isAdmin) && (
            <DropdownMenuItem
              onClick={() => onOpen("invite", { workspace })}
              className="py-2 text-sm cursor-pointer focus:bg-sky-600 focus:text-white"
            >
              Invite people
              <UserPlus className="h-4 w-4 ml-auto " />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("editWorkspace", { workspace })}
              className="py-2 text-sm cursor-pointer focus:bg-sky-600 focus:text-white"
            >
              Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("members", { workspace })}
              className="py-2 text-sm cursor-pointer focus:bg-sky-600 focus:text-white"
            >
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {(isModerator || isAdmin) && (
            <DropdownMenuItem
              onClick={() => onOpen("createChannel", { workspace })}
              className="py-2 text-sm cursor-pointer focus:bg-sky-600 focus:text-white"
            >
              Create Channels
              <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("deleteWorkspace", { workspace })}
              className="text-rose-500 focus:bg-rose-600 focus:text-white py-2 text-sm cursor-pointer"
            >
              Delete Workspace
              <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("leaveWorkspace", { workspace })}
              className="text-rose-500 focus:bg-rose-600 focus:text-white py-2 text-sm cursor-pointer"
            >
              Leave Workspace
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
