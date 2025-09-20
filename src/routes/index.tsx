import { createFileRoute } from '@tanstack/react-router'
import {
  Application,
  extend,
} from '@pixi/react';
import {
  Container,
  Graphics,
  Sprite,
} from 'pixi.js';
import PlayerLayer from '@/components/Canvas/Layers/PlayerLayer';
import MainUi from '@/components/ui/mainUI';
import TalentTree from '@/components/Canvas/Layers/TalentTree';
import { useWindowStore } from '@/stores/WindowState';
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/GameState';



export const Route = createFileRoute('/')({
  component: App,
})

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

export default function App() {

  return (
    <>
      <MainUi />
      <Game />
    </>
  );
}

export function Game() {
  const { calculateScale } = useWindowStore();
  const { currentPage } = useGameStore();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div id={"game-container"} ref={gameContainerRef}>
      <Application eventMode='static' resizeTo={gameContainerRef}>
        {currentPage === 'game' && <PlayerLayer />}
        {currentPage === 'talentTree' && <TalentTree />}
      </Application>
    </div>
  );
}