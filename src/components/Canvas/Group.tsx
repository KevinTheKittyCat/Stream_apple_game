import { type PixiReactElementProps } from '@pixi/react';

import React from 'react';

type Props = {
    children: React.ReactNode;
} & Omit<PixiReactElementProps, 'children'>

export const Group = ({ children, ...props }: Props) => {

    return (
        <pixiContainer
            eventMode="static"
            isRenderGroup
            {...props}
        >
            {children}
        </pixiContainer>
    )
}

/*
import React, { forwardRef, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

type Props = {
    children: React.ReactNode;
} & Omit<PixiReactElementProps, 'children'>

const Group = forwardRef<PIXI.Container, Props>(({ children, ...props }, ref) => {
  const containerRef = useRef<PIXI.Container>(new PIXI.Container());

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(containerRef.current);
      } else {
        (ref as React.MutableRefObject<PIXI.Container | null>).current = containerRef.current;
      }
    }
  }, [ref]);

    return (
        <pixiContainer
            eventMode="static"
            isRenderGroup
            {...props}
        >
            {children}
        </pixiContainer>
    )
});

export { Group };
*/