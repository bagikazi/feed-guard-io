import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiService, type PlcStatus } from "@/services/api";

interface PlcStatusExtended extends PlcStatus {
  heartbeat: boolean;
  conveyorRunning: boolean;
}

interface PlcStatusBarProps {
  status?: PlcStatusExtended;
  onConveyorToggle?: (running: boolean) => void;
  onSingleAnalysis?: () => void;
}

export function PlcStatusBar({ status, onConveyorToggle, onSingleAnalysis }: PlcStatusBarProps) {
  const [localStatus, setLocalStatus] = useState<PlcStatusExtended>({
    online: false,
    heartbeat: false,
    request: false,
    valid: false,
    last_decision: null,
    conveyorRunning: false
  });

  // Use provided status or fallback to local status
  const currentStatus = status || localStatus;

  // Fetch PLC status if not provided via props
  useEffect(() => {
    if (!status) {
      const fetchStatus = async () => {
        const plcStatus = await apiService.getPlcStatus();
        if (plcStatus) {
          setLocalStatus(prev => ({
            ...prev,
            ...plcStatus,
            heartbeat: prev.heartbeat, // Keep local heartbeat state
            conveyorRunning: prev.conveyorRunning // Keep local conveyor state
          }));
        }
      };

      fetchStatus();
      const interval = setInterval(fetchStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Simulate heartbeat pulse when not provided via WebSocket
  useEffect(() => {
    if (!status) {
      const heartbeatInterval = setInterval(() => {
        setLocalStatus(prev => ({ ...prev, heartbeat: !prev.heartbeat }));
      }, 300); // 0.3s heartbeat period

      return () => clearInterval(heartbeatInterval);
    }
  }, [status]);

  const handleConveyorToggle = async () => {
    const newState = !currentStatus.conveyorRunning;
    const success = await apiService.setConveyorState(newState);
    
    if (success) {
      if (onConveyorToggle) {
        onConveyorToggle(newState);
      } else {
        setLocalStatus(prev => ({ ...prev, conveyorRunning: newState }));
      }
    }
  };

  const handleSingleAnalysis = () => {
    if (onSingleAnalysis) {
      onSingleAnalysis();
    } else {
      // Local simulation
      setLocalStatus(prev => ({ ...prev, request: true }));
      setTimeout(() => {
        setLocalStatus(prev => ({ 
          ...prev, 
          request: false,
          valid: true,
          last_decision: Math.random() > 0.5 ? "NOK" : "OK"
        }));
        setTimeout(() => {
          setLocalStatus(prev => ({ ...prev, valid: false }));
        }, 60);
      }, 120);
    }
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
                variant={currentStatus.online ? "default" : "destructive"}
                className={currentStatus.online ? "bg-success text-success-foreground" : ""}
              >
                {currentStatus.online ? "ONLINE" : "OFFLINE"}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Heartbeat:</span>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-100 ${
                  currentStatus.heartbeat ? "bg-success shadow-status" : "bg-success/30"
                }`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Request:</span>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-100 ${
                  currentStatus.request ? "bg-warning shadow-glow" : "bg-muted"
                }`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Valid:</span>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-100 ${
                  currentStatus.valid ? "bg-primary shadow-glow" : "bg-muted"
                }`}
              />
            </div>

            {currentStatus.last_decision && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Result:</span>
                <Badge 
                  variant={currentStatus.last_decision === "OK" ? "default" : "destructive"}
                  className={currentStatus.last_decision === "OK" ? "bg-success text-success-foreground" : ""}
                >
                  {currentStatus.last_decision}
                </Badge>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleConveyorToggle}
              variant={currentStatus.conveyorRunning ? "destructive" : "default"}
              className={currentStatus.conveyorRunning ? "" : "bg-success hover:bg-success/90 text-success-foreground"}
            >
              {currentStatus.conveyorRunning ? "Stop Conveyor" : "Start Conveyor"}
            </Button>
            
            <Button
              onClick={handleSingleAnalysis}
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
              <span>Conveyor: {currentStatus.conveyorRunning ? "RUNNING" : "STOPPED"}</span>
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