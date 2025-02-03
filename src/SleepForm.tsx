import type { ChangeEvent, FormEvent } from "react"
import type { Dayjs, SleepLog, SleepEntry } from "./types";
import { useState } from "react"
import { createPortal } from 'react-dom'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import AddIcon from "./AddIcon";
import SaveIcon from "./SaveIcon";
import CancelIcon from "./CancelIcon";
import ReadOnlyTextInput from "./ReadyOnlyTextInput";

const initialDate = dayjs()
const initialState = {
    inBedTime: initialDate.subtract(1, "day").startOf("day"),
    fallAsleep: initialDate.subtract(1, "day").endOf("day"),
    timeAwake: initialDate,
    outOfBed: initialDate,
    totalTimeAwake: 0.00,
    sleepQuality: "",
    napTime: 0,
    notes: "",
}

export default function SleepLog() {
    const [showForm, setShowForm] = useState(false);
    const [sleepLog, setSleepLog] = useState<SleepLog>(initialState);
    const [formError, setFormError] = useState("");

    const timeInBed = sleepLog.outOfBed ? sleepLog.outOfBed.diff(sleepLog.inBedTime, "hours", true) : 0;
    const totalSleep = timeInBed - sleepLog.totalTimeAwake;
    const sleepEfficiency = totalSleep > 0 ? (totalSleep / timeInBed) * 100 : 0;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSleepLog(p => ({ ...p, [e.target.name]: parseFloat(e.target.value || "0") }));
    };

    const handleFieldChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setSleepLog(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleDateChange = (name: string, value: Dayjs | null) => {
        setSleepLog(p => ({ ...p, [name]: value }));
    }

    const handleCancelForm = () => {
        setSleepLog(initialState);
        setShowForm(false);
        setFormError("");
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFormError("");
        try {
            if (!sleepLog.sleepQuality) {
                throw new Error("You must choose a quality of sleep option!");
            }

            const sleepEntries: Array<SleepEntry> = JSON.parse(localStorage.getItem("entries") || "[]");
            const entryId = dayjs(sleepLog.timeAwake).startOf("day").valueOf();
            if (sleepEntries.some(({ id }) => id === entryId)) {
                throw new Error(`An entry for ${dayjs(entryId).format("MM/DD/YYYY")} already exists!`);
            }

            sleepEntries.push({ ...sleepLog, id: entryId, totalSleep, sleepEfficiency });
            localStorage.setItem("entries", JSON.stringify(sleepEntries));
            handleCancelForm();
        } catch (error) {
            setFormError(`Unable to save entry. Reason: ${(error as Error)?.message}`);
        }
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
                    <dialog className="relative z-50 flex flex-col max-w-xl h-full max-h-full overflow-y-auto sm:h-auto sm:m-4 sm:rounded-md" aria-modal="true">
                        <div className="flex flex-row items-center border-b border-gray-300 bg-gray-50">
                            <div className="h-14 p-4 w-14" />
                            <header className="flex-1 py-2">
                                <h2 className="text-3xl font-bold text-center">Sleep Log Entry</h2>
                            </header>
                            <div className="flex justify-end rounded-full w-14 mr-1">
                                <button
                                    type="button"
                                    title="Cancel"
                                    className="cursor-pointer rounded p-3 transition-all hover:text-red-500"
                                    onClick={handleCancelForm}
                                >
                                    <CancelIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 space-y-5 overflow-y-auto bg-gray-50 p-5 relative !overflow-x-hidden !bg-white sm:h-auto">
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
                                        <label className="block text-sm font-bold" htmlFor="nap-time">Nap time (in hours):</label>
                                        <input
                                            id="nap-time"
                                            className="w-full py-3.5 pl-3.5 border border-gray-400 rounded"
                                            name="napTime"
                                            type="number"
                                            step="0.1"
                                            value={sleepLog.napTime}
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
                                            onChange={handleFieldChange}
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
                                        <label className="block text-sm font-bold" htmlFor="notes">Notes:</label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            className="w-full p-1 border border-gray-400 rounded"
                                            value={sleepLog.notes}
                                            onChange={handleFieldChange}
                                        />
                                    </div>
                                    {formError.length > 0 && <p className="text-red-500 font-semibold">{formError}</p>}
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
                                    <ReadOnlyTextInput id="time-asleep" label="Sleep duration in bed:" value={`${totalSleep?.toFixed(1)} hours`} />
                                    <ReadOnlyTextInput id="time-in-bed" label="Time spent in bed:" value={`${timeInBed?.toFixed(1)} hours`} />
                                    <ReadOnlyTextInput id="sleep-efficiency" label="Sleep efficiency:" value={`${sleepEfficiency?.toFixed(2)}%`} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-initial border-t border-b border-gray-300 bg-gray-50 p-4" />
                    </dialog>
                </div>
            </div>,
            document.body
        )
    )
}
