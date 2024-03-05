"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={onClick}
        className="group relative flex items-center justify-center"
      >
        <div
          className={cn(
            "relative flex mx-3 h-[48px] w-[48px] rounded-[16px] transition-all overflow-hidden items-center ",
            params?.workspaceId !== id &&
              "group-hover:border-2 group-hover:border-neutral-500",
            params?.workspaceId === id && "border-2 border-white"
          )}
        >
          <Image fill src={imageUrl} alt="Workspace" />
        </div>
      </button>
    </ActionTooltip>
  );
};
