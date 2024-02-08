"use client";

import { Plus } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";

export const NavigationAction = () => {
  return (
    <div>
      <ActionTooltip side="right" label="Create new" align="center">
        <button className="group flex items-center">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-[#5B3C5E] group-hover:scale-105">
            <Plus className="group-hover:text-white transition text-neutral-200" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
