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
import PlayerLayer from '@/components/Canvas/Layers/GameLayer';
import MainUi from '@/components/ui/mainUI';
import TalentTree from '@/components/Canvas/Layers/TalentTree';
import { useWindowStore } from '@/stores/WindowState';
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/GameState';

extend({
  Container,
  Graphics,
  Sprite,
});

export const Route = createFileRoute('/talentTree')({
  component: RouteComponent,
})

function RouteComponent() {
  const gameContainerRef = useRef<HTMLDivElement>(null);


  return (
    <>
      <MainUi />
      <div id={"game-container"} ref={gameContainerRef}>
        <Application eventMode='static' resizeTo={gameContainerRef} antialias={true}>
          <TalentTree />
        </Application>
      </div>
    </>
  );
}
