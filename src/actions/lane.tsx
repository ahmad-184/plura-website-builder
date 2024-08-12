import { db } from "@/lib/db";

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
