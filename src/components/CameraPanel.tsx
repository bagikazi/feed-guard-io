import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, type Detection } from "@/services/api";

interface CameraPanelProps {
  detections?: Detection[];
  isDetected?: boolean;
  fps?: number;
}

export function CameraPanel({ detections = [], isDetected = false, fps = 30 }: CameraPanelProps) {
  const [timestamp, setTimestamp] = useState<string>("");
  const [streamError, setStreamError] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = () => {
    setStreamError(true);
  };

  const handleImageLoad = () => {
    setStreamError(false);
  };

  return (
    <Card className="relative bg-panel border-border shadow-panel overflow-hidden">
      <div className="aspect-[2448/2048] bg-gradient-to-br from-panel to-card relative">
        {/* Real Camera Feed */}
        {!streamError ? (
          <img
            src={apiService.getCameraStreamUrl()}
            alt="Camera Feed"
            className="w-full h-full object-contain"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          /* Fallback when stream is unavailable */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-destructive rounded-full" />
              </div>
              <div className="text-muted-foreground">
                <p className="text-sm">Camera Feed Unavailable</p>
                <p className="text-xs">Check backend connection</p>
              </div>
            </div>
          </div>
        )}

        {/* Real Detection Overlays */}
        {detections.length > 0 && (
          <div className="absolute inset-0">
            {detections.map((detection, index) => {
              const [x, y, width, height] = detection.bbox;
              const confidence = Math.round(detection.confidence * 100);
              
              return (
                <div
                  key={index}
                  className="absolute border-2 border-destructive bg-destructive/10 rounded"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
                    {detection.class_name}: {confidence}%
                  </div>
                </div>
              );
            })}
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