import { eventEmitter } from "@/utils/Eventemitter";
import { useCallback, useEffect, useRef } from "react";

export function useEventEmitter(eventName: string, callback: Function) {
    const callbackRef = useRef(callback);
    
    // Keep the ref updated with the latest callback
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const onTwitchEvent = useCallback((data) => {
        callbackRef.current(data);
    }, []); // No dependencies - this won't change

    useEffect(() => {
        console.log("Registering event listener for:", eventName);
        eventEmitter.on(eventName, onTwitchEvent);

        return () => {
            eventEmitter.off(eventName, onTwitchEvent);
        };
    }, [eventName, onTwitchEvent]); // onTwitchEvent won't change anymore
}