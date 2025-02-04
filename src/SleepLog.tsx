import type { SleepEntry, SleepLog } from "./types"
import { useEffect, useState } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SleepForm from "./SleepForm"
import SleepEntries from './SleepEntries';
import { initialState } from "./utils";
import dayjs from "dayjs";
import AddIcon from "./AddIcon";

export default function SleepLog() {
    const [showForm, setShowForm] = useState(false);
    const [sleepEntries, setSleepEntries] = useState<Array<SleepEntry>>([])
    const [formFields, setFormFields] = useState<SleepLog>(initialState)
    const [isEditing, setIsEditing] = useState(false);

    const handleFormCancel = () => {
        setShowForm(false);
        setIsEditing(false);
        setFormFields(initialState);
    }

    const handleSetEntries = (e: Array<SleepEntry>) => {
        setSleepEntries(e);
        handleFormCancel()
    }

    const handleDeleteEntry = (eid: number) => {
        const updatedEntries = sleepEntries.filter(({ id }) => id !== eid);
        localStorage.setItem("entries", JSON.stringify(updatedEntries));
        setSleepEntries(updatedEntries);
    }

    const handleEditForm = (fields: SleepLog) => {
        setFormFields(
            {
                ...fields,
                id: dayjs(fields.id),
                inBedTime: dayjs(fields.inBedTime),
                fallAsleep: dayjs(fields.fallAsleep),
                outOfBed: dayjs(fields.outOfBed),
                timeAwake: dayjs(fields.timeAwake)
            })
        setIsEditing(true);
        setShowForm(true);
    }

    useEffect(() => {
        try {
            const sleepEntries: Array<SleepEntry> = JSON.parse(localStorage.getItem("entries") || "[]");
            if (!sleepEntries.length) return;

            setSleepEntries(sleepEntries);
        } catch {
            console.error("Unable to load sleep entries");
        }
    }, []);

    return (
        <>
            <SleepEntries
                onSetEditForm={handleEditForm}
                onDeleteEntry={handleDeleteEntry}
                entries={sleepEntries}
            />
            {
                !showForm
                    ? <button
                        type="button"
                        className="absolute bottom-4 right-4 text-2xl rounded-full p-3.5 transition-all cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-2xl"
                        onClick={() => setShowForm(true)}
                    >
                        <AddIcon className="h-8 w-8" />
                    </button>
                    : <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <SleepForm
                            onFormCancel={handleFormCancel}
                            onSetSleepEntries={handleSetEntries}
                            isEditing={isEditing}
                            {...formFields}
                        />
                    </LocalizationProvider>
            }
        </>
    )

}
