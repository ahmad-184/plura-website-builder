import useUpload from "@/hooks/use-upload";
import { CloudUploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import { Progress } from "../ui/progress";

export default function DropzoneComponent({
  max_file = 1,
  maxSize = 1,
  getValue,
  value,
}: {
  max_file?: number;
  maxSize?: number;
  getValue: (url: string) => void;
  value?: string | null | undefined;
}) {
  const [filesPreview, setFilesPreview] = useState<
    (File & { preview: string })[]
  >([]);

  const { files, isUploading, progress, startUpload, setFiles } = useUpload({
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
      setFilesPreview(
        acceptedFiles.map((file) => {
          const res = Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
          return res;
        })
      );
      setFiles(acceptedFiles);
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

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      filesPreview.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const upload = async () => {
    try {
      if (!files.length) return toast.warning("There's no file to upload");
      const res = await startUpload();
      if (!res) return toast.error("Could not upload file");
      getValue(res[0].file.secure_url);
      toast.success("File uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again");
      setFiles([]);
      setFilesPreview([]);
    }
  };

  const removeFiles = () => {
    setFiles([]);
    setFilesPreview([]);
    getValue("");
  };

  useEffect(() => {
    if (files.length) {
      upload();
    }
  }, [files]);

  return (
    <section className="w-full border dark:border-gray-700 dark:bg-gray-800 bg-gray-100 rounded-lg h-[200px]">
      <div
        style={{ width: "100%", height: "100%" }}
        {...getRootProps({ className: "dropzone" })}
      >
        <input {...getInputProps()} />
        <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
          {value ? (
            <>
              <div className="relative w-40 h-40" key={value}>
                <Image
                  src={value}
                  alt="uploaded image"
                  className="object-contain"
                  fill
                />
              </div>
            </>
          ) : filesPreview.length ? (
            <>
              {filesPreview.map((file) => (
                <div className="relative w-40 h-40" key={file.name}>
                  <Image
                    src={file.preview}
                    alt="uploaded image"
                    className="object-contain"
                    fill
                  />
                </div>
              ))}
            </>
          ) : (
            <div>
              <CloudUploadIcon className="w-[55px] h-[55px] dark:text-gray-400 text-gray-500" />
            </div>
          )}
          {files.length || value ? null : (
            <p className="dark:text-blue-400 text-blue-700">
              Choose file or drag and drop
            </p>
          )}
          <small className="text-muted-foreground">max size: {maxSize}mb</small>
          {isUploading ? (
            <div className="w-[80%]">
              <Progress value={progress} className="w-full" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
