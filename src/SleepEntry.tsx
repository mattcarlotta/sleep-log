import type { SleepEntry, SleepLog } from "./types";
import { useState } from "react";
import dayjs from "dayjs";
import AsleepIcon from "./AsleepIcon";
import AwakeIcon from "./AwakeIcon";
import AlarmIcon from "./AlarmIcon";
import DeleteIcon from "./DeleteIcon";
import EditIcon from "./EditIcon";
import InBedIcon from "./InBedIcon";
import InBedDurationIcon from "./InBedDurationIcon";
import NapIcon from "./NapIcon";
import NotesIcon from "./NotesIcon";
import Modal from "./Modal";
import SleepDurationIcon from "./SleepDurationIcon";
import SleepQualityIcon from "./SleepQualityIcon";
import SleepEfficiencyIcon from "./SleepEfficiencyIcon";
import TimeAwakeIcon from "./TimeAwakeIcon";

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
                className="flex flex-col space-y-2 px-4 py-2.5 rounded bg-orange-800/10 border border-orange-300 w-full shadow-md dark:bg-purple-900/50 dark:border-purple-800 md:max-w-68"
                key={entry.id}
            >
                <header id="sleep-entries" className="grid grid-cols-2">
                    <h2 className="text-2xl font-bold">{dayjs(entry.id).format("dddd")}&nbsp;</h2>
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            title="edit entry"
                            className="p-1 cursor-pointer rounded hover:bg-gray-300 dark:hover:bg-purple-900"
                            onClick={() => onSetEditForm(entry)}
                        >
                            <EditIcon className="h-6 w-6 text-blue-500" />
                        </button>
                        <button
                            type="button"
                            title="delete entry"
                            className="p-1 cursor-pointer rounded hover:bg-gray-300 dark:hover:bg-purple-900"
                            onClick={() => onDeleteEntry(entry.id)}
                        >
                            <DeleteIcon className="h-6 w-6 text-red-500" />
                        </button>
                    </div>
                    <h3 className="text-lg">{dayjs(entry.id).format("MMM Do")}</h3>
                </header>
                <div className="h-px border-t border-gray-700 pt-2" />
                <div className="flex flex-col justify-center items-center">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4 px-4">
                        <div className="flex flex-col space-y-1 font-bold">
                            <SleepEfficiencyIcon className="h-10 w-10 fill-black dark:fill-gray-200" />
                            <p className="text-[0.45rem]">Sleep Efficiency</p>
                            <p className="text-2xl">
                                {Math.round(entry.sleepEfficiency)}
                                <sup className="text-xs">%</sup>
                            </p>
                        </div>
                        <div className="flex flex-col space-y-1 font-bold capitalize">
                            <SleepQualityIcon className="h-10 w-10 fill-black dark:fill-gray-200" />
                            <p className="text-[0.45rem]">Sleep Quality</p>
                            <p>{entry.sleepQuality}</p>
                        </div>
                        <div className="hidden md:flex flex-col space-y-1">
                            <InBedIcon className="h-10 w-10 text-black dark:text-gray-200" />
                            <p className="text-[0.45rem]">In Bed Time</p>
                            <p className="text-2xl">
                                {dayjs(entry.inBedTime).format("hh")}
                                <sup className="text-xs">{dayjs(entry.inBedTime).format("mm a")}</sup>
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col space-y-1">
                            <AsleepIcon className="h-10 w-10 text-black dark:text-gray-200" />
                            <p className="text-[0.45rem]">Fall Asleep</p>
                            <p className="text-2xl">
                                {dayjs(entry.fallAsleep).format("hh")}
                                <sup className="text-xs">{dayjs(entry.fallAsleep).format("mm a")}</sup>
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col space-y-1">
                            <AlarmIcon className="h-10 w-10 text-black dark:text-gray-200" />
                            <p className="text-[0.45rem]">Awaken</p>
                            <p className="text-2xl">
                                {dayjs(entry.timeAwake).format("hh")}
                                <sup className="text-xs">{dayjs(entry.timeAwake).format("mm a")}</sup>
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col space-y-1">
                            <AwakeIcon className="h-10 w-10 text-black dark:text-gray-200" />
                            <p className="text-[0.45rem]">Out Of Bed</p>
                            <p className="text-2xl">
                                {dayjs(entry.outOfBed).format("hh")}
                                <sup className="text-xs">{dayjs(entry.outOfBed).format("mm a")}</sup>
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col space-y-1">
                            <TimeAwakeIcon className="h-10 w-10 fill-black dark:fill-gray-200" />
                            <p className="text-[0.45rem]">Awake In Bed</p>
                            <p className="text-2xl">
                                {entry.totalTimeAwake?.toFixed(2)}
                                <sup className="text-xs">hrs</sup>
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col space-y-1">
                            <NapIcon className="h-10 w-10 fill-black dark:fill-gray-200" />
                            <p className="text-[0.45rem]">Nap Time</p>
                            <p className="text-2xl">
                                {entry.napTime?.toFixed(1)}
                                <sup className="text-xs">hrs</sup>
                            </p>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <SleepDurationIcon className="h-10 w-10 fill-black dark:fill-gray-200" />
                            <p className="text-[0.45rem]">Sleep Duration</p>
                            <p className="text-2xl">
                                {entry.totalSleep?.toFixed(1)}
                                <sup className="text-xs">hrs</sup>
                            </p>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <InBedDurationIcon className="h-10 w-10 fill-black dark:fill-gray-200" />
                            <p className="text-[0.45rem]">In Bed Duration</p>
                            <p className="text-2xl">
                                {entry.timeInBed?.toFixed(1)}
                                <sup className="text-xs">hrs</sup>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="h-px border-t border-gray-700 pt-2" />
                <div className="md:hidden">
                    <button
                        type="button"
                        className="w-full text-slate-900 cursor-pointer rounded dark:text-gray-200"
                        onClick={toggleModal}
                    >
                        Show Details
                    </button>
                </div>
                <div className="hidden px-4 md:flex">
                    <NotesIcon className="flex-none h-8 w-8" />
                    <p className="w-full text-sm h-10 overflow-x-auto">
                        {entry.notes.length ? (
                            <span className="text-black dark:text-gray-200">{entry.notes}</span>
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400">(none)</span>
                        )}
                    </p>
                </div>
            </div>
            {showEntryDetail && (
                <Modal title={dayjs(entry.id).format("dddd")} onCancel={toggleModal}>
                    <h3 className="text-2xl font-bold text-center">{dayjs(entry.id).format("MMM Do")}&nbsp;</h3>
                    <div className="h-px border-t border-gray-700" />
                    <div className="flex flex-col justify-center items-center">
                        <div className="grid grid-cols-2 gap-x-16 gap-y-4 px-4">
                            <div className="flex flex-col space-y-1 font-bold">
                                <SleepEfficiencyIcon className="h-10 w-10 fill-black" />
                                <p className="text-[0.45rem]">Sleep Efficiency</p>
                                <p className="text-2xl">
                                    {Math.round(entry.sleepEfficiency)}
                                    <sup className="text-xs">%</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1 font-bold capitalize">
                                <SleepQualityIcon className="h-10 w-10 fill-black" />
                                <p className="text-[0.45rem]">Sleep Quality</p>
                                <p>{entry.sleepQuality}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <InBedIcon className="h-10 w-10 text-black" />
                                <p className="text-[0.45rem]">In Bed Time</p>
                                <p className="text-2xl">
                                    {dayjs(entry.inBedTime).format("hh")}
                                    <sup className="text-xs">{dayjs(entry.inBedTime).format("mm a")}</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <AsleepIcon className="h-10 w-10 text-black" />
                                <p className="text-[0.45rem]">Fall Asleep</p>
                                <p className="text-2xl">
                                    {dayjs(entry.fallAsleep).format("hh")}
                                    <sup className="text-xs">{dayjs(entry.fallAsleep).format("mm a")}</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <AlarmIcon className="h-10 w-10 text-black" />
                                <p className="text-[0.45rem]">Awaken</p>
                                <p className="text-2xl">
                                    {dayjs(entry.timeAwake).format("hh")}
                                    <sup className="text-xs">{dayjs(entry.timeAwake).format("mm a")}</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <AwakeIcon className="h-10 w-10 text-black" />
                                <p className="text-[0.45rem]">Out Of Bed</p>
                                <p className="text-2xl">
                                    {dayjs(entry.outOfBed).format("hh")}
                                    <sup className="text-xs">{dayjs(entry.outOfBed).format("mm a")}</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <TimeAwakeIcon className="h-10 w-10 fill-black" />
                                <p className="text-[0.45rem]">Awake In Bed</p>
                                <p className="text-2xl">
                                    {entry.totalTimeAwake?.toFixed(2)}
                                    <sup className="text-xs">hrs</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <NapIcon className="h-10 w-10 fill-black" />
                                <p className="text-[0.45rem]">Nap Time</p>
                                <p className="text-2xl">
                                    {entry.napTime?.toFixed(1)}
                                    <sup className="text-xs">hrs</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <SleepDurationIcon className="h-10 w-10 fill-black" />
                                <p className="text-[0.45rem]">Sleep Duration</p>
                                <p className="text-2xl">
                                    {entry.totalSleep?.toFixed(1)}
                                    <sup className="text-xs">hrs</sup>
                                </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <InBedDurationIcon className="h-10 w-10 fill-black" />
                                <p className="text-[0.45rem]">In Bed Duration</p>
                                <p className="text-2xl">
                                    {entry.timeInBed?.toFixed(1)}
                                    <sup className="text-xs">hrs</sup>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-px border-t border-gray-700" />
                    <div className="flex flex-col justify-center items-center">
                        <NotesIcon className="h-10 w-10 text-black" />
                        <p className="w-full text-sm h-10 overflow-x-auto">
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
