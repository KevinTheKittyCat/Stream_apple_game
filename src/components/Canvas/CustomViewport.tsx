import { useRef, useEffect } from 'react';
import { Application, extend, useApplication, useExtend } from '@pixi/react';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

//extend({ Viewport, Sprite: PIXI.Sprite });

export const CustomViewport = ({ children } : { children: React.ReactNode }) => {
    const { app } = useApplication();
    useExtend({ Viewport, Sprite: PIXI.Sprite });
    const viewportRef = useRef<Viewport>(null);

    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current
                .drag({
                    mouseButtons: "all"
                })        // enable drag to pan
                .pinch()       // enable pinch-to-zoom (multi-touch)
                .wheel()       // enable wheel scroll-zoom
                .decelerate(); // enable deceleration (inertia) after panning
        }
    }, []);

    return (
        <pixiViewport
            events={app.renderer.events}
            ticker={app.ticker}
            screenWidth={window.innerWidth} screenHeight={window.innerHeight}
            worldWidth={1600} worldHeight={1200}
            ref={viewportRef}
        >
            {children}
        </pixiViewport>
    );
};