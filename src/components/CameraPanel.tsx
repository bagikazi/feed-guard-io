import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CameraPanelProps {
  isDetected?: boolean;
  fps?: number;
}

export function CameraPanel({ isDetected = false, fps = 30 }: CameraPanelProps) {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative bg-panel border-border shadow-panel overflow-hidden">
      <div className="aspect-[2448/2048] bg-gradient-to-br from-panel to-card relative">
        {/* Camera Feed Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full animate-pulse-slow" />
            </div>
            <div className="text-muted-foreground">
              <p className="text-sm">Camera Feed</p>
              <p className="text-xs">2448×2048 @ {fps} FPS</p>
            </div>
          </div>
        </div>

        {/* Overlay Annotations Simulation */}
        {isDetected && (
          <div className="absolute inset-0">
            {/* Detection Box */}
            <div className="absolute top-1/3 left-1/4 w-1/3 h-1/4 border-2 border-destructive bg-destructive/10 rounded-lg animate-pulse">
              <div className="absolute -top-6 left-0 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
                Defect: 85%
              </div>
            </div>
            
            {/* Additional detection areas */}
            <div className="absolute top-1/2 right-1/4 w-1/6 h-1/8 border border-warning bg-warning/10 rounded">
              <div className="absolute -top-5 left-0 bg-warning text-warning-foreground px-1 py-0.5 rounded text-xs">
                Check: 72%
              </div>
            </div>
          </div>
        )}

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 space-y-2">
          <Badge variant={isDetected ? "destructive" : "secondary"} className="bg-background/80 backdrop-blur-sm">
            {isDetected ? "NOK DETECTED" : "OK"}
          </Badge>
          <div className="text-xs text-foreground/80 bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
            {timestamp}
          </div>
        </div>

        {/* FPS Counter */}
        <div className="absolute top-4 right-4">
          <div className="text-xs text-foreground/80 bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
            {fps} FPS
          </div>
        </div>

        {/* Large NOK Overlay */}
        {isDetected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-destructive/90 text-destructive-foreground px-8 py-4 rounded-lg shadow-lg animate-pulse-slow">
              <div className="text-2xl font-bold text-center">NOT OKAY</div>
              <div className="text-sm text-center opacity-90">Quality Issue Detected</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}