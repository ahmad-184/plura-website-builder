import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

interface CustomAvatarProps {
  user: Partial<User>;
  className?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  user,
  className,
  onClick,
  width,
  height,
}) => {
  const fallbackName = user?.name
    ?.split(" ")
    .map((e) => e.split(""))
    .map((e) => e[0])
    .join("");

  return (
    <Avatar className={cn("relative", className)} onClick={onClick}>
      {user?.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={`${user?.name} profile`}
          fill
          className="object-cover w-full h-full"
        />
      ) : (
        <AvatarFallback className="uppercase select-none w-full h-full absolute bg-primary/80">
          {fallbackName}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default CustomAvatar;
