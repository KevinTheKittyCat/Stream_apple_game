import { useCallback, useRef } from "react";




export default function useDelta() {
    const lastTimeRef = useRef(performance.now());


    const getDelta = useCallback(() => {
        const now = performance.now();
        const delta = (now - lastTimeRef.current) / 1000; // seconds
        lastTimeRef.current = now;
        return delta
    }, [lastTimeRef])

    return { lastTime: lastTimeRef.current, getDelta }
}