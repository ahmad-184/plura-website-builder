"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <div
        onClick={() => router.back()}
        className="relative cursor-pointer hover:underline dark:text-gray-300 left-12 md:left-0 flex items-center"
      >
        <MoveLeft size={24} />
        <p className="text-sm select-none">Back</p>
      </div>
      <div
        onClick={() => router.forward()}
        className="relative cursor-pointer hover:underline dark:text-gray-300 left-12 md:left-0 flex items-center"
      >
        <p className="text-sm select-none">Forward</p>
        <MoveRight size={24} />
      </div>
    </div>
  );
}
