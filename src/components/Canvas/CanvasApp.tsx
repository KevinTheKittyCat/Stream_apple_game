import { Application, extend } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { useLocation } from '@tanstack/react-router';
import GameLayer from './Layers/GameLayer';
import TalentTree from './Layers/TalentTree';
import { useRef } from 'react';

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

export default function CanvasApp() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <div id="game-container" ref={gameContainerRef}>
      <Application eventMode="static" resizeTo={window} antialias={true}>
        {currentRoute === '/' && <GameLayer />}
        {currentRoute === '/talentTree' && <TalentTree />}
      </Application>
    </div>
  );
}
