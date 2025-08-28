import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PlcStatus {
  online: boolean;
  heartbeat: boolean;
  request: boolean;
  resultValid: boolean;
  lastDecision: "OK" | "NOK" | null;
  conveyorRunning: boolean;
}

export function PlcStatusBar() {
  const [status, setStatus] = useState<PlcStatus>({
    online: true,
    heartbeat: true,
    request: false,
    resultValid: false,
    lastDecision: null,
    conveyorRunning: false
  });

  // Simulate heartbeat pulse
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      setStatus(prev => ({ ...prev, heartbeat: !prev.heartbeat }));
    }, 300); // 0.3s heartbeat period

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Simulate PLC request pulse
  useEffect(() => {
    const requestInterval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of request
        setStatus(prev => ({ ...prev, request: true }));
        setTimeout(() => {
          setStatus(prev => ({ 
            ...prev, 
            request: false,
            resultValid: true,
            lastDecision: Math.random() > 0.7 ? "NOK" : "OK"
          }));
          
          // Clear result valid after pulse duration
          setTimeout(() => {
            setStatus(prev => ({ ...prev, resultValid: false }));
          }, 60); // 60ms pulse
        }, 120); // 120ms lookback
      }
    }, 2000);

    return () => clearInterval(requestInterval);
  }, []);

  const toggleConveyor = () => {
    setStatus(prev => ({ ...prev, conveyorRunning: !prev.conveyorRunning }));
  };

  const triggerSingleAnalysis = () => {
    setStatus(prev => ({ ...prev, request: true }));
    setTimeout(() => {
      setStatus(prev => ({ 
        ...prev, 
        request: false,
        resultValid: true,
        lastDecision: Math.random() > 0.5 ? "NOK" : "OK"
      }));
      setTimeout(() => {
        setStatus(prev => ({ ...prev, resultValid: false }));
      }, 60);
    }, 120);
  };

  return (
    <Card className="bg-panel border-border shadow-panel">
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* PLC Status Indicators */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">PLC Status:</span>
              <Badge 
                variant={status.online ? "default" : "destructive"}
                className={status.online ? "bg-success text-success-foreground" : ""}
              >
                {status.online ? "ONLINE" : "OFFLINE"}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Heartbeat:</span>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-100 ${
                  status.heartbeat ? "bg-success shadow-status" : "bg-success/30"
                }`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Request:</span>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-100 ${
                  status.request ? "bg-warning shadow-glow" : "bg-muted"
                }`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Valid:</span>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-100 ${
                  status.resultValid ? "bg-primary shadow-glow" : "bg-muted"
                }`}
              />
            </div>

            {status.lastDecision && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Result:</span>
                <Badge 
                  variant={status.lastDecision === "OK" ? "default" : "destructive"}
                  className={status.lastDecision === "OK" ? "bg-success text-success-foreground" : ""}
                >
                  {status.lastDecision}
                </Badge>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={toggleConveyor}
              variant={status.conveyorRunning ? "destructive" : "default"}
              className={status.conveyorRunning ? "" : "bg-success hover:bg-success/90 text-success-foreground"}
            >
              {status.conveyorRunning ? "Stop Conveyor" : "Start Conveyor"}
            </Button>
            
            <Button
              onClick={triggerSingleAnalysis}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Single Analyze
            </Button>
          </div>
        </div>

        {/* Additional Status Info */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex space-x-6">
              <span>PLC IP: 192.168.250.1</span>
              <span>Camera IP: 192.168.250.100</span>
              <span>Conveyor: {status.conveyorRunning ? "RUNNING" : "STOPPED"}</span>
            </div>
            <div className="text-xs">
              Heartbeat: 0.30s | Valid Pulse: 60ms | Lookback: 120ms
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}