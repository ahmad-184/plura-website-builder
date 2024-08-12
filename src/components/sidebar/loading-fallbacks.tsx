import { Skeleton } from "../ui/skeleton";

export const AccountsSkeleton = () => {
  return <Skeleton className="w-full h-[4rem] rounded-md my-4" />;
};

export const SidebarOptionsSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-20 mb-6 h-4" />
      <Skeleton className="w-full h-12 mb-3" />
      <Skeleton className="w-[312px] h-7 mb-2" />
      <Skeleton className="w-[312px] h-7 mb-2" />
      <Skeleton className="w-[312px] h-7 mb-2" />
      <Skeleton className="w-[312px] h-7 mb-2" />
      <Skeleton className="w-[312px] h-7 mb-2" />
      <Skeleton className="w-[312px] h-7 mb-2" />
    </div>
  );
};
