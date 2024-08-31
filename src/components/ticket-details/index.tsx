"use client";

import { ticketFormSchemaType, TicketWithAllRelatedDataType } from "@/types";
import { Tag, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { ticketFormSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import FormInput from "../custom/form-input";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { createTicketAction, updateTicketAction } from "@/actions";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Textarea } from "../ui/text-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CreateAddTags from "./tags-list";
import { getSubaccountTags } from "@/actions/tag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CustomAvatar from "../custom/custom-avatar";
import { getSubaccountContacts } from "@/actions/contact";
import { getSubaccountTeamMembers } from "@/actions/user";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function TicketDetails({
  laneId,
  subaccountId,
  ticket,
  setNewTicket,
  updateOneTicket,
  channel,
}: {
  subaccountId: string;
  laneId: string;
  ticket?: TicketWithAllRelatedDataType;
  setNewTicket?: (ticket: TicketWithAllRelatedDataType) => void;
  updateOneTicket?: (ticket: TicketWithAllRelatedDataType) => void;
  channel?: RealtimeChannel | null;
}) {
  const router = useRouter();

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>(
    ticket?.Assigned ? [ticket?.Assigned] : []
  );

  const handlAddTagToSelectedTags = (tag: Tag) => {
    if (selectedTags.find((e) => e.id === tag.id)) {
      setSelectedTags((prev) => prev.filter((e) => e.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const form = useForm<ticketFormSchemaType>({
    resolver: zodResolver(ticketFormSchema),
    mode: "onSubmit",
    defaultValues: {
      assignedUserId: "",
      customerId: "",
      laneId,
      name: "",
      subaccountId,
      value: "",
    },
  });

  useEffect(() => {
    if (!form.getValues("laneId") || !form.getValues("subaccountId"))
      form.reset({ laneId, subaccountId });
  }, [laneId, subaccountId]);

  const [allTagsData, teamMembersData, contactsData] = useQueries({
    queries: [
      {
        queryFn: async () => {
          return await getSubaccountTags(subaccountId);
        },
        queryKey: ["tags"],
        retry: 3,
      },
      {
        queryFn: async () => {
          return await getSubaccountTeamMembers(subaccountId);
        },
        queryKey: ["team-members"],
        retry: 3,
      },
      {
        queryFn: async () => {
          return await getSubaccountContacts(subaccountId);
        },
        queryKey: ["subaccount-contacts"],
        retry: 3,
      },
    ],
  });

  useEffect(() => {
    if (teamMembersData.data) {
      if (ticket?.Assigned) {
        if (teamMembersData.data.find((e) => e.id === ticket.Assigned?.id)) {
          setTeamMembers(teamMembersData.data);
        } else setTeamMembers([ticket.Assigned, ...teamMembersData.data]);
      } else setTeamMembers(teamMembersData.data);
    }
  }, [teamMembersData.data]);

  useEffect(() => {
    if (ticket) {
      if (ticket.Assigned) setTeamMembers([ticket.Assigned]);
      setSelectedTags(ticket.Tags);
      form.reset({
        assignedUserId: ticket.assignedUserId,
        customerId: ticket.customerId,
        description: ticket.description || "",
        laneId: ticket.laneId,
        name: ticket.name,
        subaccountId: subaccountId,
        value: ticket?.value,
      });
    }
  }, [ticket]);

  useEffect(() => {
    if (ticket) {
      if (teamMembersData.data) {
        form.setValue("assignedUserId", ticket.assignedUserId);
      }
    }
  }, [ticket?.id, contactsData.data]);

  const { mutate: createTicket, isPending: createTicketPending } = useMutation({
    mutationFn: createTicketAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Ticket created",
          icon: "🎉",
        });
        if (setNewTicket) setNewTicket(e);
        form.reset();
        setSelectedTags([]);
        router.refresh();
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "lanes:updated",
            payload: { message: "update lanes details" },
          });
        }
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const { mutate: updateTicket, isPending: updateTicketPending } = useMutation({
    mutationFn: updateTicketAction,
    onSuccess: (e) => {
      if (e) {
        toast.success("Success", {
          description: "Ticket updated",
          icon: "🎉",
        });
        if (updateOneTicket) updateOneTicket(e);
        router.refresh();
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "lanes:updated",
            payload: { message: "update lanes details" },
          });
        }
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message, icon: "🛑" });
    },
  });

  const onSubmit = async (values: ticketFormSchemaType) => {
    if (ticket?.id) {
      updateTicket({ data: { ...values, id: ticket.id }, tags: selectedTags });
    } else {
      createTicket({ data: values, tags: selectedTags });
    }
  };

  const isLoading = useMemo(() => {
    if (createTicketPending || updateTicketPending) return true;
    else return false;
  }, [createTicketPending, updateTicketPending]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket details</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormInput
              disabled={isLoading}
              control={form.control}
              name="name"
              label="Ticket Name"
              placeholder="Ticket name..."
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name={"description"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormInput
              disabled={isLoading}
              control={form.control}
              name="value"
              label="Ticket Value"
              placeholder="Ticket value..."
            />
            <div className="w-full my-1">
              <CreateAddTags
                allTags={allTagsData.data || []}
                selectedTags={selectedTags}
                refetchTags={allTagsData.refetch}
                isFetchingTags={allTagsData.isFetching}
                subaccountId={subaccountId}
                handlAddTagToSelectedTags={handlAddTagToSelectedTags}
              />
            </div>
            <FormField
              control={form.control}
              name="assignedUserId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <FormLabel>Assigned To Team Member</FormLabel>
                  </FormLabel>
                  {teamMembersData.isFetching &&
                  !teamMembersData.data?.length ? (
                    <Skeleton className="w-full rounded-lg h-9" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        field.value ||
                        (!!ticket?.id &&
                          teamMembers.find((e) => e.id === ticket.Assigned?.id)
                            ?.id) ||
                        undefined
                      }
                      value={
                        field.value ||
                        (!!ticket?.id &&
                          teamMembers.find((e) => e.id === ticket.Assigned?.id)
                            ?.id) ||
                        undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[500]">
                        {teamMembers?.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            <div className="w-full flex gap-2 items-center">
                              <CustomAvatar className="w-7 h-7" user={e} />
                              <span className="text-sm text-muted-foreground">
                                {e.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <FormLabel>Customer</FormLabel>
                  </FormLabel>
                  <Popover>
                    {contactsData.isFetching && !contactsData.data?.length ? (
                      <Skeleton className="w-full rounded-lg h-9" />
                    ) : (
                      <PopoverTrigger asChild>
                        <div className="flex h-10 cursor-pointer w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                          <p>
                            {contactsData.data?.find(
                              (e) => e.id === form.getValues("customerId")
                            )
                              ? contactsData.data?.find(
                                  (e) => e.id === form.getValues("customerId")
                                )?.name
                              : "Select Customer..."}
                          </p>
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </div>
                      </PopoverTrigger>
                    )}

                    <PopoverContent className="z-[500]">
                      <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                          <CommandEmpty>...No Result...</CommandEmpty>
                          <CommandGroup>
                            {contactsData.data?.map((e) => (
                              <CommandItem
                                value={e.id}
                                onSelect={() =>
                                  form.setValue("customerId", e.id)
                                }
                                key={e.id}
                              >
                                {e.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    form.getValues("customerId") === e.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <ButtonWithLoaderAndProgress
              className="mt-1"
              disabled={isLoading}
              loading={isLoading}
            >
              {!ticket?.id ? "Create Ticket" : "Save"}
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
