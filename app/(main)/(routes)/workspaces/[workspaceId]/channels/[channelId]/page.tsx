import React from "react";

import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";

interface ChannelIdPageProps {
  params: {
    workspaceId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      workspaceId: params.workspaceId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div>
      <ChatHeader
        workspaceId={params.workspaceId}
        name={channel.name}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
