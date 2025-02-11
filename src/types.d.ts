export type { Dayjs } from "dayjs";
import type { DBSchema } from "idb";

export type SleepLog = {
    id: Dayjs;
    inBedTime: Dayjs;
    fallAsleep: Dayjs;
    timeAwake: Dayjs;
    outOfBed: Dayjs;
    totalTimeAwake: number;
    sleepQuality: string;
    napTime: number;
    notes: string;
};

export type SleepLogFields = SleepLog & {
    timeInBed: number;
    totalSleep: number;
    sleepEfficiency: number;
};

export type SleepEntry = {
    id: number;
    inBedTime: string;
    fallAsleep: string;
    timeAwake: string;
    timeInBed: number;
    outOfBed: string;
    totalSleep: number;
    totalTimeAwake: number;
    sleepEfficiency: number;
    sleepQuality: string;
    napTime: number;
    notes: string;
};

export interface SleepLogDB extends DBSchema {
    entries: {
        key: number;
        value: SleepEntry;
        indexes: {
            id: number;
        };
    };
}
