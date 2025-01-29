import type { ChangeEvent, FormEvent } from "react"
import type { Dayjs } from 'dayjs';
import { useState } from "react"
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

type SleepLog = {
    inBedTime: Dayjs | null
    fallAsleep: Dayjs | null
    timeAwake: Dayjs | null
    outOfBed: Dayjs | null
    totalTimeAwake: number
    sleepQuality: string
    napTime: number
}

const initialDate = dayjs()

export default function SleepLog() {
    const [sleepLog, setSleepLog] = useState<SleepLog>({
        inBedTime: initialDate.subtract(1, "day").startOf("day"),
        fallAsleep: initialDate.subtract(1, "day").endOf("day"),
        timeAwake: initialDate,
        outOfBed: initialDate,
        totalTimeAwake: 0.00,
        sleepQuality: "",
        napTime: 0,
    });

    const timeInBed = sleepLog.outOfBed ? sleepLog.outOfBed.diff(sleepLog.inBedTime, "hours", true) : 0;
    const totalSleep = timeInBed - sleepLog.totalTimeAwake;
    const sleepEfficiency = totalSleep > 0 ? (totalSleep / timeInBed) * 100 : 0;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSleepLog(p => ({ ...p, [e.target.name]: parseFloat(e.target.value || "0") }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSleepLog(p => ({ ...p, [e.target.name]: e.target.value }));
    }

    const handleDateChange = (name: string, value: Dayjs | null) => {
        setSleepLog(p => ({ ...p, [name]: value }));
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert(JSON.stringify(sleepLog, null, 2));
    }

    return (
        <div className="grid grid-cols-2 gap-x-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <h2 className="text-2xl border-b border-gray-500">Sleep Form:</h2>
                <div>
                    <p className="text-sm font-bold">What time did you get into bed?</p>
                    <DateTimePicker
                        value={sleepLog.inBedTime}
                        onChange={(v) => handleDateChange("inBedTime", v)}
                    />
                </div>
                <div>
                    <p className="text-sm font-bold">What time did you fall asleep?</p>
                    <DateTimePicker
                        value={sleepLog.fallAsleep}
                        onChange={(v) => handleDateChange("fallAsleep", v)}
                        minDateTime={sleepLog.inBedTime || initialDate}
                    />
                </div>
                <div>
                    <p className="text-sm font-bold">What time did you awake?</p>
                    <DateTimePicker
                        value={sleepLog.timeAwake}
                        onChange={(v) => handleDateChange("timeAwake", v)}
                        minDateTime={sleepLog.fallAsleep || initialDate}
                    />
                </div>
                <div>
                    <p className="text-sm font-bold">What time did you get out of bed?</p>
                    <DateTimePicker
                        value={sleepLog.outOfBed}
                        onChange={(v) => handleDateChange("outOfBed", v)}
                        minDateTime={sleepLog.timeAwake || initialDate}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold" htmlFor="total-time-awake">Time awake in bed (in hours):</label>
                    <input
                        id="total-time-awake"
                        className="py-3.5 pl-3.5 pr-2.5 border border-gray-400 rounded"
                        name="totalTimeAwake"
                        type="number"
                        step="0.1"
                        value={sleepLog.totalTimeAwake}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold" htmlFor="sleep-quality">Quality of sleep:</label>
                    <select
                        name="sleepQuality"
                        id="sleep-quality"
                        className="py-4 pl-3.5 pr-1 border border-gray-400 rounded"
                        value={sleepLog.sleepQuality}
                        onChange={handleSelectChange}
                    >
                        <option value="">--Please choose an option--</option>
                        <option value="very poor">Very Poor</option>
                        <option value="poor">Poor</option>
                        <option value="fair">Fair</option>
                        <option value="good">Good</option>
                        <option value="very good">Very Good</option>
                    </select>
                </div>
            </form>
            <div className="space-y-4">
                <h2 className="text-2xl border-b border-gray-500">Calculated Stats:</h2>
                <div>
                    <label className="block text-sm font-bold" htmlFor="time-asleep">Time asleep in bed:</label>
                    <input
                        id="time-asleep"
                        className="py-3.5 pl-3.5 pr-6 border border-gray-400 rounded bg-gray-300"
                        type="text"
                        readOnly
                        value={`${totalSleep?.toFixed(1)} hours`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold" htmlFor="time-in-bed">Time spent in bed:</label>
                    <input
                        id="time-in-bed"
                        className="py-3.5 pl-3.5 pr-6 border border-gray-400 rounded bg-gray-300"
                        type="text"
                        readOnly
                        value={`${timeInBed?.toFixed(1)} hours`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold" htmlFor="sleep-efficiency">Sleep efficiency:</label>
                    <input
                        id="sleep-efficiency"
                        className="py-3.5 pl-3.5 pr-6 border border-gray-400 rounded bg-gray-300"
                        type="text"
                        readOnly
                        value={`${sleepEfficiency?.toFixed(1)}%`}
                    />
                </div>
            </div>
        </div>
    )
}
