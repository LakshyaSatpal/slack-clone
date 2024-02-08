"use client";

import { Plus } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side="right" label="Create new" align="center">
        <button
          onClick={() => onOpen("createWorkspace")}
          className="group flex items-center mb-4"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden items-center justify-center bg-background bg-[#815286] dark:bg-[#5B3C5E] group-hover:scale-105">
            <Plus className="group-hover:text-white transition text-neutral-200" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
