type ReadOnlyTextInputProps = {
    id: string;
    label: string;
    value: string;
};

export default function ReadOnlyTextInput({ id, label, value }: ReadOnlyTextInputProps) {
    return (
        <div>
            <label className="block text-sm font-bold" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                className="cursor-not-allowed pt-3.5 pb-4 pl-3.5 pr-6 border border-gray-400 rounded bg-gray-300"
                type="text"
                readOnly
                value={value}
            />
        </div>
    );
}
