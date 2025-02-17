import Actions from "./Actions";
import SleepIcon from "./SleepIcon";
import SleepLog from "./SleepLog";
import useDBContext from "./useDBContext";

function App() {
    const { isLoading, error } = useDBContext();

    return (
        <>
            <a
                id="skip-to-content"
                aria-label="Skip to main content"
                className="absolute left-[-9999px] top-4 z-50 rounded p-2 text-center text-white no-underline bg-blue-600 hover:bg-blue-700 hover:shadow-2xl dark:bg-purple-700 dark:hover:bg-purple-900 focus:left-5"
                href="#main"
            >
                Skip to content
            </a>
            <section className="flex bg-linear-to-r/decreasing from-indigo-500 to-teal-400 text-slate-100 border-b border-gray-400 p-4 shadow-sm dark:bg-gradient-to-r dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 dark:border-gray-700 sm:justify-center sm:items-center">
                <header className="flex flex-1 flex-row items-center space-x-2 md:justify-center" id="navbar">
                    <h1 className="text-3xl font-bold xs:text-4xl">Sleep Log</h1>
                    <SleepIcon className="h-6 w-6" />
                </header>
                <Actions />
            </section>
            <main id="main" className="overflow-y-auto">
                {isLoading ? (
                    <div className="h-full flex justify-center items-center">
                        <div title="loading..." className="loader" />
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center">
                        <div className="p-4 text-gray-600 bg-orange-800/10 border border-orange-300 text-center rounded dark:bg-purple-900/50 dark:border-purple-900">
                            <header id="app-error">
                                <h2 className="text-3xl font-bold text-red-600">
                                    An Error Occurred: Unable to load the app.
                                </h2>
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
