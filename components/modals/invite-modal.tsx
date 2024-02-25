"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

export const InviteModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "invite";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text -center font-bold">
            Create Workspace
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your workspace a personality with a name and an image. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        Invite Modal
      </DialogContent>
    </Dialog>
  );
};
