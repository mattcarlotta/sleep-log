export type { Dayjs } from 'dayjs';

export type SleepLog = {
    inBedTime: Dayjs | null
    fallAsleep: Dayjs | null
    timeAwake: Dayjs | null
    outOfBed: Dayjs | null
    totalTimeAwake: number
    sleepQuality: string
    napTime: number
    notes: string
}

export type SleepEntry = SleepLog & { id: number, totalSleep: number, sleepEfficiency: number };

