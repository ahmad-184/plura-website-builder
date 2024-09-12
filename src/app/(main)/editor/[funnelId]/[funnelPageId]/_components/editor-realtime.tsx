"use client";

import { getCurrentUser } from "@/actions/auth";
import { getFunnelPage } from "@/actions/funnel";
import { supabase } from "@/lib/supabase";
import { useEditor } from "@/providers/editor-store-provider";
import { EditorElement } from "@/stores/editor-store/editor-type";
import { FunnelPage, User } from "@prisma/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  const channel = useEditor((store) => store.channel);
  const setChannel = useEditor((store) => store.setChannel);
  const setOnlineUsers = useEditor((store) => store.setOnlineUsers);

  const router = useRouter();

  const { refetch } = useQuery({
    queryFn: () => getFunnelPage(pageDetails.id),
    queryKey: ["funnel-page-data"],
    initialData: pageDetails,
    retry: 3,
  });

  useEffect(() => {
    if (!pageDetails || !funnelId || !subaccountId) return;
    loadData({
      elements: pageDetails.content
        ? (JSON.parse(pageDetails?.content as string) as EditorElement[])
        : [
            {
              type: "__body",
              content: [],
              id: "__body",
              name: "Body",
              styles: {},
              classnames: "",
            },
          ],
      funnelId,
      pageDetails,
      subaccountId,
      withLive: false,
    });
  }, [pageDetails, funnelId, subaccountId]);

  useEffect(() => {
    if (!pageDetails.id || !funnelId || !subaccountId) return;
    let new_channel: RealtimeChannel | null = null;
    if (new_channel) {
      supabase.removeChannel(new_channel);
      if (channel) supabase.removeChannel(channel);
      setChannel({ channel: null });
      new_channel = supabase.channel(String(pageDetails.id));
    } else {
      new_channel = supabase.channel(String(pageDetails.id));
    }

    if (new_channel) {
      new_channel.subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }

        new_channel.on(
          "broadcast",
          { event: "page_details:updated" },
          async (payload) => {
            const { data } = await refetch();
            if (data) {
              loadData({
                elements: data.content
                  ? (JSON.parse(data?.content as string) as EditorElement[])
                  : [
                      {
                        type: "__body",
                        content: [],
                        id: "__body",
                        name: "Body",
                        styles: {},
                        classnames: "",
                      },
                    ],
                pageDetails: data,
              });
              if (data.name !== pageDetails.name) router.refresh();
            }
          }
        );

        setChannel({ channel: new_channel });
        const currentUser = await getCurrentUser();

        if (currentUser) {
          new_channel.track({
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl,
          });
        }

        new_channel.on("presence", { event: "sync" }, async () => {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            const newState = new_channel.presenceState();
            const newOnlineUsers = Object.values(newState).flat() as any;
            const otherColls = newOnlineUsers.filter(
              (e: User) => e.id !== currentUser.id
            );
            setOnlineUsers({ users: otherColls });
          }
        });
      });
    }

    return () => {
      if (new_channel) supabase.removeChannel(new_channel);
      if (channel) {
        supabase.removeChannel(channel);
        setChannel({ channel: null });
      }
    };
  }, [pageDetails.id, funnelId, subaccountId]);

  return <>{children}</>;
};

export default EditorRealtime;
