import bcrypt from "bcryptjs";
import { NotificationsType } from "@/actions/notification";
import { User } from "@prisma/client";
import packDataByDate from "./packDataByDate";
import { Schema } from "zod";
import jwt from "jsonwebtoken";
import { PublicError } from "./errors";
import { HistoryState } from "@/providers/editor/editor-types";

export async function hashPassword(
  plainTextPassword: string,
  salt: number = 10
) {
  return await bcrypt.hash(plainTextPassword, salt);
}

export function generateRandomSixDigitNumber(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export const createHash = async (string: string) => {
  return await bcrypt.hash(string, 10);
};

export const compareHashes = (candidate: string, mainValue: string) => {
  return bcrypt.compare(candidate, mainValue);
};

export const returnUserDataUseCase = (data: User) => {
  return {
    id: data.id,
    agencyId: data.agencyId,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt,
    email: data.email,
    name: data.name,
    role: data.role,
    updatedAt: data.updatedAt,
  };
};

export const packNotificationsByDate = (
  notifs: NotificationsType
): { date: string; data: NotificationsType }[] => {
  const d = packDataByDate(notifs) as {
    [date: string]: NotificationsType | [];
  };

  let data: { date: string; data: NotificationsType }[] = [];
  for (let obj of Object.entries(d)) {
    data.push({
      date: obj[0],
      data: obj[1],
    });
  }

  return data;
};

export const ZodValidator = <T>(schema: Schema, data: T): T => {
  const res = schema.safeParse(data);
  if (!res.success) throw new PublicError(res.error.message);
  return res.data;
};

export const createJwtToken = async ({
  data,
  expireAt,
}: {
  data: any;
  expireAt: number;
}) => {
  return await jwt.sign(data, process.env.PW!, {
    expiresIn: expireAt,
  });
};

export const verifyJwtToken = async (token: string) => {
  const res = await jwt.verify(token, process.env.PW!);
  return res;
};

export const saveHistoryToLocalStorage = (history: {
  funnelPageId: string;
  history: HistoryState;
}) => {
  if (!window) return;
  const get_state = window.localStorage.getItem("editors_history") as string;
  let allHistories = JSON.parse(get_state) as {
    funnelPageId: string;
    history: HistoryState;
  }[];
  const history_exist = allHistories.find(
    (h) => h.funnelPageId === history.funnelPageId
  );
  if (history_exist) {
    const history_index = allHistories.findIndex(
      (h) => h.funnelPageId === history.funnelPageId
    );
    allHistories[history_index] = history;
  } else {
    allHistories = [...allHistories, history];
  }
  window.localStorage.setItem("editors_history", JSON.stringify(allHistories));
};

export const getHistoryFromLocalStorage = (funnelPageId: string) => {
  if (!window) return;
  const get_state = window.localStorage.getItem("editors_history") as string;
  let allHistories = JSON.parse(get_state) as {
    funnelPageId: string;
    history: HistoryState;
  }[];

  const history_exist = allHistories.find(
    (h) => h.funnelPageId === funnelPageId
  );

  return history_exist;
};
