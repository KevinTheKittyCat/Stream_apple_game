import { type PixiReactElementProps } from '@pixi/react';

import React from 'react';

type Props = {
    children: React.ReactNode;
} & Omit<PixiReactElementProps, 'children'>

export const Group = ({ children, ...props }: Props) => {

    return (
        <pixiContainer
            eventMode="static"
            {...props}
        >
            {children}
        </pixiContainer>
    )
}
