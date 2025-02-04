import dayjs from 'dayjs';

export const daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export const initialDate = dayjs()
export const initialState = {
    id: initialDate,
    inBedTime: initialDate.subtract(1, "day").startOf("day"),
    fallAsleep: initialDate.subtract(1, "day").endOf("day"),
    timeAwake: initialDate,
    outOfBed: initialDate,
    totalTimeAwake: 0.00,
    sleepQuality: "",
    napTime: 0,
    notes: "",
}

