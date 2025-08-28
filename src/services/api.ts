// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

// Types for API responses
export interface NokItem {
  name: string;
  ts: string;
}

export interface PlcStatus {
  online: boolean;
  request: boolean;
  valid: boolean;
  last_decision: "OK" | "NOK" | null;
}

export interface Detection {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface WSEvent {
  fps: number;
  ok: boolean;
  detections: Detection[];
  plc: PlcStatus;
}

// API service class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get NOK detection list
  async getNokList(limit: number = 12): Promise<NokItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/nok/list?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch NOK list');
      return await response.json();
    } catch (error) {
      console.error('Error fetching NOK list:', error);
      return [];
    }
  }

  // Get specific NOK image
  getNokImageUrl(name: string): string {
    return `${this.baseUrl}/api/nok/${name}`;
  }

  // Get camera stream URL
  getCameraStreamUrl(): string {
    return `${this.baseUrl}/api/stream.mjpg`;
  }

  // Get PLC status
  async getPlcStatus(): Promise<PlcStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/plc/status`);
      if (!response.ok) throw new Error('Failed to fetch PLC status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching PLC status:', error);
      return null;
    }
  }

  // Control conveyor
  async setConveyorState(on: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/plc/conv/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ on }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error controlling conveyor:', error);
      return false;
    }
  }

  // Create WebSocket connection
  createWebSocket(onMessage: (event: WSEvent) => void, onError?: (error: Event) => void): WebSocket {
    const ws = new WebSocket(`${WS_URL}/ws/events`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return ws;
  }
}

export const apiService = new ApiService();