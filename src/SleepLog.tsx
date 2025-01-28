import type { FormEvent } from "react"
import type { Dayjs } from 'dayjs';
import { useState } from "react"
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


/*
 * time in bed
 * fall asleep
 * total time awake
 * time awake
 * get out of bed
 * final awake time
 * time in bed
 * total time asleep
 * sleep efficiency
 * quality of sleep
 * nap time yesterday
 */
type SleepLog = {
    inBedTime: Dayjs | null
    fallAsleep: Dayjs | null
    timeAwake: Dayjs | null
    outOfBed: number
    totalTimeAwake: number
    totalTimeAsleep: number
    sleepEfficiency: number
    sleepQuality: number
    napTime: number
}

const initialDate = dayjs()

export default function SleepLog() {
    const [sleepLog, setSleepLog] = useState<SleepLog>({
        inBedTime: initialDate,
        fallAsleep: initialDate,
        timeAwake: initialDate,
        totalTimeAwake: 0,
        outOfBed: 0,
        totalTimeAsleep: 0,
        sleepEfficiency: 0,
        sleepQuality: 0,
        napTime: 0,
    });

    // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setSleepLog(p => ({ ...p, [e.target.name]: new Date(e.target.value) }));
    //     console.log({ [e.target.name]: e.target.value });
    // };
    //
    const handleDateChange = (prop: string, value: Dayjs | null) => {
        setSleepLog(p => ({ ...p, [prop]: value }));
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert(JSON.stringify(sleepLog, null, 2));
    }

    return (
        <>
            <div>{JSON.stringify(sleepLog, null, 2)}</div>
            <form onSubmit={handleFormSubmit} className="w-full space-y-4">
                <div>
                    <DateTimePicker
                        label="What time did you get into bed?"
                        value={sleepLog.inBedTime}
                        onChange={(v) => handleDateChange("inBedTime", v)}
                    />
                </div>
                <div>
                    <DateTimePicker
                        label="About what time did you fall asleep?"
                        value={sleepLog.fallAsleep}
                        onChange={(v) => handleDateChange("fallAsleep", v)}
                    />
                </div>
                <div>
                    <DateTimePicker
                        label="What time did you awake?"
                        value={sleepLog.timeAwake}
                        onChange={(v) => handleDateChange("timeAwake", v)}
                    />
                </div>
            </form>
        </>
    )
}
