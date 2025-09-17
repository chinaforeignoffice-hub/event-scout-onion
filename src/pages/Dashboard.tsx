import { StatusIndicator } from '@/components/StatusIndicator';
import { WordCloudVisualization } from '@/components/WordCloudVisualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Database, Activity, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Scout Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and analyze events from dark web sources
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <StatusIndicator />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <Link to="/events">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">View Events</CardTitle>
              <Database className="w-4 h-4 text-cyber-green group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Browse and filter discovered events
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-cyber-green">
                Explore events <ArrowRight className="w-3 h-3" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <Link to="/seeds">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manage Seeds</CardTitle>
              <BarChart3 className="w-4 h-4 text-cyber-blue group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Add and manage .onion seed URLs
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-cyber-blue">
                Manage seeds <ArrowRight className="w-3 h-3" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <Link to="/monitoring">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Monitor</CardTitle>
              <Activity className="w-4 h-4 text-cyber-purple group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Monitor scraper performance and logs
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-cyber-purple">
                View monitoring <ArrowRight className="w-3 h-3" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Word Cloud Visualization */}
      <WordCloudVisualization />

      {/* Information Panel */}
      <Card className="bg-gradient-to-r from-cyber-matrix-bg to-background border-cyber-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyber-green" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-cyber-green mb-2">Legal Usage Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Only for research and educational purposes</li>
                <li>• Focus on publicly available event information</li>
                <li>• Respect website terms of service</li>
                <li>• Report any illegal content to authorities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-cyber-blue mb-2">Security Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use VPN in addition to Tor for extra security</li>
                <li>• Regularly update seed URL sources</li>
                <li>• Monitor for unusual network activity</li>
                <li>• Keep scraping rate limits reasonable</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              This tool is designed for legitimate research purposes only. Users are responsible for 
              ensuring their use complies with all applicable laws and regulations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}