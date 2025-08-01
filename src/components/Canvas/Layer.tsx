import { useApplication, type PixiReactElementProps } from '@pixi/react';
import { Rectangle, Graphics } from 'pixi.js';
import { useMemo } from 'react';
import React from 'react';

type Props = {
    children: React.ReactNode;
} & Omit<PixiReactElementProps, 'children'>

export const Layer = ({ children, ...props }: Props) => {
    const { app } = useApplication();
    const hitArea = useMemo(() => {
        return new Rectangle(0, 0, app.canvas.width, app.canvas.height);
    }, [app]);
    
    // Background while no actual background is created
    const draw = useMemo(() => (g: Graphics) => {
        g.clear();
        g.rect(2, 2, app.canvas.width - 4, app.canvas.height - 4);
        g.stroke({ color: 0xFFFFFF, alpha: 0.5, width: 2 });
        g.fill({ color: 0xFFFFFF, alpha: 0.5 });
    }, [app]);

    return (
        <pixiContainer
            eventMode="static"
            width={app.canvas.width}
            height={app.canvas.height}
            hitArea={hitArea}
            position={{ x: 0, y: 0 }}
            {...props}
        >
            <pixiGraphics draw={draw} />
            {children}
        </pixiContainer>
    )
}
