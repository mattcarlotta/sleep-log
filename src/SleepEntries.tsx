import type { SleepEntry } from "./types"
import dayjs from 'dayjs';
import { daysInWeek } from "./utils";
import InBedIcon from "./InBedIcon";
import AsleepIcon from "./AsleepIcon";
import EmptyEntriesIcon from "./EmptyEntriesIcon";
import AwakeIcon from "./AwakeIcon";
import AlarmIcon from "./AlarmIcon";
import SleepDurationIcon from "./SleepDurationIcon";
import InBedDurationIcon from "./InBedDurationIcon";
import NapIcon from "./NapIcon";
import SleepQualityIcon from "./SleepQualityIcon";
import NotesIcon from "./NotesIcon";
import SleepEfficiencyIcon from "./SleepEfficiencyIcon";

export type SleepEntriesProps = {
    entries: Array<SleepEntry>
}

export default function SleepEntries({ entries }: SleepEntriesProps) {
    if (!entries.length) {
        return (
            <div className="p-4 rounded bg-gray-200 text-gray-600 border border-gray-300">
                <div className="flex justify-center items-center">
                    <EmptyEntriesIcon className="h-10 w-10 fill-gray-600" />
                </div>
                <header>
                    <h2 className="text-lg text-center font-bold">
                        No Sleep Entries Found
                    </h2>
                </header>
                <p>To add a sleep entry press the plus button below.</p>
            </div>
        )
    }

    return (
        <>
            {entries.map(entry => (
                <div className="flex flex-col space-y-2 px-4 py-2.5 rounded border border-gray-300 w-64 bg-gray-200 shadow-lg" key={entry.id}>
                    <header>
                        <h2 className="text-2xl font-bold">
                            {daysInWeek[dayjs(entry.id).day()]}&nbsp;
                        </h2>
                        <h3 className="font-semibold">
                            {dayjs(entry.id).format("MMM Do")}
                        </h3>
                    </header>
                    <div className="flex items-center space-x-3 bg-gray-300 border border-gray-400 p-1.5 rounded">
                        <SleepEfficiencyIcon className="h-9 w-9" />
                        <span className="text-xl font-semibold">{entry.sleepEfficiency?.toFixed(2)}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <p>
                            <InBedIcon className="h-10 w-10" />
                            <span className="text-2xl">
                                {dayjs(entry.inBedTime).format("hh")}
                            </span>
                            <sup>
                                {dayjs(entry.inBedTime).format("mm a")}
                            </sup>
                        </p>
                        <p>
                            <AsleepIcon className="h-10 w-10" />
                            <span className="text-2xl">
                                {dayjs(entry.fallAsleep).format("hh")}
                            </span>
                            <sup>
                                {dayjs(entry.fallAsleep).format("mm a")}
                            </sup>
                        </p>
                        <p>
                            <AlarmIcon className="h-10 w-10" />
                            <span className="text-2xl">
                                {dayjs(entry.timeAwake).format("hh")}
                            </span>
                            <sup>
                                {dayjs(entry.timeAwake).format("mm a")}
                            </sup>
                        </p>
                        <p>
                            <AwakeIcon className="h-10 w-10" />
                            <span className="text-2xl">
                                {dayjs(entry.outOfBed).format("hh")}
                            </span>
                            <sup>
                                {dayjs(entry.outOfBed).format("mm a")}
                            </sup>
                        </p>
                        <p>
                            <SleepDurationIcon className="h-10 w-10" />
                            <span className="text-2xl">
                                {entry.totalSleep?.toFixed(1)}
                            </span>
                            <sup>
                                hrs
                            </sup>
                        </p>
                        <p>
                            <InBedDurationIcon className="h-10 w-10" />
                            <span className="text-2xl">
                                {entry.timeInBed?.toFixed(1)}
                            </span>
                            <sup>
                                hrs
                            </sup>
                        </p>
                        <p>
                            <SleepQualityIcon className="h-10 w-10" />
                            <span className="text-lg">
                                {entry.sleepQuality}
                            </span>
                        </p>
                        <p>
                            <NapIcon className="h-10 w-10" />
                            <span className="text-lg">
                                {entry.napTime?.toFixed(1)}
                            </span>
                            <sup>
                                hrs
                            </sup>
                        </p>
                    </div>
                    <div className="space-y-1">
                        <NotesIcon className="h-10 w-10" />
                        <p className="text-sm p-1 h-14 overflow-y-auto bg-gray-300 border border-gray-400 rounded">
                            {entry.notes.length ? <span className="text-black">{entry.notes}</span> : <span className="text-gray-500">(none)</span>}
                        </p>
                    </div>
                </div>
            ))}
        </>
    )
}
