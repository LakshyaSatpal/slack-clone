"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/upload-thing";

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "workspaceImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value.split(".").pop();
  if (value && fileType != "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="upload" className="rounded-full" />
        <button
          className=" bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 text-violet-600" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-violet-500 dark:text-violet-400 hover:underline"
        >
          {value}
        </a>
        <div className="relative h-20 w-20">
          <button
            className=" bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
            type="button"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
