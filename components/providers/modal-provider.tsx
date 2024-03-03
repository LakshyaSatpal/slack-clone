"use client";

import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditWorkspaceModal } from "@/components/modals/edit-workspace-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveWorkspaceModal } from "@/components/modals/leave-workspace-modal";
import { DeleteWorkspaceModal } from "@/components/modals/delete-workspace-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";

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
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};
