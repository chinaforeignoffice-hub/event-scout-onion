import { SeedManager } from '@/components/SeedManager';

export default function Seeds() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seed URL Management</h1>
        <p className="text-muted-foreground">
          Manage .onion URLs for event discovery and monitoring
        </p>
      </div>
      
      <SeedManager />
    </div>
  );
}