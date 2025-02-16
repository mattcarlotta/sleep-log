import type { SleepLogDB, SleepEntry, DB } from "./types";
import type { ReactNode } from "react";
import { openDB } from "idb";
import { useEffect, useState } from "react";
import { DBContext } from "./useDBContext";

export default function DBProvider({ children }: { children: ReactNode }) {
    const [db, setDb] = useState<DB | null>(null);
    const [sleepEntries, setSleepEntries] = useState<Array<SleepEntry>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortByDsc, setSortByDesc] = useState(false);

    const handleSortBy = () => {
        setSortByDesc((p) => !p);
    };

    useEffect(() => {
        const initDB = async () => {
            try {
                const dbConn = await openDB<SleepLogDB>("SleepLog", 1, {
                    upgrade(db) {
                        db.createObjectStore("entries", { keyPath: "id" }).createIndex("id", "id", { unique: true });
                    }
                });

                const entries = (await dbConn.getAll("entries")) || [];
                setSleepEntries(entries);

                setDb(dbConn);
            } catch (error) {
                setError(`Database error: ${(error as Error)?.message || "Unknown error"}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading) initDB();

        return () => {
            db?.close();
        };
    }, [isLoading, db]);

    useEffect(() => {
        setSleepEntries((prevEntries) =>
            Array.from(prevEntries.sort((a, b) => (sortByDsc ? b.id - a.id : a.id - b.id)))
        );
    }, [sortByDsc]);

    return (
        <DBContext.Provider value={{ db, sortByDsc, handleSortBy, setSleepEntries, sleepEntries, isLoading, error }}>
            {children}
        </DBContext.Provider>
    );
}
