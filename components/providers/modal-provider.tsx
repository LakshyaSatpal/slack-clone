"use client";
import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "../modals/create-workspace-modal";
import { InviteModal } from "../modals/invite-modal";

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
    </>
  );
};
