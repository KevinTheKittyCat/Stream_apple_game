import { createFileRoute } from '@tanstack/react-router'
import GameUI from '@/components/ui/Game/GameUI';

export const Route = createFileRoute('/')({
  component: Game,
})

export default function Game() {
  return <GameUI />;
}