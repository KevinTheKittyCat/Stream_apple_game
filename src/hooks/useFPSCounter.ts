import { useEffect, useRef, useState } from 'react';

export function useFPS() {
    const [fps, setFps] = useState(0);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const requestRef = useRef<number>();

    useEffect(() => {
        const updateFPS = () => {
            frameCountRef.current++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTimeRef.current;

            if (deltaTime >= 1000) { // Update every second
                const currentFPS = Math.round((frameCountRef.current * 1000) / deltaTime);
                setFps(currentFPS);
                frameCountRef.current = 0;
                lastTimeRef.current = currentTime;
            }

            requestRef.current = requestAnimationFrame(updateFPS);
        };

        requestRef.current = requestAnimationFrame(updateFPS);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    return fps;
}