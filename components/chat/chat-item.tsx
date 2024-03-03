"use client";

import * as z from "zod";
import axios, { formToJSON } from "axios";
import qs from "query-string";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  sockerUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-violet-800" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  sockerUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const formSchema = z.object({
    content: z.string().min(1),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: content,
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${sockerUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar
            src={member.profile.imageUrl}
            className="rounded-md md:h-8 md:w-8"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                fill
                alt={content}
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 text-violet-600" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-violet-500 dark:text-violet-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={clsx("text-sm text-zinc-600 dark:text-zinc-300", {
                "italic text-zinc-500 dark:text-zinc-400 text-xs": deleted,
              })}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="px-2 py-1 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-300 w-full"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" disabled={isLoading} variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${sockerUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
