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
import { GameProvider } from '@/components/Contexts/GameContext';
import PlayerLayer from '@/components/Canvas/Layers/PlayerLayer';
import MainUi from '@/components/ui/mainUI';
import TalentTree from '@/components/Canvas/Layers/TalentTree';



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
    <GameProvider>
      <MainUi />
      <Game />
    </GameProvider>
  );
}

export function Game() {

  return (
    <Application eventMode='static' resizeTo={window}>
      <PlayerLayer />
      <TalentTree />
    </Application>
  );
}