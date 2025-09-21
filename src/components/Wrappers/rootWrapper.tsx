import { useWindowStore } from "@/stores/WindowState";
import { useEffect } from "react";




export default function RootWrapper({ children }: { children: React.ReactNode }) {
    const { calculateScale, calculateDimensions } = useWindowStore();

    const onResize = () => {
        calculateScale();
        calculateDimensions();
    }

    useEffect(() => {
        onResize();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);


    return (
        <>
            {children}
        </>
    );
}
