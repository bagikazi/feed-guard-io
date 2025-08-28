import { useState } from "react";
import { CameraPanel } from "@/components/CameraPanel";
import { NokStrip } from "@/components/NokStrip";
import { PlcStatusBar } from "@/components/PlcStatusBar";
import { StatusFooter } from "@/components/StatusFooter";

const Index = () => {
  const [isDetected, setIsDetected] = useState(false);

  // Simulate detection state changes
  const toggleDetection = () => {
    setIsDetected(!isDetected);
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
              <button 
                onClick={toggleDetection}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm"
              >
                {isDetected ? "Simulate OK" : "Simulate NOK"}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow" />
                <span className="text-sm text-success font-medium">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PLC Status Bar */}
      <div className="px-6 pt-4">
        <PlcStatusBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Camera Feed - Takes up 3/4 of the width */}
          <div className="lg:col-span-3">
            <CameraPanel isDetected={isDetected} fps={29.8} />
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
