import { EventDashboard } from '@/components/EventDashboard';

export default function Events() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Discovery</h1>
        <p className="text-muted-foreground">
          View and analyze events discovered from .onion sources
        </p>
      </div>
      
      <EventDashboard />
    </div>
  );
}