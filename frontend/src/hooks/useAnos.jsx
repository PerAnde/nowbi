import { useState } from "react";

export const useAnos = () => {
    const [anos] = useState(
        Array.from({ length: 2050 - 2000 + 1 }, (_, i) => {
            const year = 2000 + i;
            return {
                id: `ano-${year}`,
                value: year,
                label: year,
            };
        })
    );

    return { anos };
};