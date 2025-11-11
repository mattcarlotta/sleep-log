export default function AddIcon({ className }: { className?: string }) {
    return (
        <svg aria-hidden className={className} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6 12H18M12 6V18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
