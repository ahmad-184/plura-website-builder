"use client";

import useUpload from "@/hooks/use-upload";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import Loader from "../loader";
import { cn } from "@/lib/utils";

export default function UploadImageWithPreview({
  max_file = 1,
  maxSize = 1,
  getValue,
  value,
  className,
}: {
  max_file?: number;
  maxSize?: number;
  getValue: (url: string, file?: File[]) => void;
  value?: string | null | undefined;
  className?: string;
}) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!value) return;
    setPreview(value);
  }, [value]);

  const { files, isUploading, startUpload, setFiles } = useUpload({
    max_size: maxSize,
    ref: { current: null },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [".svg"],
    },
    maxFiles: max_file,
    maxSize: maxSize ? maxSize * 1000000 : 1000000,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) {
        setPreview(() => URL.createObjectURL(acceptedFiles[0]));
        setFiles(acceptedFiles);
      }
    },
    onDropRejected: (error) => {
      error.map((e) => {
        e.errors.map((r) => {
          if (r.code === "file-too-large") {
            toast.error(`File size too large`);
          }
        });
      });
    },
  });

  const upload = async () => {
    try {
      if (!files.length) return toast.warning("There's no file to upload");
      const res = await startUpload();
      if (!res) return toast.error("Could not upload file");
      getValue(res[0].file.secure_url, files);
      setFiles([]);
      toast.success("File uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again");
      setFiles([]);
      setPreview("");
    }
  };

  useEffect(() => {
    if (files.length) {
      upload();
    }
  }, [files]);

  return (
    <section
      className={cn(
        "border overflow-hidden dark:border-gray-700 dark:bg-gray-800 bg-gray-100",
        className
      )}
    >
      <div
        style={{ width: "100%", height: "100%" }}
        {...getRootProps({ className: "dropzone" })}
      >
        <input {...getInputProps()} />
        <div className="w-full h-full relative">
          {preview.length ? (
            <>
              <div className="relative w-full h-full" key={preview}>
                <Image
                  src={preview}
                  alt="uploaded image"
                  className="object-cover w-full"
                  fill
                />
              </div>
            </>
          ) : null}
          {isUploading ? (
            <>
              <div className="z-50 bg-muted/40 absolute inset-0 w-full h-full backdrop-blur-lg flex items-center justify-center">
                <Loader className="w-8 h-8" />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
