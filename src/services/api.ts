import axios from 'axios';
import { Event, ScraperStatus, SeedUrl, ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';
const API_TOKEN = process.env.VITE_API_TOKEN || 'dev-token-123';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const eventApi = {
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Event[]>>('/events');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  getStatus: async (): Promise<ScraperStatus> => {
    try {
      const response = await apiClient.get<ApiResponse<ScraperStatus>>('/status');
      return response.data.data || {
        status: 'Error',
        last_run: new Date().toISOString(),
        error_message: 'Unable to connect to scraper'
      };
    } catch (error) {
      console.error('Error fetching status:', error);
      return {
        status: 'Error',
        last_run: new Date().toISOString(),
        error_message: 'Connection failed'
      };
    }
  },

  addSeedUrl: async (url: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/seeds', { url });
      return response.data.success;
    } catch (error) {
      console.error('Error adding seed URL:', error);
      return false;
    }
  },

  getSeedUrls: async (): Promise<SeedUrl[]> => {
    try {
      const response = await apiClient.get<ApiResponse<SeedUrl[]>>('/seeds');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching seed URLs:', error);
      return [];
    }
  }
};