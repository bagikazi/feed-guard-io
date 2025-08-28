import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StatusFooter() {
  const [fps, setFps] = useState(30);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    // Simulate FPS fluctuation
    const fpsInterval = setInterval(() => {
      setFps(prev => {
        const variation = (Math.random() - 0.5) * 4;
        return Math.max(25, Math.min(35, prev + variation));
      });
    }, 1000);

    // Track uptime
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(fpsInterval);
      clearInterval(uptimeInterval);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-panel border-border shadow-panel">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Performance Metrics */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">FPS:</span>
              <Badge variant="outline" className="font-mono">
                {fps.toFixed(1)}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Uptime:</span>
              <span className="text-sm font-mono text-foreground">{formatUptime(uptime)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Resolution:</span>
              <span className="text-sm font-mono text-foreground">2448×2048</span>
            </div>
          </div>

          {/* Model Configuration */}
          <div className="flex items-center space-x-6">
            <div className="text-sm text-muted-foreground">
              Model: YOLO | Conf: 0.30 | NMS: 0.50 | Slice: 768×768
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow" />
              <span className="text-sm text-success">System Ready</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}