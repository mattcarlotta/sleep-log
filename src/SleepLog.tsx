import type { SleepLog } from "./types";
import { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SleepForm from "./SleepForm";
import SleepEntries from "./SleepEntries";
import AddIcon from "./AddIcon";
import SleepEfficiencyIcon from "./SleepEfficiencyIcon";
import SortByAscIcon from "./SortByAscIcon";
import SortByDscIcon from "./SortByDscIcon";
import useDBContext from "./useDBContext";
import { initialState } from "./utils";
import useScrollLock from "./useScrollLock";
import { useMediaQuery } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9"
        },
        background: {
            paper: "#1e1e1e",
            default: "#121212"
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "& fieldset": {
                        borderColor: "#99a1af"
                    },
                    "&:hover fieldset": {
                        borderColor: theme.palette.text.primary
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main
                    }
                })
            }
        }
    }
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2"
        },
        background: {
            paper: "#ffffff",
            default: "#fafafa"
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "& fieldset": {
                        borderColor: "#99a1af"
                    },
                    "&:hover fieldset": {
                        borderColor: theme.palette.text.primary
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main
                    }
                })
            }
        }
    }
});

export default function SleepLog() {
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = prefersDark ? darkTheme : lightTheme;
    const { db, sortByDsc, handleSortBy, sleepEntries, syncSleepEntries } = useDBContext();
    const [showForm, setShowForm] = useScrollLock();
    const [formFields, setFormFields] = useState<SleepLog>(initialState);
    const [isEditing, setIsEditing] = useState(false);

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
            await syncSleepEntries();
        } catch (error) {
            console.error(`Unable to delete entry. Reason: ${(error as Error)?.message || "Unknown reason."}`);
        }
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

    return (
        <div className="flex flex-col items-center justify-center flex-wrap space-y-6 py-4 mb-20 mx-4 md:py-6 md:space-x-8">
            {sleepEntries.length > 0 && (
                <>
                    <div className="flex flex-col items-center space-y-2 px-6 py-2.5 rounded bg-cyan-800/10 border border-cyan-300 shadow-md text-center dark:bg-purple-900/50 dark:border-purple-800 md:w-64">
                        <header id="sleep-efficiency-score">
                            <h2 className="text-2xl font-bold">Sleep Efficiency</h2>
                        </header>
                        <p className="flex justify-center items-center space-x-2">
                            <SleepEfficiencyIcon className="h-8 w-8 fill-black dark:fill-white" />
                            <span className="text-2xl font-bold">
                                {sleepEffiencyToDate}
                                <sup>%</sup>
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <p>Sort by:</p>
                        <button
                            type="button"
                            aria-label={`sort by ${!sortByDsc ? "descending" : "ascending"}`}
                            className="p-0.5 cursor-pointer rounded hover:bg-gray-300 dark:hover:bg-purple-900/50"
                            onClick={handleSortBy}
                        >
                            {!sortByDsc ? (
                                <SortByDscIcon className="h-10 w-10 text-black dark:text-gray-200" />
                            ) : (
                                <SortByAscIcon className="h-10 w-10 text-black dark:text-gray-200" />
                            )}
                        </button>
                    </div>
                </>
            )}
            <SleepEntries onSetEditForm={handleEditForm} onDeleteEntry={handleDeleteEntry} entries={sleepEntries} />
            {!showForm ? (
                <button
                    type="button"
                    title="add entry"
                    className="fixed bottom-4 right-4 text-2xl rounded-full p-3.5 transition-all cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-2xl dark:bg-purple-700 dark:hover:bg-purple-900"
                    onClick={() => setShowForm(true)}
                >
                    <AddIcon className="h-8 w-8" />
                </button>
            ) : (
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <SleepForm onFormCancel={handleFormCancel} isEditing={isEditing} {...formFields} />
                    </LocalizationProvider>
                </ThemeProvider>
            )}
        </div>
    );
}
