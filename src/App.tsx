import SleepLog from "./SleepLog"

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
            <header id="sleep-log" className="text-center border-b border-gray-500 py-4">
                <section>
                    <h1 className="text-3xl font-extrabold xs:text-4xl">
                        Sleep Log
                    </h1>
                </section>
            </header>
            <main
                id="main"
                className="flex flex-wrap space-x-8 justify-center items-center space-y-4 py-10"
            >
                <SleepLog />
            </main>
        </>
    )
}

export default App
