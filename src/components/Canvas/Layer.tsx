import { useWindowStore } from '@/stores/WindowState';
import { useApplication, type PixiReactElementProps } from '@pixi/react';
import { Rectangle, Graphics, FillGradient, type GradientOptions } from 'pixi.js';
import { useMemo } from 'react';
import React from 'react';

type Props = {
    children: React.ReactNode;
    background?: {
        backgroundColor?: string;
        alpha?: number;
        gradient?: GradientOptions;
    }
} & Omit<PixiReactElementProps, 'children'>


export const Layer = ({ children, background, ...props }: Props) => {
    const { width, height } = useWindowStore();

    const hitArea = useMemo(() => {
        return new Rectangle(0, 0, width, height);
    }, [width, height]);

    // Background while no actual background is created
    const draw = useMemo(() => (g: Graphics) => {
        if (!background) return;
        const { backgroundColor, alpha } = background;
        g.clear();
        g.rect(0, 0, width, height);
        //g.stroke({ color: backgroundColor, alpha: alpha || 1, width: 2 });
        if (background.gradient) {
            // Create a fill gradient
            const start = { x: 0, y: 0 };
            const end = { x: 1, y: 1 };
            const gradientFill = new FillGradient({ 
                start,
                end,
                ...background.gradient
            });
            g.fill({ fill: gradientFill, alpha: alpha || 1 });
        } else {
            g.fill({ color: backgroundColor, alpha: alpha || 1 });
        }
    }, [background, width, height]);

    return (
        <pixiContainer
            eventMode="passive"
            //width={app.renderer.width}
            //height={app.renderer.height}
            hitArea={hitArea}
            position={{ x: 0, y: 0 }}
            {...props}
        >
            {background && <pixiGraphics draw={draw} />}
            {children}
        </pixiContainer>
    )
}
