"use client";
import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditWorkspaceModal } from "@/components/modals/edit-workspace-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { LeaveWorkspaceModal } from "../modals/leave-workspace-modal";
import { DeleteWorkspaceModal } from "../modals/delete-workspace-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateWorkspaceModal />
      <InviteModal />
      <EditWorkspaceModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveWorkspaceModal />
      <DeleteWorkspaceModal />
    </>
  );
};
