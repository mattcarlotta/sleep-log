import type { SleepLogDB, SleepEntry, DB } from "./types";
import type { ReactNode } from "react";
import { openDB } from "idb";
import { useEffect, useState } from "react";
import { DBContext } from "./useDBContext";

export default function DBProvider({ children }: { children: ReactNode }) {
    const [db, setDb] = useState<DB | null>(null);
    const [initialEntries, setInitialEntries] = useState<Array<SleepEntry>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const initDB = async () => {
            try {
                const dbConn = await openDB<SleepLogDB>("SleepLog", 1, {
                    upgrade(db) {
                        const store = db.createObjectStore("entries", { keyPath: "id" });

                        store.createIndex("id", "id", { unique: true });
                    }
                });

                const entries = await dbConn.getAll("entries");
                setInitialEntries(entries);

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

    return <DBContext.Provider value={{ db, initialEntries, isLoading, error }}>{children}</DBContext.Provider>;
}
