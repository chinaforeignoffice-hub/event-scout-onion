import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Link2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SeedUrl } from '@/types/api';
import { eventApi } from '@/services/api';
import { mockSeedUrls } from '@/data/mockData';

export function SeedManager() {
  const [seedUrls, setSeedUrls] = useState<SeedUrl[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSeedUrls = async () => {
    setLoading(true);
    try {
      const data = await eventApi.getSeedUrls();
      // Fallback to mock data if API fails
      setSeedUrls(data.length > 0 ? data : mockSeedUrls);
    } catch (error) {
      console.error('Failed to load seed URLs:', error);
      setSeedUrls(mockSeedUrls);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeedUrls();
  }, []);

  const validateOnionUrl = (url: string): boolean => {
    const onionRegex = /^https?:\/\/[a-z2-7]{16,56}\.onion(\/.*)?$/i;
    return onionRegex.test(url) || url.endsWith('.onion');
  };

  const handleAddUrl = async () => {
    if (!newUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid .onion URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateOnionUrl(newUrl)) {
      toast({
        title: "Invalid .onion URL",
        description: "URL must be a valid .onion address",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    if (seedUrls.some(seed => seed.url === newUrl)) {
      toast({
        title: "Duplicate URL",
        description: "This URL already exists in your seed list",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await eventApi.addSeedUrl(newUrl);
      if (success) {
        // Add to local state immediately for better UX
        const newSeed: SeedUrl = {
          id: Date.now().toString(),
          url: newUrl,
          added_date: new Date().toISOString(),
          status: 'Active'
        };
        setSeedUrls(prev => [...prev, newSeed]);
        setNewUrl('');
        
        toast({
          title: "Success",
          description: "Seed URL added successfully",
        });
      } else {
        throw new Error('Failed to add seed URL');
      }
    } catch (error) {
      console.error('Error adding seed URL:', error);
      toast({
        title: "Error",
        description: "Failed to add seed URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUrl = (id: string) => {
    setSeedUrls(prev => prev.filter(seed => seed.id !== id));
    toast({
      title: "Success",
      description: "Seed URL removed successfully",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-cyber-green/10 text-cyber-green border-cyber-green/20';
      case 'Inactive': return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'Error': return 'bg-cyber-red/10 text-cyber-red border-cyber-red/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyber-blue" />
            Seed URL Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="http://example.onion"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
                />
              </div>
              <Button 
                onClick={handleAddUrl} 
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add URL
              </Button>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-cyber-orange mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-cyber-orange mb-1">Important Guidelines:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Only add legitimate .onion URLs from trusted sources</li>
                    <li>• URLs should contain publicly available event information</li>
                    <li>• Avoid sites with illegal or harmful content</li>
                    <li>• Use this tool for research and educational purposes only</li>
                  </ul>
                </div>
              </div>
            </div>

            {seedUrls.length === 0 ? (
              <div className="text-center py-8">
                <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No seed URLs</h3>
                <p className="text-muted-foreground">Add your first .onion URL to start scraping events.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seedUrls.map((seed) => (
                      <TableRow key={seed.id}>
                        <TableCell>
                          <div className="font-mono text-sm break-all">
                            {seed.url}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(seed.status)}
                          >
                            {seed.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(seed.added_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUrl(seed.id)}
                            className="text-cyber-red hover:text-cyber-red hover:bg-cyber-red/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}