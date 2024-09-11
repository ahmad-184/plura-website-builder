"use client";

import { getSubaccountAndMedia } from "@/actions/global-use-case";
import MediaBucketItems from "@/components/media/media-bucket-items";
import { TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor-store-provider";
import { useQuery } from "@tanstack/react-query";

export default function MediaBucketTab() {
  const subaccountId = useEditor((store) => store.subaccountId);

  const { data: subaccount } = useQuery({
    queryFn: () => getSubaccountAndMedia(subaccountId),
    queryKey: [],
    retry: 3,
    refetchOnMount: true,
  });

  return (
    <TabsContent
      value="media"
      className="focus-visible:ring-transparent ring-transparent overflow-visible"
    >
      <div className="px-4 h-full">
        {subaccount?.id ? <MediaBucketItems data={subaccount} /> : <></>}
      </div>
    </TabsContent>
  );
}
