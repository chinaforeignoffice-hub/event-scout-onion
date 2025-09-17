import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, Database, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { ScraperStatus } from '@/types/api';
import { eventApi } from '@/services/api';
import { mockStatus } from '@/data/mockData';

export function StatusIndicator() {
  const [status, setStatus] = useState<ScraperStatus>(mockStatus);
  const [loading, setLoading] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await eventApi.getStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
      setStatus({
        status: 'Error',
        last_run: new Date().toISOString(),
        error_message: 'Connection failed'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    
    // Poll status every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'bg-cyber-green/10 text-cyber-green border-cyber-green/20';
      case 'Idle': return 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20';
      case 'Error': return 'bg-cyber-red/10 text-cyber-red border-cyber-red/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'Idle': return <CheckCircle className="w-4 h-4" />;
      case 'Error': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const lastRun = new Date(timestamp);
    const diffMs = now.getTime() - lastRun.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const getProgressValue = () => {
    if (status.status === 'Running') return 75;
    if (status.status === 'Idle') return 100;
    return 0;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scraper Status</CardTitle>
          {getStatusIcon(status.status)}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Badge 
              variant="outline" 
              className={`${getStatusColor(status.status)} text-xs`}
            >
              {status.status}
            </Badge>
            {status.status === 'Running' && (
              <Progress value={getProgressValue()} className="h-2" />
            )}
            {status.error_message && (
              <p className="text-xs text-cyber-red">{status.error_message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Run</CardTitle>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTimeAgo(status.last_run)}</div>
          <p className="text-xs text-muted-foreground">
            {new Date(status.last_run).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Events Found</CardTitle>
          <Database className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{status.events_count || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total events discovered
          </p>
        </CardContent>
      </Card>
    </div>
  );
}