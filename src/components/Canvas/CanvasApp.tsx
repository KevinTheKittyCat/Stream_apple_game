import { basePath } from '@/config/constants';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { eventEmitter, type ChangeRouteEvent, type TransitionEvent } from '@/utils/Eventemitter';
import { Application, extend } from '@pixi/react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Viewport } from 'pixi-viewport';
import { AnimatedSprite, Container, Graphics, HTMLText, Sprite, Text } from 'pixi.js';
import { useRef } from 'react';
import GameLayer from './Layers/GameLayer';
import TalentTree from './Layers/TalentTree';
import TransitionLayer from './Layers/TransitionLayer';
import MouseCordsListener from './MouseCordsListener';

// extend tells @pixi/react what Pixi.js components are available
extend({
    Container,
    Graphics,
    Sprite,
    AnimatedSprite,
    Text,
    HTMLText,
    Viewport,
    pixiViewport: Viewport
});



export default function CanvasApp() {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const currentRoute = location.pathname;
    const navigate = useNavigate();

    useEventEmitter('changeRoute', ({ route, data }: ChangeRouteEvent) => {
        eventEmitter.emit('transition', { dir: 'in' });

        const waitForReady = new Promise<void>((resolve, reject) => {
            eventEmitter.on('transition', (data: TransitionEvent) => {
                if (data?.ready) resolve();
            });
            setTimeout(() => {
                reject(new Error('Transition timed out'));
            }, 5000);
        });

        waitForReady.then(() => {
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            navigate({ to: route, search: data });
            eventEmitter.emit('transition', { dir: 'out' });
        });
    });

    return (
        <div id="game-container" ref={gameContainerRef}>
            <Application autoStart={true} eventMode="static" resizeTo={window} antialias={true}>
                <MouseCordsListener />
                <GameLayer visible={currentRoute === `${basePath}/`} />
                <TalentTree visible={currentRoute === `${basePath}/talentTree`} />
                <TransitionLayer />
            </Application>
        </div>
    );
}
