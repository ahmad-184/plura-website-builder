"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { Lane } from "@prisma/client";

export const getPipelineLanesWithAllData = async (pipelineId: string) => {
  try {
    const res = await db.lane.findMany({
      where: {
        pipelineId,
      },
      include: {
        Tickets: {
          include: {
            Tags: true,
            Assigned: true,
            Customer: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateLaneOrder = async (lanes: Lane[]) => {
  try {
    const updates = lanes.map((e) =>
      db.lane.update({
        where: {
          id: e.id,
        },
        data: {
          order: e.order,
        },
      })
    );

    await db.$transaction(updates);

    return "Done";
  } catch (err) {
    return returnError(err as Error);
  }
};
