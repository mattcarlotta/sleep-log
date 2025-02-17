export default function SortByDscIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>Sort By Ascending</title>
            <path
                d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
