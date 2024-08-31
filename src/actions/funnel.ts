"use server";

import { db } from "@/lib/db";
import { PublicError, returnError } from "@/lib/errors";
import { FunnelPage } from "@prisma/client";

export const getFunnel = async (id: string) => {
  try {
    const res = await db.funnel.findUnique({
      where: { id },
    });
    return res;
  } catch (err) {
    console.log(err);
    return returnError(err as Error);
  }
};

export const getFunnelPage = async (id: string) => {
  try {
    const res = await db.funnelPage.findUnique({
      where: { id },
    });
    return res;
  } catch (err) {
    console.log(err);
    return returnError(err as Error);
  }
};

export const getFunnelWithPages = async (id: string) => {
  try {
    const res = await db.funnel.findUnique({
      where: { id },
      include: {
        FunnelPages: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return returnError(err as Error);
  }
};

export const getSubaccountFunnels = async (subaccountId: string) => {
  try {
    const res = await db.funnel.findMany({
      where: { subAccountId: subaccountId },
      include: {
        FunnelPages: true,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return returnError(err as Error);
  }
};

export const getSubaccountFunnel = async (subaccountId: string) => {
  try {
    const res = await db.funnel.findFirst({
      where: { id: subaccountId },
      include: {
        FunnelPages: true,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return returnError(err as Error);
  }
};

export const updateFunnelPagesOrder = async (pages: FunnelPage[]) => {
  try {
    const updates = pages.map((e) =>
      db.funnelPage.update({
        where: {
          id: e.id,
        },
        data: {
          order: e.order,
        },
      })
    );

    await db.$transaction(updates);
  } catch (err) {
    return returnError(err as Error);
  }
};

export const updateFunnelPageDetails = async (data: Partial<FunnelPage>) => {
  try {
    const id = data?.id;
    if (!id) throw new PublicError("Page id required");
    const res = await db.funnelPage.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return res;
  } catch (err) {
    return returnError(err as Error);
  }
};
