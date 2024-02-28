"use client";

import React, { useReducer } from "react";
import type { WorkspaceWithChannels } from "@/types";
import { Plus } from "lucide-react";
import { MemberRole } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter, useParams } from "next/navigation";
import clsx from "clsx";

interface WorkspaceChannelsProps {
  workspace: WorkspaceWithChannels;
  role?: MemberRole;
}

export const WorkspaceChannels = ({
  workspace,
  role,
}: WorkspaceChannelsProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onChannelClick = (id: string) => {
    router.push(`/workspaces/${workspace.id}/channels/${id}`);
  };

  return (
    <div className="text-sm">
      <div className="text-zinc-300">Channels</div>
      <div className="mt-2">
        {workspace.channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onChannelClick(channel.id)}
            className={clsx(
              "flex items-center text-zinc-300 py-1 px-2 hover:bg-[#3b1f40] dark:hover:bg-[#2a162d] rounded-lg cursor-pointer",
              {
                "bg-[#5F2465] text-white hover:bg-[#5F2465] hover:dark:bg-[#5F2465]":
                  params.channelId === channel.id,
              }
            )}
          >
            <div className="mr-2">#</div>
            <div>{channel.name}</div>
          </div>
        ))}
        {role !== MemberRole.GUEST && (
          <button
            onClick={() => onOpen("createChannel", { workspace })}
            className="flex items-center py-1 px-2 hover:bg-[#3b1f40] dark:hover:bg-[#2a162d] mt-1 text-zinc-300 rounded-lg cursor-pointer w-full"
          >
            <div className="p-1 -ml-1 mr-2 rounded-sm bg-[#3C253F]">
              <Plus className="w-3 h-3" />
            </div>
            <div>Add Channels</div>
          </button>
        )}
      </div>
    </div>
  );
};
