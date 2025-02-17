import type { ChangeEvent, MouseEvent } from "react";
import type { SleepEntry } from "./types";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import Popover from "@mui/material/Popover";
import useDBContext from "./useDBContext";
import SettingsIcon from "./SettingsIcon";
import SaveIcon from "./SaveIcon";
import ImportIcon from "./ImportIcon";
import DeleteIcon from "./DeleteIcon";

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

export default function Actions() {
    const { db, syncSleepEntries } = useDBContext();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDownloadData = async () => {
        try {
            const entries = (await db?.getAll("entries")) || [];

            if (!entries.length) return;

            const data = JSON.stringify(entries, null, 2);

            const blob = new Blob([data], { type: "application/json" });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `sleep-log-entries-${dayjs().format("MM-DD-YYYY")}.json`;
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

            const maxSizeFileSizeBytes = 10 * 1024 * 1024;
            if (file.size > maxSizeFileSizeBytes) {
                throw Error("File size is larger than 10MB.");
            }

            const text = await file.text();
            const dataEntries = JSON.parse(text) as Array<SleepEntry>;
            if (!dataEntries) {
                throw Error("File is not a valid sleep log with entries.");
            }

            const sanitizedSleepEntries: Array<SleepEntry> = [];
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

                sanitizedSleepEntries.push(sanitizedSleepEntry);
            }

            if (!sanitizedSleepEntries.length) return;

            const tx = db?.transaction("entries", "readwrite");
            await Promise.all([...sanitizedSleepEntries.map((entry) => tx?.store.add(entry)), tx?.done]);

            await syncSleepEntries();
        } catch (error) {
            alert((error as Error)?.message);
        }
    };

    const handleClearData = async () => {
        if (
            !window.confirm(
                "WARNING: This action is irreversible! It's highly recommended that you download your entries before continuing.Press OK to continue."
            )
        )
            return;
        if (!window.confirm("Last chance! Are you sure you want to delete all sleep entries? Press OK to continue."))
            return;

        try {
            await db?.clear("entries");

            await syncSleepEntries();
        } catch (error) {
            alert((error as Error)?.message);
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? "actions-menu" : undefined;

    return (
        <div className="flex justify-end">
            <button
                className="cursor-pointer p-2 rounded hover:bg-black/30 dark:hover:bg-purple-900/50"
                aria-describedby={id}
                type="button"
                onClick={handleClick}
            >
                <SettingsIcon className="h-8 w-8" />
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <div className="flex flex-col space-y-4 m-2">
                    <button
                        className="w-full cursor-pointer p-2 text-left rounded hover:bg-gray-300"
                        type="button"
                        onClick={handleDownloadData}
                    >
                        <div className="flex items-center space-x-2">
                            <SaveIcon className="h-5 w-5 fill-black" />
                            <p>Download Entries</p>
                        </div>
                    </button>
                    <div>
                        <button
                            type="button"
                            className="w-full cursor-pointer p-2 text-left rounded hover:bg-gray-300"
                            onClick={() => fileRef.current?.click()}
                        >
                            <div className="flex items-center space-x-2">
                                <ImportIcon className="h-6 w-6" />
                                <p>Import Entries</p>
                            </div>
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={handleImportData}
                        />
                    </div>
                    <button
                        className="w-full cursor-pointer p-2 text-left rounded hover:bg-gray-300"
                        type="button"
                        onClick={handleClearData}
                    >
                        <div className="flex items-center space-x-2">
                            <DeleteIcon className="h-6 w-6" />
                            <p>Delete Entries</p>
                        </div>
                    </button>
                </div>
            </Popover>
        </div>
    );
}
