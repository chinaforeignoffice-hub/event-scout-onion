import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusIndicator } from '@/components/StatusIndicator';
import { Activity, Server, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
}

export default function Monitoring() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock log data
  const mockLogs: LogEntry[] = [
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Scraper started successfully',
      details: 'Initialized with 5 seed URLs'
    },
    {
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      level: 'info',
      message: 'Successfully scraped http://cybersecnews.onion',
      details: 'Found 3 new events'
    },
    {
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      level: 'warning',
      message: 'Slow response from http://privacynews.onion',
      details: 'Response time: 8.2s'
    },
    {
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      level: 'error',
      message: 'Failed to connect to http://oldnews.onion',
      details: 'Connection timeout after 30s'
    },
    {
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      level: 'info',
      message: 'Event classification completed',
      details: 'Processed 15 events, classified 12'
    },
    {
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      level: 'info',
      message: 'Database cleanup completed',
      details: 'Removed 3 duplicate entries'
    }
  ];

  useEffect(() => {
    setLogs(mockLogs);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate new log entries
      const newLog: LogEntry = {
        timestamp: new Date().toISOString(),
        level: Math.random() > 0.7 ? 'warning' : 'info',
        message: `Scraper heartbeat - ${Math.floor(Math.random() * 100)}% complete`,
        details: `Processing seed ${Math.floor(Math.random() * 5) + 1}/5`
      };
      
      setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
    }, 15000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-cyber-red/10 text-cyber-red border-cyber-red/20';
      case 'warning': return 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/20';
      case 'info': return 'bg-cyber-green/10 text-cyber-green border-cyber-green/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-3 h-3" />;
      case 'warning': return <Zap className="w-3 h-3" />;
      case 'info': return <Activity className="w-3 h-3" />;
      default: return <Server className="w-3 h-3" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of scraper performance and system logs
        </p>
      </div>

      {/* Status Overview */}
      <StatusIndicator />

      {/* Monitoring Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyber-purple" />
              System Logs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline" 
                        className={`${getLevelColor(log.level)} text-xs`}
                      >
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{log.message}</p>
                    {log.details && (
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* System Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="w-4 h-4 text-cyber-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyber-green">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Successful scraping attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="w-4 h-4 text-cyber-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyber-orange">3.2s</div>
            <p className="text-xs text-muted-foreground">
              Average site response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Server className="w-4 h-4 text-cyber-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyber-blue">3</div>
            <p className="text-xs text-muted-foreground">
              Currently active Tor connections
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}