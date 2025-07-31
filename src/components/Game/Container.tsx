import {
    Application,
    useExtend,
} from '@pixi/react';
import { Container } from 'pixi.js';

export default function PixiContainer() {
    useExtend({ Container });

    return <pixiContainer />;
};