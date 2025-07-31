import { useApplication, type PixiReactElementProps } from '@pixi/react';
import { Rectangle, Graphics } from 'pixi.js';
import { useMemo } from 'react';
import React from 'react';

type Props = {
    children: React.ReactNode;
} & Omit<PixiReactElementProps, 'children'>

export const Layer = ({ children, ...props }: Props) => {
    const { app, isInitialised } = useApplication();
    const hitArea = useMemo(() => {
        if (!isInitialised) return new Rectangle(0, 0, 0, 0);
        console.log(isInitialised);
        console.log(app?.canvas?.width, app?.canvas?.height);
        new Rectangle(0, 0,
            window.innerWidth || app?.canvas?.width,
            window.innerHeight || app?.canvas?.height);
    }, [app, isInitialised]);

    const draw = useMemo(() => (g: Graphics) => {
        if (!isInitialised) return;
        g.clear();
        g.rect(2, 2, window.innerWidth - 4, window.innerHeight - 4);
        g.stroke({ color: 0x000000, width: 2 });
        g.fill({ color: 0xFFFFFF, alpha: 0.5 });
    }, [app, isInitialised]);

    if (!isInitialised) return null;
    return (
        <pixiContainer
            eventMode="static"
            width={window.innerWidth}
            height={window.innerHeight}
            hitArea={hitArea}
            position={{x: 0, y: 0}}
            /*onPointerMove={(event) => {
                console.log('Layer pointer move', event.data.global);
            }}*/

            {...props}
        >
            <pixiGraphics draw={draw} />
            {children}
        </pixiContainer>
    )
}
