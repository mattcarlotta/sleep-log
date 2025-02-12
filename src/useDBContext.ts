import type { DBContextT } from "./types";
import { createContext, useContext } from "react";

export const DBContext = createContext<DBContextT | null>(null);

export default function useDBContext() {
    const context = useContext(DBContext);

    if (!context) {
        throw new Error("This component cannot be rendered outside the ImageContext component");
    }

    return context;
}
