import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";

interface MemberIdPageProps {
  params: {
    workspaceId: string;
    memberId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      workspaceId: params.workspaceId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversaton = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversaton) {
    return redirect(`/workspaces/${params.workspaceId}`);
  }

  const { memberOne, memberTwo } = conversaton;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type="conversation"
        workspaceId={params.workspaceId}
      />
    </div>
  );
};

export default MemberIdPage;
