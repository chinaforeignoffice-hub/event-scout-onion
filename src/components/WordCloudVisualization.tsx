import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, TrendingUp } from 'lucide-react';
import { WordCloudData } from '@/types/api';
import { eventApi } from '@/services/api';
import { mockEvents } from '@/data/mockData';

// Simple word cloud component since react-wordcloud might have issues
const SimpleWordCloud = ({ words }: { words: WordCloudData[] }) => {
  const maxValue = Math.max(...words.map(w => w.value));
  
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {words.map((word, index) => {
        const size = Math.max(12, (word.value / maxValue) * 24);
        const opacity = 0.4 + (word.value / maxValue) * 0.6;
        
        return (
          <span
            key={index}
            className="inline-block px-2 py-1 rounded-md bg-cyber-green/10 text-cyber-green border border-cyber-green/20 transition-all hover:scale-110"
            style={{
              fontSize: `${size}px`,
              opacity: opacity,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

export function WordCloudVisualization() {
  const [wordData, setWordData] = useState<WordCloudData[]>([]);
  const [topTerms, setTopTerms] = useState<WordCloudData[]>([]);
  const [loading, setLoading] = useState(false);

  const generateWordCloud = async () => {
    setLoading(true);
    try {
      const events = await eventApi.getEvents();
      const eventsData = events.length > 0 ? events : mockEvents;
      
      // Extract and count words from event descriptions and names
      const allText = eventsData.map(event => 
        `${event.event_name} ${event.description}`
      ).join(' ');
      
      // Common words to exclude
      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
        'those', 'from', 'into', 'onto', 'upon', 'over', 'under', 'above',
        'below', 'up', 'down', 'out', 'off', 'as', 'it', 'its', 'his', 'her',
        'their', 'them', 'they', 'we', 'our', 'us', 'you', 'your', 'my', 'me',
        'i', 'he', 'she', 'him', 'her', 'all', 'any', 'both', 'each', 'few',
        'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
        'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now'
      ]);
      
      // Count word frequencies
      const wordCount: { [key: string]: number } = {};
      const words = allText.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));
      
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
      
      // Convert to array and sort by frequency
      const sortedWords = Object.entries(wordCount)
        .map(([text, value]) => ({ text, value }))
        .sort((a, b) => b.value - a.value);
      
      setWordData(sortedWords.slice(0, 50)); // Top 50 words
      setTopTerms(sortedWords.slice(0, 10)); // Top 10 for the list
      
    } catch (error) {
      console.error('Failed to generate word cloud:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateWordCloud();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-cyber-purple" />
            Event Terms Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-green"></div>
            </div>
          ) : wordData.length > 0 ? (
            <SimpleWordCloud words={wordData} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No data available for visualization
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-orange" />
            Top Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topTerms.map((term, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{term.text}</span>
                <Badge variant="outline" className="bg-cyber-orange/10 text-cyber-orange border-cyber-orange/20">
                  {term.value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}