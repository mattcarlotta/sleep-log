import type { SleepEntry, SleepLog } from './types';
import dayjs from 'dayjs';
import { daysInWeek } from './utils';
import InBedIcon from './InBedIcon';
import AsleepIcon from './AsleepIcon';
import AwakeIcon from './AwakeIcon';
import AlarmIcon from './AlarmIcon';
import SleepDurationIcon from './SleepDurationIcon';
import InBedDurationIcon from './InBedDurationIcon';
import NapIcon from './NapIcon';
import SleepQualityIcon from './SleepQualityIcon';
import NotesIcon from './NotesIcon';
import SleepEfficiencyIcon from './SleepEfficiencyIcon';
import EditIcon from './EditIcon';
import DeleteIcon from './DeleteIcon';
import TimeAwakeIcon from './TimeAwakeIcon';
import { useState } from 'react';
import Modal from './Modal';

type SleepEntryProps = {
    entry: SleepEntry;
    onSetEditForm: (fields: SleepLog) => void;
    onDeleteEntry: (id: number) => void;
};

export default function SleepEntry({ entry, onSetEditForm, onDeleteEntry }: SleepEntryProps) {
    const [showEntryDetail, setShowEntryDetail] = useState(false);

    const toggleModal = () => {
        setShowEntryDetail((p) => !p);
    };

    return (
        <>
            <div
                className="flex flex-col space-y-2 px-4 py-2.5 rounded bg-orange-800/10 border border-orange-300 w-full shadow-md md:w-64"
                key={entry.id}
            >
                <header id="sleep-entries" className="grid grid-cols-2">
                    <h2 className="text-2xl font-bold">{daysInWeek[dayjs(entry.id).day()]}&nbsp;</h2>
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            title="Edit Entry"
                            className="p-1 cursor-pointer rounded hover:bg-gray-300"
                            onClick={() => onSetEditForm(entry)}
                        >
                            <EditIcon className="h-6 w-6 text-blue-500" />
                        </button>
                        <button
                            type="button"
                            title="Delete Entry"
                            className="p-1 cursor-pointer rounded hover:bg-gray-300"
                            onClick={() => onDeleteEntry(entry.id)}
                        >
                            <DeleteIcon className="h-6 w-6 text-red-500" />
                        </button>
                    </div>
                    <h3 className="text-lg">{dayjs(entry.id).format('MMM Do')}</h3>
                </header>
                <div className="h-px border-t border-green-700 pt-2" />
                <div className="flex flex-col justify-center items-center">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4 px-4">
                        <p className="font-bold">
                            <SleepEfficiencyIcon className="h-10 w-10" />
                            <span className="text-2xl">{Math.round(entry.sleepEfficiency)}</span>
                            <sup>%</sup>
                        </p>
                        <p className="font-bold capitalize">
                            <SleepQualityIcon className="mb-1 h-10 w-10" />
                            <span>{entry.sleepQuality}</span>
                        </p>
                        <p className="hidden md:block">
                            <InBedIcon className="h-10 w-10" />
                            <span className="text-2xl">{dayjs(entry.inBedTime).format('hh')}</span>
                            <sup>{dayjs(entry.inBedTime).format('mm a')}</sup>
                        </p>
                        <p className="hidden md:block">
                            <AsleepIcon className="h-10 w-10" />
                            <span className="text-2xl">{dayjs(entry.fallAsleep).format('hh')}</span>
                            <sup>{dayjs(entry.fallAsleep).format('mm a')}</sup>
                        </p>
                        <p className="hidden md:block">
                            <AlarmIcon className="h-10 w-10" />
                            <span className="text-2xl">{dayjs(entry.timeAwake).format('hh')}</span>
                            <sup>{dayjs(entry.timeAwake).format('mm a')}</sup>
                        </p>
                        <p className="hidden md:block">
                            <AwakeIcon className="h-10 w-10" />
                            <span className="text-2xl">{dayjs(entry.outOfBed).format('hh')}</span>
                            <sup>{dayjs(entry.outOfBed).format('mm a')}</sup>
                        </p>
                        <p className="hidden md:block">
                            <TimeAwakeIcon className="h-10 w-10" />
                            <span className="text-2xl">{entry.totalTimeAwake?.toFixed(1)}</span>
                            <sup>hrs</sup>
                        </p>
                        <p className="hidden md:block">
                            <NapIcon className="h-10 w-10" />
                            <span className="text-2xl">{entry.napTime?.toFixed(1)}</span>
                            <sup>hrs</sup>
                        </p>
                        <p>
                            <SleepDurationIcon className="h-10 w-10" />
                            <span className="text-2xl">{entry.totalSleep?.toFixed(1)}</span>
                            <sup>hrs</sup>
                        </p>
                        <p>
                            <InBedDurationIcon className="h-10 w-10" />
                            <span className="text-2xl">{entry.timeInBed?.toFixed(1)}</span>
                            <sup>hrs</sup>
                        </p>
                    </div>
                </div>
                <div className="h-px border-t border-green-700 pt-2" />
                <div className="md:hidden">
                    <button
                        type="button"
                        className="w-full text-slate-900 cursor-pointer rounded"
                        onClick={toggleModal}
                    >
                        Show Details
                    </button>
                </div>
                <div className="hidden px-4 md:flex">
                    <NotesIcon className="flex-none h-8 w-8" />
                    <p className="w-full text-sm h-10 overflow-x-auto">
                        {entry.notes.length ? (
                            <span className="text-black">{entry.notes}</span>
                        ) : (
                            <span className="text-gray-500">(none)</span>
                        )}
                    </p>
                </div>
            </div>
            {showEntryDetail && (
                <Modal title={daysInWeek[dayjs(entry.id).day()]} onCancel={toggleModal}>
                    <h3 className="text-2xl font-bold text-center">{dayjs(entry.id).format('MMM Do')}&nbsp;</h3>
                    <div className="h-px border-t border-green-700" />
                    <div className="flex flex-col justify-center items-center">
                        <div className="grid grid-cols-2 gap-x-16 gap-y-4 px-4">
                            <p className="font-bold">
                                <SleepEfficiencyIcon className="h-10 w-10" />
                                <span className="text-2xl">{Math.round(entry.sleepEfficiency)}</span>
                                <sup>%</sup>
                            </p>
                            <p className="font-bold capitalize">
                                <SleepQualityIcon className="mb-1 h-10 w-10" />
                                <span>{entry.sleepQuality}</span>
                            </p>
                            <p>
                                <InBedIcon className="h-10 w-10" />
                                <span className="text-2xl">{dayjs(entry.inBedTime).format('hh')}</span>
                                <sup>{dayjs(entry.inBedTime).format('mm a')}</sup>
                            </p>
                            <p>
                                <AsleepIcon className="h-10 w-10" />
                                <span className="text-2xl">{dayjs(entry.fallAsleep).format('hh')}</span>
                                <sup>{dayjs(entry.fallAsleep).format('mm a')}</sup>
                            </p>
                            <p>
                                <AlarmIcon className="h-10 w-10" />
                                <span className="text-2xl">{dayjs(entry.timeAwake).format('hh')}</span>
                                <sup>{dayjs(entry.timeAwake).format('mm a')}</sup>
                            </p>
                            <p>
                                <AwakeIcon className="h-10 w-10" />
                                <span className="text-2xl">{dayjs(entry.outOfBed).format('hh')}</span>
                                <sup>{dayjs(entry.outOfBed).format('mm a')}</sup>
                            </p>
                            <p>
                                <TimeAwakeIcon className="h-10 w-10" />
                                <span className="text-2xl">{entry.totalTimeAwake?.toFixed(1)}</span>
                                <sup>hrs</sup>
                            </p>
                            <p>
                                <NapIcon className="h-10 w-10" />
                                <span className="text-2xl">{entry.napTime?.toFixed(1)}</span>
                                <sup>hrs</sup>
                            </p>
                            <p>
                                <SleepDurationIcon className="h-10 w-10" />
                                <span className="text-2xl">{entry.totalSleep?.toFixed(1)}</span>
                                <sup>hrs</sup>
                            </p>
                            <p>
                                <InBedDurationIcon className="h-10 w-10" />
                                <span className="text-2xl">{entry.timeInBed?.toFixed(1)}</span>
                                <sup>hrs</sup>
                            </p>
                        </div>
                    </div>
                    <div className="h-px border-t border-green-700" />
                    <div className="flex flex-col justify-center items-center">
                        <NotesIcon className="h-10 w-10" />
                        <p className="text-sm">
                            {entry.notes.length ? (
                                <span className="text-black">{entry.notes}</span>
                            ) : (
                                <span className="text-gray-500">(none)</span>
                            )}
                        </p>
                    </div>
                </Modal>
            )}
        </>
    );
}
