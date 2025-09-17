import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, ExternalLink, Search, Calendar, AlertCircle } from 'lucide-react';
import { Event } from '@/types/api';
import { eventApi } from '@/services/api';
import { mockEvents } from '@/data/mockData';
import DOMPurify from 'dompurify';

export function EventDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventApi.getEvents();
      // Fallback to mock data if API fails
      const eventsData = data.length > 0 ? data : mockEvents;
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events.filter(event =>
      event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      filtered.sort((a, b) => a.event_name.localeCompare(b.event_name));
    }

    setFilteredEvents(filtered);
  }, [searchQuery, sortBy, events]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...' 
      : description;
  };

  const sanitizeContent = (content: string) => {
    return DOMPurify.sanitize(content);
  };

  const getEventTypeColor = (eventName: string) => {
    const name = eventName.toLowerCase();
    if (name.includes('security') || name.includes('cyber')) return 'bg-cyber-red/10 text-cyber-red border-cyber-red/20';
    if (name.includes('privacy') || name.includes('rights')) return 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20';
    if (name.includes('tech') || name.includes('innovation')) return 'bg-cyber-green/10 text-cyber-green border-cyber-green/20';
    if (name.includes('blockchain') || name.includes('crypto')) return 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20';
    return 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyber-green" />
              Event Dashboard
            </CardTitle>
            <Button 
              onClick={loadEvents} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('date')}
              >
                Sort by Date
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                Sort by Name
              </Button>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms.' : 'No events available. Try adding more seed URLs or refreshing.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-medium" dangerouslySetInnerHTML={{ 
                            __html: sanitizeContent(event.event_name) 
                          }} />
                          <Badge 
                            variant="outline" 
                            className={getEventTypeColor(event.event_name)}
                          >
                            {event.event_name.toLowerCase().includes('security') ? 'Security' :
                             event.event_name.toLowerCase().includes('privacy') ? 'Privacy' :
                             event.event_name.toLowerCase().includes('tech') ? 'Technology' :
                             event.event_name.toLowerCase().includes('blockchain') ? 'Blockchain' :
                             'Conference'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(event.date)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{
                          __html: sanitizeContent(truncateDescription(event.description))
                        }} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a 
                            href={event.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Source
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}