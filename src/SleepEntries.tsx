import type { SleepEntry as SleepEntryT, SleepLog } from "./types";
import AddIcon from "./AddIcon";
import EmptyEntriesIcon from "./EmptyEntriesIcon";
import SleepEntry from "./SleepEntry";

export type SleepEntriesProps = {
    entries: Array<SleepEntryT>;
    onSetEditForm: (fields: SleepLog) => void;
    onDeleteEntry: (id: number) => void;
};

export default function SleepEntries({ entries, onDeleteEntry, onSetEditForm }: SleepEntriesProps) {
    if (!entries.length) {
        return (
            <div className="flex flex-col justify-center items-center space-y-1.5 p-4 rounded bg-gray-200 text-gray-600 border border-gray-300 mt-8 mx-2">
                <div className="flex justify-center items-center">
                    <EmptyEntriesIcon className="h-10 w-10 fill-gray-600" />
                </div>
                <header id="sleep-entries">
                    <h2 className="text-xl text-center font-bold md:text-2xl">Empty Sleep Entries</h2>
                </header>
                <p className="text-sm tracking-wider sm:text-base">
                    To add an entry, press the
                    <button
                        type="button"
                        className="rounded-full p-1.5 mx-1.5 transition-all cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-2xl"
                    >
                        <AddIcon className="h-4 w-4" />
                    </button>
                    button.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-y-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {entries.map((entry) => (
                <SleepEntry key={entry.id} entry={entry} onSetEditForm={onSetEditForm} onDeleteEntry={onDeleteEntry} />
            ))}
        </div>
    );
}
