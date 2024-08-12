import { cn } from "@/lib/utils";
import Image from "next/image";

const UserAvatar = ({
  alt,
  src,
  className,
}: {
  alt: string;
  src: string;
  className?: string;
}) => {
  return (
    <div className="h-11 w-11 relative flex-none">
      <Image
        src={src}
        fill
        className={cn("rounded-full object-cover", className)}
        alt={alt}
      />
    </div>
  );
};
export default UserAvatar;
