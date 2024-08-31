"use client";

import { AlertDialog } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Funnel, FunnelPage } from "@prisma/client";
import { CheckIcon, ExternalLink, LucideEdit } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import FunnelStepCard from "./funnel-step-card";
import FunnelPageDetails from "@/components/funnel-page-details";
import { updateFunnelPagesOrder } from "@/actions/funnel";
import { toast } from "sonner";
import CreateFunnelPage from "../create-funnel-page";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FunnelsSteps({
  subaccountId,
  funnelId,
  funnel,
  pages,
}: {
  subaccountId: string;
  funnelId: string;
  funnel: Funnel;
  pages: FunnelPage[];
}) {
  const [activePage, setActivePage] = useState<FunnelPage | undefined>(
    !!pages.length ? pages[0] : undefined
  );
  const [pagesState, setPagesState] = useState<FunnelPage[]>([]);

  useEffect(() => {
    setPagesState(pages);
    setActivePage((prev) => {
      if (!prev) return;
      const find_page = pages.find((e) => e.id === prev.id);
      if (find_page) return find_page;

      return pages.length ? pages[0] : undefined;
    });
  }, [pages]);

  const onDragStart = (event: DragStart) => {
    //current chosen page
    const { draggableId } = event;
    const value = pagesState.find((page) => page.id === draggableId);
  };

  const onDragEnd = async (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    //no destination or same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx };
      });

    setPagesState(newPageOrder);

    try {
      await updateFunnelPagesOrder(newPageOrder);
    } catch (err) {
      console.log(err);
      toast.error("Error", { description: "Could not save page order" });
    }
  };

  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col min-h-[300px]">
        <aside className="flex-[0.3] bg-background p-6  flex flex-col justify-between ">
          <ScrollArea className="h-full">
            <div className="flex gap-4 mb-4 items-center">
              <CheckIcon />
              Funnel Steps
            </div>
            {pages.length ? (
              <>
                <DragDropContext
                  onDragEnd={onDragEnd}
                  onDragStart={onDragStart}
                >
                  <Droppable
                    droppableId="funnels"
                    direction="vertical"
                    key="funnels"
                  >
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {pagesState.map((page, idx) => (
                          <div
                            className="relative"
                            key={page.id}
                            onClick={() => setActivePage(page)}
                          >
                            <FunnelStepCard
                              page={page}
                              index={idx}
                              isPageActive={page.id === activePage?.id}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-6">
                ...No Pages...
              </div>
            )}
          </ScrollArea>
          <CreateFunnelPage funnelId={funnelId} subaccountId={subaccountId} />
        </aside>
        <aside className="flex-[0.7] bg-muted p-4">
          {!!pagesState.length && activePage ? (
            <>
              <Card className="h-full flex justify-between flex-col">
                <CardHeader>
                  <p className="text-sm text-muted-foreground">Page name</p>
                  <CardTitle>{activePage?.name}</CardTitle>
                  <CardDescription className="flex flex-col gap-4">
                    <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                      <Tooltip>
                        <TooltipTrigger type="button" asChild>
                          <a
                            href={`/editor/${funnelId}/${activePage?.id}`}
                            className="relative group"
                          >
                            <div className="cursor-pointer group-hover:opacity-30 w-full">
                              <FunnelPagePlaceholder />
                            </div>
                            <LucideEdit
                              size={50}
                              className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transofrm -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                            />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="bg-primary text-gray-50">
                          Edit Page
                        </TooltipContent>
                      </Tooltip>

                      <a
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${activePage?.pathName}`}
                        className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                      >
                        <ExternalLink size={15} />
                        <div className="w-64 overflow-hidden overflow-ellipsis ">
                          {process.env.NEXT_PUBLIC_SCHEME}
                          {funnel.subDomainName}.
                          {process.env.NEXT_PUBLIC_DOMAIN}/
                          {activePage?.pathName}
                        </div>
                      </a>
                    </div>

                    <FunnelPageDetails
                      subaccountId={subaccountId}
                      funnelPage={activePage}
                      funnelId={funnelId}
                    />
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  );
}
