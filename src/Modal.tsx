import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import CancelIcon from './CancelIcon';

type ModalProps = {
    children: ReactNode;
    onCancel: () => void;
    title: string;
};

export default function Modal({ children, onCancel, title }: ModalProps) {
    return createPortal(
        <div className="fixed top-0 right-0 bottom-0 left-0 z-1200">
            <div className="fixed top-0 right-0 bottom-0 left-0 z-[-1] flex items-center justify-center bg-black/70" />
            <div className="h-full flex justify-center items-center">
                <dialog
                    className="relative z-50 flex flex-col w-full max-w-xl h-full max-h-full overflow-y-auto sm:h-auto sm:m-4 sm:rounded-md"
                    aria-modal="true"
                >
                    <div className="flex flex-row items-center border-b border-gray-300 bg-linear-to-r/decreasing from-indigo-500 to-teal-400 text-slate-100">
                        <div className="h-14 p-4 w-14" />
                        <header id="sleep-log-form" className="flex-1 py-2">
                            <h2 className="text-2xl text-center text-gray-50 font-bold">{title}</h2>
                        </header>
                        <div className="flex justify-end rounded-full w-14 mr-1">
                            <button
                                type="button"
                                title="Cancel"
                                className="cursor-pointer rounded p-3 transition-all hover:bg-black/30 hover:text-black/50"
                                onClick={onCancel}
                            >
                                <CancelIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-5 relative overflow-x-hidden bg-white sm:h-auto">
                        {children}
                    </div>
                    <div className="flex flex-initial border-t border-b border-gray-300 bg-linear-to-r/decreasing from-indigo-500 to-teal-400 p-4" />
                </dialog>
            </div>
        </div>,
        document.body
    );
}
