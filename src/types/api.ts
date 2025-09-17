export interface Event {
  event_name: string;
  date: string;
  description: string;
  source_url: string;
  timestamp: string;
}

export interface ScraperStatus {
  status: 'Running' | 'Idle' | 'Error';
  last_run: string;
  events_count?: number;
  error_message?: string;
}

export interface SeedUrl {
  id: string;
  url: string;
  added_date: string;
  status: 'Active' | 'Inactive' | 'Error';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface WordCloudData {
  text: string;
  value: number;
}