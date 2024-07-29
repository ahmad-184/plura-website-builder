import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";

export const LogoSkeleton = () => {
  return (
    <AspectRatio ratio={16 / 5}>
      <Skeleton className="w-full h-full rounded-md" />
    </AspectRatio>
  );
};

export const AccountsSkeleton = () => {
  return <Skeleton className="w-full h-[4rem] rounded-md my-4" />;
};

export const SidebarOptionsSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-20 mb-6 h-4" />
      <Skeleton className="w-full h-12 mb-3" />
      <Skeleton className="w-[312px] h-7 mb-2 ml-1" />
      <Skeleton className="w-[312px] h-7 mb-2 ml-1" />
      <Skeleton className="w-[312px] h-7 mb-2 ml-1" />
      <Skeleton className="w-[312px] h-7 mb-2 ml-1" />
      <Skeleton className="w-[312px] h-7 mb-2 ml-1" />
      <Skeleton className="w-[312px] h-7 mb-2 ml-1" />
    </div>
  );
};
