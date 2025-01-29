import type { ChangeEvent, FormEvent } from "react"
import type { Dayjs } from 'dayjs';
import { useState } from "react"
import { createPortal } from 'react-dom'
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddIcon from "./AddIcon";
import SaveIcon from "./SaveIcon";
import CancelIcon from "./CancelIcon";

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
const initialState = {
    inBedTime: initialDate.subtract(1, "day").startOf("day"),
    fallAsleep: initialDate.subtract(1, "day").endOf("day"),
    timeAwake: initialDate,
    outOfBed: initialDate,
    totalTimeAwake: 0.00,
    sleepQuality: "",
    napTime: 0,
}

export default function SleepLog() {
    const [showForm, setShowForm] = useState(false);
    const [sleepLog, setSleepLog] = useState<SleepLog>(initialState);

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

    const handleCancelForm = () => {
        setSleepLog(initialState);
        setShowForm(false);
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert(JSON.stringify({ ...sleepLog, timeInBed, totalSleep, sleepEfficiency }, null, 2));
        handleCancelForm();
    }

    if (!showForm) {
        return (
            <button
                type="button"
                className="absolute bottom-4 right-4 text-2xl rounded-full p-3.5 transition-all cursor-pointer bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowForm(true)}
            >
                <AddIcon className="h-8 w-8" />
            </button>
        )
    }

    return (
        createPortal(
            <div className="fixed top-0 right-0 bottom-0 left-0 z-1200">
                <div className="fixed top-0 right-0 bottom-0 left-0 z-[-1] flex items-center justify-center bg-black/70" />
                <div className="h-full flex justify-center items-center overflow-y-auto">
                    <div
                        className="flex flex-col max-w-xl mx-auto bg-white p-4 rounded"
                        role="dialog"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        aria-modal="true"
                        tabIndex={0}
                    >
                        <div className="flex justify-end">
                            <button
                                type="button"
                                title="Cancel"
                                className="flex justify-center items-center cursor-pointer rounded bg-red-600 p-2.5 text-white text-lg hover:bg-red-700"
                                onClick={handleCancelForm}
                            >
                                <CancelIcon className="h-4 w-4 fill-white" />
                            </button>
                        </div>
                        <div className="flex flex-col justify-center items-center space-y-8">
                            <header>
                                <h2 className="text-3xl border-b border-gray-500 font-bold">Sleep Log Entry</h2>
                            </header>
                            <div className="grid grid-cols-2 gap-x-6">
                                <form onSubmit={handleFormSubmit} className="space-y-4">
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
                                            className="w-full py-3.5 pl-3.5 border border-gray-400 rounded"
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
                                            className="w-full py-4 pl-3.5 border border-gray-400 rounded"
                                            value={sleepLog.sleepQuality}
                                            onChange={handleSelectChange}
                                        >
                                            <option value="">Please choose an option</option>
                                            <option value="very poor">Very Poor</option>
                                            <option value="poor">Poor</option>
                                            <option value="fair">Fair</option>
                                            <option value="good">Good</option>
                                            <option value="very good">Very Good</option>
                                        </select>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center items-center cursor-pointer rounded bg-blue-600 p-2.5 text-white text-lg font-semibold hover:bg-blue-700"
                                        >
                                            <SaveIcon className="h-6 w-6" />&nbsp;Save Entry
                                        </button>
                                    </div>
                                </form>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold" htmlFor="time-asleep">Sleep duration in bed:</label>
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
                                            value={`${sleepEfficiency?.toFixed(2)}%`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}
