import Actions from "./Actions";
import SleepIcon from "./SleepIcon";
import SleepLog from "./SleepLog";
import useDBContext from "./useDBContext";

function App() {
    const { isLoading, error } = useDBContext();

    if (isLoading) {
        return (
            <div className="h-full flex justify-center items-center">
                <div title="loading..." className="loader" />
            </div>
        );
    }

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
            <section className="flex bg-linear-to-r/decreasing from-indigo-500 to-teal-400 text-slate-100 border-b border-gray-400 p-4 shadow-sm sm:justify-center sm:items-center">
                <header className="flex flex-1 flex-row items-center space-x-2 md:justify-center" id="navbar">
                    <h1 className="text-3xl font-bold xs:text-4xl">Sleep Log</h1>
                    <SleepIcon className="h-6 w-6" />
                </header>
                <Actions />
            </section>
            <main id="main" className="overflow-y-auto">
                {error ? (
                    <div className="h-full flex flex-col items-center justify-center rounded">
                        <div className="p-4 bg-gray-200 text-gray-600 border border-gray-300 text-center">
                            <header id="app-error">
                                <h1 className="text-3xl text-red-600">Unable to load app</h1>
                            </header>
                            <p className="text-xl text-red-600">{error}</p>
                        </div>
                    </div>
                ) : (
                    <SleepLog />
                )}
            </main>
        </>
    );
}

export default App;
