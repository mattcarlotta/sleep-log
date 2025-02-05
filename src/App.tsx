import SleepIcon from './SleepIcon';
import SleepLog from './SleepLog';

function App() {
    return (
        <>
            <a
                id="skip-to-content"
                aria-label="Skip to main content"
                className="absolute left-[-9999px] top-4 z-50 rounded bg-primary-50 p-2 text-center text-white no-underline shadow-ring focus:left-5"
                href="#main"
            >
                Skip to content
            </a>
            <section className="flex justify-center items-center bg-linear-to-r/decreasing from-indigo-500 to-teal-400 text-gray-50 border-b border-gray-400 py-4 shadow-lg">
                <header className="flex flex-row space-x-2" id="navbar">
                    <h1 className="text-3xl font-bold xs:text-4xl">Sleep Log</h1>
                    <SleepIcon className="h-6 w-6" />
                </header>
            </section>
            <main id="main" className="flex flex-wrap space-x-8 justify-center items-center space-y-4 py-10">
                <SleepLog />
            </main>
        </>
    );
}

export default App;
