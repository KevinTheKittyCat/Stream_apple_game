import { Application, extend } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { useLocation, useNavigate } from '@tanstack/react-router';
import GameLayer from './Layers/GameLayer';
import TalentTree from './Layers/TalentTree';
import { useRef } from 'react';
import MouseCordsListener from './MouseCordsListener';
import TransitionLayer from './Layers/TransitionLayer';
import { eventEmitter } from '@/utils/Eventemitter';
import { useEventEmitter } from '@/hooks/useEventEmitter';

// extend tells @pixi/react what Pixi.js components are available
extend({
    Container,
    Graphics,
    Sprite,
});

type ChangeRouteEvent = {
    route: string;
    data?: Record<string, any>;
};


export default function CanvasApp() {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const currentRoute = location.pathname;
    const navigate = useNavigate();

    useEventEmitter('changeRoute', ({ route, data }: ChangeRouteEvent) => {
        eventEmitter.emit('transition', { dir: 'in' });

        const waitForReady = new Promise<void>((resolve, reject) => {
            eventEmitter.on('transition', (data) => {
                if (data.ready) resolve();
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
            <Application eventMode="static" resizeTo={window} antialias={true}>
                <MouseCordsListener />
                <GameLayer visible={currentRoute === '/'} />
                <TalentTree visible={currentRoute === '/talentTree'} />
                <TransitionLayer />
            </Application>
        </div>
    );
}
