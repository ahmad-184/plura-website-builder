"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";

export const setPipelineIdInCookie = async (id: string) => {
  if (!id) return;
  cookies().set({
    name: "pipeline_id",
    value: id,
  });
  return true;
};

export const getPipelinesWithAllDataWithSubaccountId = async (
  subaccountId: string
) => {
  try {
    const res = await db.pipeline.findMany({
      where: {
        subAccountId: subaccountId,
      },
      include: {
        Lane: {
          include: {
            Tickets: true,
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

export const findFirstPipelineBysubaccountId = async (subaccountId: string) => {
  try {
    const res = await db.pipeline.findFirst({
      where: {
        subAccountId: subaccountId,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const findSubaccountPipeline = async (subaccountId: string) => {
  try {
    const res = await db.pipeline.findMany({
      where: {
        subAccountId: subaccountId,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getPipeline = async (id: string) => {
  try {
    const res = await db.pipeline.findUnique({
      where: {
        id,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createPipeline = async (data: {
  name: string;
  subAccountId: string;
}) => {
  try {
    const res = await db.pipeline.create({
      data: {
        name: data.name,
        subAccountId: data.subAccountId,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deletePipeline = async (id: string) => {
  try {
    const res = await db.pipeline.delete({
      where: {
        id,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updatePipeline = async (data: {
  name: string;
  subAccountId: string;
  id: string;
}) => {
  try {
    const res = await db.pipeline.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        subAccountId: data.subAccountId,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};
