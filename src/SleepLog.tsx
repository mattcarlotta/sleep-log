import type { SleepEntry } from "./types"
import { useEffect, useState } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SleepForm from "./SleepForm"
import SleepEntries from './SleepEntries';

export default function SleepLog() {
    const [showForm, setShowForm] = useState(false);
    const [sleepEntries, setSleepEntries] = useState<Array<SleepEntry>>([])

    const handleShowForm = (s: boolean) => {
        setShowForm(s);
    }

    const handleSetEntries = (e: Array<SleepEntry>) => {
        setSleepEntries(e);
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
            <SleepEntries entries={sleepEntries} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SleepForm
                    onShowForm={handleShowForm}
                    onSetSleepEntries={handleSetEntries}
                    showForm={showForm}
                />
            </LocalizationProvider>
        </>
    )

}
