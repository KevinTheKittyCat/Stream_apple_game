import { createFileRoute } from '@tanstack/react-router'
import TalentTreeUI from '@/components/ui/TechTreeUI/TalentTreeUI';

export const Route = createFileRoute('/talentTree')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TalentTreeUI />;
}
