import type { SleepEntry, SleepLog } from './types';
import { useEffect, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SleepForm from './SleepForm';
import SleepEntries from './SleepEntries';
import { initialState } from './utils';
import dayjs from 'dayjs';
import AddIcon from './AddIcon';
import SleepEfficiencyIcon from './SleepEfficiencyIcon';

export default function SleepLog() {
    const [showForm, setShowForm] = useState(false);
    const [sleepEntries, setSleepEntries] = useState<Array<SleepEntry>>([]);
    const [formFields, setFormFields] = useState<SleepLog>(initialState);
    const [isEditing, setIsEditing] = useState(false);

    const sleepEffiencyToDate = useMemo(() => {
        const sE = sleepEntries.reduce((sum, e) => (sum += e.sleepEfficiency), 0.0);
        if (!sE) return 0;
        return Math.ceil(sE / sleepEntries.length);
    }, [sleepEntries]);

    const handleFormCancel = () => {
        setShowForm(false);
        setIsEditing(false);
        setFormFields(initialState);
    };

    const handleSetEntries = (e: Array<SleepEntry>) => {
        setSleepEntries(e);
        handleFormCancel();
    };

    const handleDeleteEntry = (eid: number) => {
        const updatedEntries = sleepEntries.filter(({ id }) => id !== eid);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));
        setSleepEntries(updatedEntries);
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

    useEffect(() => {
        try {
            const sleepEntries: Array<SleepEntry> = JSON.parse(localStorage.getItem('entries') || '[]');
            if (!sleepEntries.length) return;

            setSleepEntries(sleepEntries);
        } catch {
            console.error('Unable to load sleep entries');
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center flex-wrap space-y-6 py-4 mb-20 md:py-6 md:space-x-8">
            {sleepEffiencyToDate > 0 && (
                <div className="flex flex-col items-center space-y-2 px-4 py-2.5 rounded bg-cyan-800/10 border border-cyan-300 shadow-md text-center w-64">
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
                        onSetSleepEntries={handleSetEntries}
                        isEditing={isEditing}
                        {...formFields}
                    />
                </LocalizationProvider>
            )}
        </div>
    );
}
