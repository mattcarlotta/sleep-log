import dayjs from "dayjs";

export const daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export const initialState = {
    id: dayjs(),
    inBedTime: dayjs().subtract(1, "day").startOf("day"),
    fallAsleep: dayjs().subtract(1, "day").endOf("day"),
    timeAwake: dayjs(),
    outOfBed: dayjs(),
    totalTimeAwake: 0.0,
    sleepQuality: "",
    napTime: 0,
    notes: ""
};
