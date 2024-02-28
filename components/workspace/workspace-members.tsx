"use client";
import React from "react";
import type { WorkspaceWithMembersWithProfiles } from "@/types";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface WorkspaceChannelsProps {
  workspace: WorkspaceWithMembersWithProfiles;
  profile: Profile;
}

export const WorkspaceMembers = ({
  workspace,
  profile,
}: WorkspaceChannelsProps) => {
  const router = useRouter();

  const onClick = (id: string) => {
    router.push(`/workspaces/${workspace.id}/conversations/${id}`);
  };
  return (
    workspace.members.length > 1 && (
      <div className="text-sm mt-10">
        <div className="text-zinc-300">Direct Messages</div>
        <div className="text-white mt-2">
          {workspace.members.map(
            (member) =>
              member.profile.id !== profile?.id && (
                <div
                  key={member.id}
                  onClick={() => onClick(member.id)}
                  className="flex items-center py-1 px-2 hover:bg-[#391D3C] rounded-lg cursor-pointer"
                >
                  <div className="mr-2 rounded-full">
                    <Image
                      width={20}
                      height={20}
                      src={member.profile.imageUrl}
                      alt="Profile image "
                    />
                  </div>
                  <div>{member.profile.name}</div>
                </div>
              )
          )}
        </div>
      </div>
    )
  );
};
