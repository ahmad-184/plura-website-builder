"use server";

import { db } from "@/lib/db";
import { PublicError } from "@/lib/errors";
import { Funnel, FunnelPage } from "@prisma/client";

export const getFunnel = async (id: string) => {
  try {
    const res = await db.funnel.findUnique({
      where: { id },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateFunnelDetails = async (data: Partial<Funnel>) => {
  try {
    const id = data?.id;
    if (!id) throw new PublicError("Funnel id required");
    const res = await db.funnel.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
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
    return null;
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
    return null;
  }
};

export const getSubaccountFunnels = async (subaccountId: string) => {
  try {
    const res = await db.funnel.findMany({
      where: { subAccountId: subaccountId },
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
    return null;
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
    return null;
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
    console.log(err);
  }
};

export const updateFunnelPageDetails = async (data: Partial<FunnelPage>) => {
  try {
    const id = data?.id;
    if (!id) throw new PublicError("Page id required");
    const res = await db.funnelPage.update({
      where: { id },
      // @ts-ignore
      data: {
        ...data,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getDomainDetails = async (subDomainName: string) => {
  try {
    if (!subDomainName) throw new PublicError("Domain name required");
    const res = await db.funnel.findFirst({
      where: { subDomainName },
      include: {
        FunnelPages: true,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};
