import type { SleepEntry, SleepLog, SleepLogFields } from "./types";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SleepForm from "./SleepForm";
import SleepEntries from "./SleepEntries";
import AddIcon from "./AddIcon";
import SleepEfficiencyIcon from "./SleepEfficiencyIcon";
import SortByAscIcon from "./SortByAscIcon";
import SortByDscIcon from "./SortByDscIcon";
import { initialState } from "./utils";
import useDBContext from "./useDBContext";

export default function SleepLog() {
    const { db, initialEntries } = useDBContext();
    const [showForm, setShowForm] = useState(false);
    const [sleepEntries, setSleepEntries] = useState<Array<SleepEntry>>(initialEntries);
    const [formFields, setFormFields] = useState<SleepLog>(initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [sortByDsc, setSortByDesc] = useState(false);

    const sleepEffiencyToDate = useMemo(() => {
        const sE = sleepEntries.reduce((sum, e) => (sum += e.sleepEfficiency), 0.0);
        if (!sE) return 0;
        return Math.round(sE / sleepEntries.length);
    }, [sleepEntries]);

    const handleFormCancel = () => {
        setShowForm(false);
        setIsEditing(false);
        setFormFields(initialState);
    };

    const handleDeleteEntry = async (eid: number) => {
        try {
            await db?.delete("entries", eid);
            const entries = (await db?.getAll("entries")) || [];

            setSleepEntries(entries.sort((a, b) => (sortByDsc ? b.id - a.id : a.id - b.id)));
        } catch (error) {
            console.error(`Unable to delete entry. Reason: ${(error as Error)?.message || "Unknown reason."}`);
        }
    };

    const handleSortBy = () => {
        setSortByDesc((p) => !p);
    };

    const handleEditForm = (fields: SleepLog) => {
        setFormFields({
            ...fields,
            id: dayjs(fields.id),
            inBedTime: dayjs(fields.inBedTime),
            fallAsleep: dayjs(fields.fallAsleep),
            outOfBed: dayjs(fields.outOfBed),
            timeAwake: dayjs(fields.timeAwake)
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleFormSubmit = async (fields: SleepLogFields) => {
        const entryId = dayjs(fields.id).startOf("day").valueOf();
        const entryExists = await db?.get("entries", entryId);
        if (entryExists && !isEditing) {
            throw new Error(`An entry for ${dayjs(entryId).format("MM/DD/YYYY")} already exists!`);
        }

        const entry = {
            ...fields,
            id: entryId,
            inBedTime: fields.inBedTime.toISOString(),
            fallAsleep: fields.fallAsleep.toISOString(),
            timeAwake: fields.timeAwake.toISOString(),
            outOfBed: fields.outOfBed.toISOString()
        };

        if (isEditing) {
            await db?.put("entries", entry);
        } else {
            await db?.add("entries", entry);
        }

        const entries = (await db?.getAll("entries")) || [];

        setSleepEntries(entries.sort((a, b) => (sortByDsc ? b.id - a.id : a.id - b.id)));

        handleFormCancel();
    };

    useEffect(() => {
        setSleepEntries((prevEntries) =>
            Array.from(prevEntries.sort((a, b) => (sortByDsc ? b.id - a.id : a.id - b.id)))
        );
    }, [sortByDsc]);

    return (
        <div className="flex flex-col items-center justify-center flex-wrap space-y-6 py-4 mb-20 mx-4 md:py-6 md:space-x-8">
            {sleepEntries.length > 0 && (
                <>
                    <div className="flex flex-col items-center space-y-2 px-6 py-2.5 rounded bg-cyan-800/10 border border-cyan-300 shadow-md text-center md:w-64">
                        <header id="sleep-efficiency-score">
                            <h2 className="text-2xl font-bold">Sleep Efficiency</h2>
                        </header>
                        <p className="flex justify-center items-center space-x-2">
                            <SleepEfficiencyIcon className="h-8 w-8" />
                            <span className="text-2xl font-bold">
                                {sleepEffiencyToDate}
                                <sup>%</sup>
                            </span>
                        </p>
                    </div>
                    <button
                        type="button"
                        className="p-1 cursor-pointer rounded hover:bg-gray-300"
                        onClick={handleSortBy}
                    >
                        {sortByDsc ? <SortByAscIcon className="h-10 w-10" /> : <SortByDscIcon className="h-10 w-10" />}
                    </button>
                </>
            )}
            <SleepEntries onSetEditForm={handleEditForm} onDeleteEntry={handleDeleteEntry} entries={sleepEntries} />
            {!showForm ? (
                <button
                    type="button"
                    className="fixed bottom-4 right-4 text-2xl rounded-full p-3.5 transition-all cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-2xl"
                    onClick={() => setShowForm(true)}
                >
                    <AddIcon className="h-8 w-8" />
                </button>
            ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <SleepForm
                        onFormCancel={handleFormCancel}
                        onFormSubmit={handleFormSubmit}
                        isEditing={isEditing}
                        {...formFields}
                    />
                </LocalizationProvider>
            )}
        </div>
    );
}
