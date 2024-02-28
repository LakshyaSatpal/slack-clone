import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { name, imageUrl } = await req.json();
    const workspace = await db.workspace.update({
      where: {
        id: params.workspaceId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(workspace);
  } catch (err) {
    console.log("[WORKSPACE_ID]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const workspace = await db.workspace.delete({
      where: {
        id: params.workspaceId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(workspace);
  } catch (err) {
    console.log("[WORKSPACE_ID_DELETE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
