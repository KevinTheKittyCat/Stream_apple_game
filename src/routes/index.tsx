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
import { GameProvider, useGameContext } from '@/components/Contexts/GameContext';
import PlayerLayer from '@/components/Game/Layers/PlayerLayer';
import MainUi from '@/components/ui/mainUI';


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
      <Game />
    </GameProvider>
  );
}

export function Game() {

  return (
    <Application eventMode='static'>
      <PlayerLayer/>
    </Application>
  );
}