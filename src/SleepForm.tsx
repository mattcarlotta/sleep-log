import type { ChangeEvent, FormEvent } from "react";
import type { Dayjs, SleepLog } from "./types";
import { useState } from "react";
import dayjs from "dayjs";
import { MobileDatePicker as DatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileDateTimePicker as DateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import Modal from "./Modal";
import SaveIcon from "./SaveIcon";
import ReadOnlyTextInput from "./ReadyOnlyTextInput";
import useDBContext from "./useDBContext";

export type SleepLogProps = SleepLog & {
    isEditing: boolean;
    onFormCancel: () => void;
};

export default function SleepLog({ onFormCancel, isEditing, ...formFields }: SleepLogProps) {
    const { db, sortByDsc, setSleepEntries } = useDBContext();
    const [sleepLog, setSleepLog] = useState<SleepLog>(formFields);
    const [formError, setFormError] = useState("");

    const timeInBed = sleepLog.outOfBed ? sleepLog.outOfBed.diff(sleepLog.inBedTime, "hours", true) : 0;
    const totalSleep = timeInBed - sleepLog.totalTimeAwake;
    const sleepEfficiency = totalSleep > 0 ? (totalSleep / timeInBed) * 100 : 0;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSleepLog((p) => ({ ...p, [e.target.name]: e.target.value ? parseFloat(e.target.value) : "" }));
    };

    const handleFieldChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setSleepLog((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleDateChange = (name: string, value: Dayjs) => {
        setSleepLog((p) => ({ ...p, [name]: value.second(0).millisecond(0) }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError("");
        try {
            if (!sleepLog.sleepQuality) {
                throw new Error("You must choose a quality of sleep option!");
            }

            const entryId = dayjs(sleepLog.id).startOf("day").valueOf();
            const entryExists = await db?.get("entries", entryId);
            if (entryExists && !isEditing) {
                throw new Error(`An entry for ${dayjs(entryId).format("MM/DD/YYYY")} already exists!`);
            }

            const entry = {
                id: entryId,
                inBedTime: sleepLog.inBedTime.toISOString(),
                fallAsleep: sleepLog.fallAsleep.toISOString(),
                timeAwake: sleepLog.timeAwake.toISOString(),
                timeInBed,
                outOfBed: sleepLog.outOfBed.toISOString(),
                totalSleep,
                totalTimeAwake: sleepLog.totalTimeAwake,
                sleepEfficiency,
                sleepQuality: sleepLog.sleepQuality,
                napTime: sleepLog.napTime,
                notes: sleepLog.notes
            };

            if (isEditing) {
                await db?.put("entries", entry);
            } else {
                await db?.add("entries", entry);
            }

            const entries = (await db?.getAll("entries")) || [];

            setSleepEntries(entries.sort((a, b) => (sortByDsc ? b.id - a.id : a.id - b.id)));

            onFormCancel();
        } catch (error) {
            setFormError(`Unable to save entry. Reason: ${(error as Error)?.message}`);
        }
    };

    return (
        <Modal title="Sleep Log Entry" onCancel={onFormCancel}>
            <div className="flex flex-col justify-center items-center space-x-6 md:space-x-0 sm:items-start sm:grid sm:grid-cols-2 md:gap-x-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <p className="text-sm font-bold">What day is this entry for?</p>
                        <DatePicker
                            className="w-full"
                            readOnly={isEditing}
                            value={sleepLog.id}
                            onChange={(v) => handleDateChange("id", v)}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold">What time did you get into bed?</p>
                        <DateTimePicker
                            className="w-full"
                            value={sleepLog.inBedTime}
                            onChange={(v) => handleDateChange("inBedTime", v)}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold">What time did you fall asleep?</p>
                        <DateTimePicker
                            className="w-full"
                            value={sleepLog.fallAsleep}
                            onChange={(v) => handleDateChange("fallAsleep", v)}
                            minDateTime={sleepLog.inBedTime}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold">What time did you awake?</p>
                        <DateTimePicker
                            className="w-full"
                            value={sleepLog.timeAwake}
                            onChange={(v) => handleDateChange("timeAwake", v)}
                            minDateTime={sleepLog.fallAsleep}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold">What time did you get out of bed?</p>
                        <DateTimePicker
                            className="w-full"
                            value={sleepLog.outOfBed}
                            onChange={(v) => handleDateChange("outOfBed", v)}
                            minDateTime={sleepLog.timeAwake}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold" htmlFor="total-time-awake">
                            Time awake in bed (in hours):
                        </label>
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
                        <label className="block text-sm font-bold" htmlFor="nap-time">
                            Nap time (in hours):
                        </label>
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
                        <label className="block text-sm font-bold" htmlFor="sleep-quality">
                            Quality of sleep:
                        </label>
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
                        <label className="block text-sm font-bold" htmlFor="notes">
                            Notes:
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            className="w-full p-1 border border-gray-400 rounded"
                            value={sleepLog.notes}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <ReadOnlyTextInput
                        className="sm:hidden"
                        id="time-asleep"
                        label="Sleep duration in bed:"
                        value={`${totalSleep?.toFixed(1)} hours`}
                    />
                    <ReadOnlyTextInput
                        className="w-full sm:hidden"
                        id="time-in-bed"
                        label="Time spent in bed:"
                        value={`${timeInBed?.toFixed(1)} hours`}
                    />
                    <ReadOnlyTextInput
                        className="sm:hidden"
                        id="sleep-efficiency"
                        label="Sleep efficiency:"
                        value={`${Math.round(sleepEfficiency)}%`}
                    />
                    {formError.length > 0 && <p className="text-red-500 font-semibold w-64">{formError}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center cursor-pointer rounded bg-blue-600 p-2.5 text-white text-lg font-semibold hover:bg-blue-700"
                        >
                            <SaveIcon className="h-6 w-6 fill-white" />
                            &nbsp;{isEditing ? "Update" : "Save"} Entry
                        </button>
                    </div>
                </form>
                <div className="hidden sm:block space-y-4">
                    <ReadOnlyTextInput
                        id="time-asleep"
                        label="Sleep duration in bed:"
                        value={`${totalSleep?.toFixed(1)} hours`}
                    />
                    <ReadOnlyTextInput
                        id="time-in-bed"
                        label="Time spent in bed:"
                        value={`${timeInBed?.toFixed(1)} hours`}
                    />
                    <ReadOnlyTextInput
                        id="sleep-efficiency"
                        label="Sleep efficiency:"
                        value={`${Math.round(sleepEfficiency)}%`}
                    />
                </div>
            </div>
        </Modal>
    );
}
