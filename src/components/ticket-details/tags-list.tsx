import { cn } from "@/lib/utils";
import { Tag } from "@prisma/client";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTagAction, deleteTagAction } from "@/actions";
import Loader from "../loader";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { Skeleton } from "../ui/skeleton";
import TagComponent from "./tag";

const TagColors = ["BLUE", "ORANGE", "ROSE", "PURPLE", "GREEN"] as const;
export type TagColor = (typeof TagColors)[number];

const TagsList = ({
  subaccountId,
  allTags,
  selectedTags,
  refetchTags,
  isFetchingTags,
  handlAddTagToSelectedTags,
}: {
  subaccountId: string;
  allTags: Tag[];
  selectedTags: Tag[];
  refetchTags: () => void;
  isFetchingTags: boolean;
  handlAddTagToSelectedTags: (tag: Tag) => void;
}) => {
  const [selectedColor, setSelectedColor] = useState<
    "BLUE" | "ORANGE" | "ROSE" | "PURPLE" | "GREEN"
  >("BLUE");
  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);

  const { mutate: createTag, isPending: createTagPending } = useMutation({
    mutationFn: createTagAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Tag created",
          icon: "🎉",
        });
        refetchTags();
        setSearchText("");
      }
    },
  });

  const { mutate: deleteTag, isPending: deleteTagPending } = useMutation({
    mutationFn: deleteTagAction,
    onSuccess: (e) => {
      if (e.error)
        return toast.error("Error", { description: e.error, icon: "🛑" });
      if (e.data) {
        toast.success("Success", {
          description: "Tag deleted",
        });
        setOpen(false);
        refetchTags();
      }
    },
  });

  const onCreateTag = () => {
    if (isFetchingTags) return;
    if (searchText.trim().length < 3) {
      toast.warning("Tag must have more than 3 characters");
    } else {
      createTag({
        name: searchText,
        color: selectedColor,
        subaccountId,
      });
    }
  };

  const isLoading = useMemo(() => {
    if (createTagPending || isFetchingTags || deleteTagPending) return true;
    else return false;
  }, [createTagPending, isFetchingTags, deleteTagPending]);

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <div className="w-full flex flex-col gap-2 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm dark:text-gray-300">Add tags</h3>
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex gap-2">
            {TagColors.map((e, i) => {
              const isSelected = Boolean(selectedColor == e);

              return (
                <>
                  <div
                    className={cn(
                      "p-2 rounded-sm flex-shrink-0 text-xs cursor-pointer",
                      {
                        "bg-[#57acea]/30 text-[#57acea]":
                          e === "BLUE" && isSelected,
                        "bg-[#ffac7e]/30 text-[#ffac7e]":
                          e === "ORANGE" && isSelected,
                        "bg-rose-500/30 text-rose-500":
                          e === "ROSE" && isSelected,
                        "bg-emerald-400/30 text-emerald-400":
                          e === "GREEN" && isSelected,
                        "bg-purple-400/30 text-purple-400":
                          e === "PURPLE" && isSelected,
                        "border-[1px] border-[#57acea]": e === "BLUE",
                        "border-[1px] border-[#ffac7e]": e === "ORANGE",
                        "border-[1px] border-rose-500": e === "ROSE",
                        "border-[1px] border-emerald-400": e === "GREEN",
                        "border-[1px] border-purple-400": e === "PURPLE",
                      }
                    )}
                    key={e + i}
                    onClick={() => {
                      if (e) setSelectedColor(e);
                    }}
                  ></div>
                </>
              );
            })}
          </div>
          <div className="w-full flex gap-2 select-none items-center flex-wrap min-h-10 bg-background p-2 px-3 rounded-lg">
            {selectedTags?.map((e) => (
              <Badge
                key={e.id}
                className={cn("text-gray-100", {
                  "bg-[#57acea]/30 hover:bg-[#57acea]/30 text-[#57acea]":
                    e.color === "BLUE",
                  "bg-[#ffac7e]/30 hover:bg-[#ffac7e]/30 text-[#ffac7e]":
                    e.color === "ORANGE",
                  "bg-rose-500/30 hover:bg-rose-500/30 text-rose-500":
                    e.color === "ROSE",
                  "bg-emerald-400/30 hover:bg-emerald-400/30 text-emerald-400":
                    e.color === "GREEN",
                  "bg-purple-400/30 hover:bg-purple-400/30 text-purple-400":
                    e.color === "PURPLE",
                })}
              >
                {e.name}
              </Badge>
            ))}
            {!selectedTags?.length ? (
              <p className="text-xs text-muted-foreground">
                No Tags Selected...
              </p>
            ) : null}
          </div>
          <Command className="bg-transparent">
            <div className="w-full flex items-center gap-2 pr-3">
              <CommandInput
                placeholder="Search or create tag..."
                searchDivClassName="border-0 flex-1"
                onValueChange={(e) => setSearchText(e)}
                value={searchText}
              />
              <Tooltip>
                <TooltipTrigger type="button">
                  <div className="cursor-pointer w-4 h-4" onClick={onCreateTag}>
                    {isLoading ? (
                      <Loader
                        className="w-full"
                        loaderColor="dark:fill-white fill-black dark:text-gray-700"
                      />
                    ) : (
                      <PlusCircleIcon size={17} />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-primary text-gray-200">
                  {isFetchingTags ? "Fetching tags" : "Create New Tag"}
                </TooltipContent>
              </Tooltip>
            </div>
            <CommandList className="max-h-[200px] overflow-auto">
              <CommandEmpty className="text-muted-foreground text-center text-xs py-4">
                ...No Result Found...
              </CommandEmpty>
              <CommandGroup>
                {allTags.map((e) => (
                  <CommandItem
                    key={e.id}
                    className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer"
                  >
                    <div onClick={() => handlAddTagToSelectedTags(e)}>
                      <TagComponent tag={e} />
                    </div>
                    <AlertDialogTrigger>
                      <div>
                        <Trash2Icon
                          size={15}
                          className="cursor-pointer text-muted-foreground hover:text-rose-400  transition-all"
                        />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="z-[500]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          This action cannot be undone. This will permanently
                          delete your the tag and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="items-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <ButtonWithLoaderAndProgress
                          variant="destructive"
                          onClick={() => deleteTag({ id: e.id })}
                          loading={deleteTagPending}
                          disabled={deleteTagPending}
                        >
                          Delete
                        </ButtonWithLoaderAndProgress>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))}
                {isFetchingTags && !allTags.length ? (
                  <>
                    {[1, 2, 3, 4].map((e) => (
                      <CommandItem key={e}>
                        <Skeleton className="w-full h-8 rounded-lg" />
                      </CommandItem>
                    ))}
                  </>
                ) : null}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </AlertDialog>
  );
};

export default TagsList;
