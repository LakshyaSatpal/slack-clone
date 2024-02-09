import { Member, Profile, Workspace } from "@prisma/client";

export type WorkspaceWithMembersWithProfiles = Workspace & {
  members: (Member & { profile: Profile })[];
};
