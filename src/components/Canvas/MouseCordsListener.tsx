import { useCanvasStore, type MouseCoords } from "@/stores/CanvasState";
import { useApplication } from "@pixi/react";
import {
    FederatedPointerEvent,
} from 'pixi.js';
import { useCallback, useEffect, useRef } from "react";


export default function MouseCordsListener() {
    const { app } = useApplication();
    const { setMouseCoordsRef } = useCanvasStore();
    const mouseCoordsRef = useRef<MouseCoords>({ x: null, y: null });
    
    const handlePointerMove = useCallback((event: FederatedPointerEvent) => {
        const { x, y } = event.data.global;
        mouseCoordsRef.current = { x, y };
    }, []);

    const handlePointerLeave = useCallback(() => {
        mouseCoordsRef.current = { x: null, y: null };
    }, []);

    useEffect(() => {
        app.stage.on('pointermove', handlePointerMove);
        app.stage.on('pointerleave', handlePointerLeave);

        return () => {
            console.log('Cleaning up pointer move listener');
            if (!app || !app.stage) return;
            app.stage.off('pointermove', handlePointerMove);
            app.stage.off('pointerleave', handlePointerLeave);
        };
    }, [app, handlePointerMove, handlePointerLeave]);

    useEffect(() => {
        setMouseCoordsRef(mouseCoordsRef);
    }, [mouseCoordsRef]);
    

    return null;
}