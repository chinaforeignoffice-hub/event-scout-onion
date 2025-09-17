import { Event, ScraperStatus, SeedUrl } from '@/types/api';

export const mockEvents: Event[] = [
  {
    event_name: "Global Cybersecurity Summit 2024",
    date: "2024-12-15",
    description: "Annual gathering of cybersecurity experts discussing latest threats and protection strategies. Topics include AI-powered security, quantum cryptography, and international cooperation.",
    source_url: "http://cybersecnews.onion/summit2024",
    timestamp: "2024-11-20T10:30:00Z"
  },
  {
    event_name: "International Privacy Conference",
    date: "2024-11-25",
    description: "Conference focused on digital privacy rights and data protection laws across different countries. Featuring keynotes from privacy advocates and legal experts.",
    source_url: "http://privacynews.onion/conf2024",
    timestamp: "2024-11-18T14:15:00Z"
  },
  {
    event_name: "World Tech Innovation Festival",
    date: "2024-12-01",
    description: "A celebration of technological breakthroughs and innovations from around the globe. Showcasing startups, research projects, and emerging technologies.",
    source_url: "http://techinnovation.onion/festival",
    timestamp: "2024-11-19T09:45:00Z"
  },
  {
    event_name: "Blockchain & DeFi Expo",
    date: "2024-11-30",
    description: "Exhibition and conference on blockchain technology, decentralized finance, and cryptocurrency trends. Industry leaders share insights on future developments.",
    source_url: "http://blockchainexpo.onion/2024",
    timestamp: "2024-11-17T16:20:00Z"
  },
  {
    event_name: "Digital Rights Workshop",
    date: "2024-12-05",
    description: "Workshop series on digital rights, internet freedom, and online civil liberties. Educational sessions for activists and citizens.",
    source_url: "http://digitalrights.onion/workshop",
    timestamp: "2024-11-21T11:00:00Z"
  }
];

export const mockStatus: ScraperStatus = {
  status: 'Running',
  last_run: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  events_count: mockEvents.length
};

export const mockSeedUrls: SeedUrl[] = [
  {
    id: "1",
    url: "http://cybersecnews.onion",
    added_date: "2024-11-01T00:00:00Z",
    status: "Active"
  },
  {
    id: "2", 
    url: "http://privacynews.onion",
    added_date: "2024-11-02T00:00:00Z",
    status: "Active"
  },
  {
    id: "3",
    url: "http://techinnovation.onion",
    added_date: "2024-11-03T00:00:00Z",
    status: "Active"
  },
  {
    id: "4",
    url: "http://blockchainexpo.onion",
    added_date: "2024-11-04T00:00:00Z",
    status: "Inactive"
  },
  {
    id: "5",
    url: "http://digitalrights.onion",
    added_date: "2024-11-05T00:00:00Z",
    status: "Active"
  }
];