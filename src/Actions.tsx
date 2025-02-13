import { ChangeEvent, useRef } from "react";
import useDBContext from "./useDBContext";
import { SleepEntry } from "./types";

const SLEEP_ENTRY_KEYS: Array<keyof SleepEntry> = [
    "id",
    "inBedTime",
    "fallAsleep",
    "timeAwake",
    "timeInBed",
    "outOfBed",
    "sleepEfficiency",
    "totalSleep",
    "totalTimeAwake",
    "sleepEfficiency",
    "sleepQuality",
    "napTime",
    "notes"
];

type ActionsProps = {
    onImportSleepEntries: (entries: Array<SleepEntry>) => void;
};

export default function Actions({ onImportSleepEntries }: ActionsProps) {
    const { db } = useDBContext();
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleDownloadData = async () => {
        try {
            const entries = await db?.getAll("entries");
            const data = JSON.stringify(entries, null, 2);

            const blob = new Blob([data], { type: "application/json" });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "sleep-log-data.json";
            link.click();

            URL.revokeObjectURL(url);
            link.remove();
        } catch (error) {
            alert((error as Error)?.message);
        }
    };

    const handleImportData = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            const maxSizeFileSBytes = 10 * 1024 * 1024;
            if (file.size > maxSizeFileSBytes) {
                throw Error("File size is larger than 10MB.");
            }

            const text = await file.text();
            const dataEntries = JSON.parse(text) as Array<SleepEntry>;
            if (!dataEntries) {
                throw Error("File is not a valid sleep log with entries.");
            }

            for (const entry of dataEntries) {
                const entryExists = await db?.get("entries", entry.id);

                if (entryExists) continue;

                const sanitizedSleepEntry = {} as SleepEntry;
                SLEEP_ENTRY_KEYS.forEach((key) => {
                    if (!Object.prototype.hasOwnProperty.call(entry, key)) {
                        throw Error(`Invalid sleep log. Missing "${key}" property from one of the entries!`);
                    }
                    // @ts-expect-error this will not throw an error because the entry keys are valid and hardcoded
                    sanitizedSleepEntry[key] = entry[key];
                });

                await db?.add("entries", sanitizedSleepEntry);
            }

            const entries = (await db?.getAll("entries")) || [];

            onImportSleepEntries(entries);
        } catch (error) {
            alert((error as Error)?.message);
        }
    };

    return (
        <>
            <button className="cursor-pointer" type="button" onClick={handleDownloadData}>
                Download Data
            </button>
            <div>
                <button type="button" className="cursor-pointer" onClick={() => fileRef.current?.click()}>
                    Import Data
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportData}
                />
            </div>
        </>
    );
}
