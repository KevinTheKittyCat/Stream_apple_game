import { useApplication, type PixiReactElementProps } from '@pixi/react';
import { Rectangle, Graphics } from 'pixi.js';
import { useMemo } from 'react';
import React from 'react';

type Props = {
    children: React.ReactNode;
    background?: {
        backgroundColor?: string;
        alpha?: number;
    }
} & Omit<PixiReactElementProps, 'children'>

export const Layer = ({ children, background, ...props }: Props) => {
    const { app } = useApplication();
    const hitArea = useMemo(() => {
        return new Rectangle(0, 0, app.canvas.width, app.canvas.height);
    }, [app]);

    // Background while no actual background is created
    const draw = useMemo(() => (g: Graphics) => {
        if (!background) return;
        const { backgroundColor, alpha } = background;
        g.clear();
        g.rect(0, 0, app.canvas.width, app.canvas.height);
        //g.stroke({ color: backgroundColor, alpha: alpha || 1, width: 2 });
        g.fill({ color: backgroundColor, alpha: alpha || 1 });
    }, [app]);

    return (
        <pixiContainer
            eventMode="static"
            width={app.renderer.width}
            height={app.renderer.height}
            hitArea={hitArea}
            position={{ x: 0, y: 0 }}
            {...props}
        >
            {background && <pixiGraphics draw={draw} />}
            {children}
        </pixiContainer>
    )
}
