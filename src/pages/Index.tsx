import { useState, useEffect, useRef } from "react";
import { CameraPanel } from "@/components/CameraPanel";
import { NokStrip } from "@/components/NokStrip";
import { PlcStatusBar } from "@/components/PlcStatusBar";
import { StatusFooter } from "@/components/StatusFooter";
import { apiService, type WSEvent, type Detection } from "@/services/api";

const Index = () => {
  const [wsData, setWsData] = useState<WSEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fps, setFps] = useState(30);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = apiService.createWebSocket(
          (event: WSEvent) => {
            setWsData(event);
            setDetections(event.detections);
            setFps(event.fps);
            setIsConnected(true);
          },
          (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
          }
        );

        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        setIsConnected(false);
        // Retry connection after 5 seconds
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleConveyorToggle = (running: boolean) => {
    console.log(`Conveyor ${running ? 'started' : 'stopped'}`);
  };

  const handleSingleAnalysis = () => {
    console.log('Single analysis triggered');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-panel shadow-panel">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Vision Inspection System</h1>
              <p className="text-sm text-muted-foreground">Industrial Quality Control Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-success animate-pulse-slow" : "bg-destructive"}`} />
                <span className={`text-sm font-medium ${isConnected ? "text-success" : "text-destructive"}`}>
                  {isConnected ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Detections: {detections.length} | FPS: {fps.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PLC Status Bar */}
      <div className="px-6 pt-4">
        <PlcStatusBar 
          status={wsData ? {
            ...wsData.plc,
            heartbeat: true, // Will be managed by component
            conveyorRunning: false // Will be managed by component
          } : undefined}
          onConveyorToggle={handleConveyorToggle}
          onSingleAnalysis={handleSingleAnalysis}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Camera Feed - Takes up 3/4 of the width */}
          <div className="lg:col-span-3">
            <CameraPanel 
              detections={detections}
              isDetected={!wsData?.ok && detections.length > 0}
              fps={fps} 
            />
          </div>
          
          {/* NOK Strip - Takes up 1/4 of the width */}
          <div className="lg:col-span-1">
            <NokStrip />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4">
        <StatusFooter />
      </div>
    </div>
  );
};

export default Index;
