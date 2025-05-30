export type { Dayjs } from "dayjs";
import type { DBSchema, IDBPDatabase } from "idb";

export type SleepLog = {
    id: Dayjs;
    inBedTime: Dayjs;
    fallAsleep: Dayjs;
    timeAwake: Dayjs;
    outOfBed: Dayjs;
    totalTimeAwake: number | undefined;
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

export type DB = IDBPDatabase<SleepLogDB> | null;

export type DBContextT = {
    db: DB;
    sleepEntries: Array<SleepEntry>;
    isLoading: boolean;
    error: string;
    sortByDsc: boolean;
    handleSortBy: () => void;
    syncSleepEntries: () => Promise<void>;
};
