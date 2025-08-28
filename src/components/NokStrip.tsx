import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface NokItem {
  id: string;
  name: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
}

// Mock data for NOK detections
const mockNokItems: NokItem[] = [
  { id: "1", name: "detected_001.jpg", timestamp: "14:23:15", severity: "high" },
  { id: "2", name: "detected_002.jpg", timestamp: "14:18:32", severity: "medium" },
  { id: "3", name: "detected_003.jpg", timestamp: "14:12:41", severity: "high" },
  { id: "4", name: "detected_004.jpg", timestamp: "14:08:19", severity: "low" },
  { id: "5", name: "detected_005.jpg", timestamp: "14:03:55", severity: "medium" },
  { id: "6", name: "detected_006.jpg", timestamp: "13:58:12", severity: "high" },
  { id: "7", name: "detected_007.jpg", timestamp: "13:52:44", severity: "low" },
  { id: "8", name: "detected_008.jpg", timestamp: "13:47:33", severity: "medium" },
];

export function NokStrip() {
  const [selectedItem, setSelectedItem] = useState<NokItem | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive border-destructive";
      case "medium": return "bg-warning border-warning";
      case "low": return "bg-accent border-accent";
      default: return "bg-muted border-muted";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  return (
    <Card className="bg-panel border-border shadow-panel h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">NOK Detections</h3>
        <p className="text-sm text-muted-foreground">Last 12 items</p>
      </div>
      
      <ScrollArea className="h-[calc(100%-5rem)]">
        <div className="p-4 space-y-3">
          {mockNokItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div 
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-glow ${getSeverityColor(item.severity)}`}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Thumbnail placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-panel to-card flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto bg-destructive/30 rounded mb-2" />
                      <div className="text-xs text-foreground/70">NOK #{item.id}</div>
                    </div>
                  </div>
                  
                  {/* Overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getSeverityBadge(item.severity)} className="text-xs">
                        {item.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-foreground/80">{item.timestamp}</span>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-medium bg-primary/80 px-2 py-1 rounded">
                      Click to view
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl bg-panel border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">NOK Detection Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-card to-panel rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 mx-auto bg-destructive/30 rounded-lg" />
                      <p className="text-muted-foreground">Full Resolution Image</p>
                      <p className="text-sm text-foreground">{item.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="ml-2 text-foreground">{item.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Severity:</span>
                      <Badge variant={getSeverityBadge(item.severity)} className="ml-2">
                        {item.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">File:</span>
                      <span className="ml-2 text-foreground font-mono">{item.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resolution:</span>
                      <span className="ml-2 text-foreground">2448×2048</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}