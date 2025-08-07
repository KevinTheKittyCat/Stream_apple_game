import { useCallback, useEffect, useRef } from "react";




export default function useDelta() {
    const lastTimeRef = useRef(performance.now());


    const getDelta = useCallback(() => {
        const now = performance.now();
        const delta = (now - lastTimeRef.current) / 1000; // seconds
        lastTimeRef.current = now;
        return delta
    }, [lastTimeRef])

    useEffect(() => {
        console.log("useDelta initialized");
        return () => {
            console.log("useDelta cleanup");
        }
    }, []);

    return { lastTime: lastTimeRef.current, getDelta }
}