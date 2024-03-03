"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { Plus, SendHorizonal } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import clsx from "clsx";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative py-3 pt-2 px-2 mx-5 focus-within:border-zinc-300 focus-within:shadow transition-all duration-200 rounded-sm border border-neutral-200 bg-white dark:bg-[#222529] dark:border-neutral-600 mb-5">
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    className="bg-white px-2 text-zinc-700 dark:text-zinc-100 dark:bg-[#222529] border-none border-0 focus-visible:ring-0 outline-none focus-visible:outline-none focus-visible:ring-offset-0 placeholder:text-zinc-500"
                    {...field}
                  />
                  <div className="flex justify-between px-1 mt-1">
                    <button
                      type="button"
                      onClick={() => onOpen("messageFile", { apiUrl, query })}
                      className="left-2 bottom-2 p-2 rounded-full flex items-center justify-center bg-zinc-200 text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      className={clsx(
                        "text-zinc-300 dark:text-zinc-600  rounded-sm p-2",
                        {
                          "text-white bg-emerald-600 dark:text-white":
                            field.value.length > 0,
                        }
                      )}
                    >
                      <SendHorizonal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
