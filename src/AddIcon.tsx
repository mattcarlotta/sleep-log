export default function AddIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>Add</title>
            <path d="M6 12H18M12 6V18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
