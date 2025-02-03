import type { SleepEntry } from "./types"
import { useEffect, useState } from "react"

export default function SleepEntries() {
    const [sleepEntries, setSleepEntries] = useState<Array<SleepEntry>>([])

    useEffect(() => {
        try {
            const sleepEntries: Array<SleepEntry> = JSON.parse(localStorage.getItem("entries") || "[]");

            setSleepEntries(sleepEntries);
        } catch {
            console.error("Unable to load sleep entries");
        }
    }, []);

    if (!sleepEntries) {
        return (
            <p>No sleep entries!</p>
        )
    }

    return (
        <p>{JSON.stringify(sleepEntries, null, 2)}</p>
    )
}
