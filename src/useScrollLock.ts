import { useLayoutEffect, useState } from "react";

export default function useScrollLock() {
    const [isLocked, setIsLocked] = useState(false);

    useLayoutEffect(() => {
        if (isLocked) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";

            return () => {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                window.scrollTo(0, scrollY);
            };
        }
    }, [isLocked]);

    return [isLocked, setIsLocked] as const;
}
