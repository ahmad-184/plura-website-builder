"use server";

import { db } from "@/lib/db";
import { Ticket } from "@prisma/client";

export const updateTicketOrder = async (tickets: Ticket[]) => {
  try {
    const updates = tickets.map((e) =>
      db.ticket.update({
        where: {
          id: e.id,
        },
        data: {
          order: e.order,
          laneId: e.laneId,
        },
      })
    );

    await db.$transaction(updates);
  } catch (err) {
    console.log(err);
  }
};
