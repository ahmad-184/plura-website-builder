"use client";

import { getFunnelPage } from "@/actions/funnel";
import { useEditor } from "@/providers/editor-store-provider";
import { EditorElement } from "@/providers/editor/editor-types";
import { FunnelPage } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const EditorRealtime = ({
  children,
  pageDetails,
  funnelId,
  subaccountId,
}: {
  children: React.ReactNode;
  pageDetails: FunnelPage;
  funnelId: string;
  subaccountId: string;
}) => {
  const loadData = useEditor((store) => store.loadData);
  const store = useEditor((store) => store);

  useEffect(() => {
    console.log(store);
  }, [store]);

  const { refetch, data } = useQuery({
    queryFn: () => getFunnelPage(pageDetails.id),
    queryKey: ["funnel-page-data"],
    initialData: pageDetails,
    retry: 3,
  });

  useEffect(() => {
    if (!pageDetails || !funnelId || !subaccountId) return;
    loadData({
      elements: JSON.parse(
        JSON.stringify(pageDetails.content)
      ) as EditorElement[],
      funnelId,
      pageDetails,
      subaccountId,
      withLive: false,
    });
  }, [pageDetails, funnelId, subaccountId]);

  return <>{children}</>;
};

export default EditorRealtime;
