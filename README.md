# Event Scout - Dark Web Event Monitoring Dashboard

A comprehensive web interface for monitoring and analyzing events discovered from dark web (.onion) sources. This React-based dashboard integrates with an external Python scraper to provide real-time event discovery and analysis capabilities.

## 🚀 Features

- **Event Dashboard**: View, search, and filter discovered events
- **Seed URL Management**: Add and manage .onion sources  
- **Real-time Monitoring**: System status and logs
- **Data Visualization**: Word cloud analysis of event terms
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Toggle between themes
- **Security First**: Sanitized content and secure API integration

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom cybersecurity theme
- **UI Components**: shadcn/ui
- **API Client**: Axios with mock data fallback
- **Security**: DOMPurify for content sanitization

## 📋 API Integration

The dashboard expects your Python scraper to provide these endpoints:

- `GET /events` - Returns array of events
- `GET /status` - Returns scraper status  
- `GET /seeds` - Returns seed URLs
- `POST /seeds` - Accepts new seed URLs

Mock data is included for testing without a running scraper.

## 🚦 Getting Started

```bash
npm install
npm run dev
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
VITE_API_TOKEN=your-scraper-api-token
```

## ⚠️ Legal Notice

This tool is designed for legitimate research and educational purposes only. Users must comply with all applicable laws and regulations.
