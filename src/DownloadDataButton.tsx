import useDBContext from "./useDBContext";

export default function DownloadDataButton() {
    const { db } = useDBContext();

    const handleDownloadData = async () => {
        try {
            const entries = await db?.getAll("entries");
            const data = JSON.stringify(entries, null, 2);

            const blob = new Blob([data], { type: "application/json" });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "sleep-log-data.json";
            link.click();

            URL.revokeObjectURL(url);
            link.remove();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button className="cursor-pointer" type="button" onClick={handleDownloadData}>
            Download Data
        </button>
    );
}
