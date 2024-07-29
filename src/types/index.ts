import { getUserAuthDetailsAction } from "@/actions";
import { inferServerActionReturnData } from "zsa";

export type UserFullDataTypes = inferServerActionReturnData<
  typeof getUserAuthDetailsAction
>;

export type SidebarType = "agency" | "subaccount";
