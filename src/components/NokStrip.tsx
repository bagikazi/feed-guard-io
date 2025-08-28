import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiService, type NokItem } from "@/services/api";

interface NokItemExtended extends NokItem {
  id: string;
  severity: "high" | "medium" | "low";
}

export function NokStrip() {
  const [nokItems, setNokItems] = useState<NokItemExtended[]>([]);
  const [selectedItem, setSelectedItem] = useState<NokItemExtended | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch NOK items from backend
  useEffect(() => {
    const fetchNokItems = async () => {
      setLoading(true);
      try {
        const items = await apiService.getNokList(12);
        const extendedItems: NokItemExtended[] = items.map((item, index) => ({
          ...item,
          id: (index + 1).toString(),
          severity: Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low" as "high" | "medium" | "low"
        }));
        setNokItems(extendedItems);
      } catch (error) {
        console.error('Failed to fetch NOK items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNokItems();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNokItems, 30000);
    return () => clearInterval(interval);
  }, []);

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
          {loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading NOK detections...</div>
            </div>
          ) : nokItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No NOK detections found</div>
            </div>
          ) : (
            nokItems.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div 
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-glow ${getSeverityColor(item.severity)}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Real NOK Image Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-panel to-card flex items-center justify-center overflow-hidden">
                      <img
                        src={apiService.getNokImageUrl(item.name)}
                        alt={`NOK Detection ${item.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center">
                                <div class="w-8 h-8 mx-auto bg-destructive/30 rounded mb-2"></div>
                                <div class="text-xs text-foreground/70">NOK #${item.id}</div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    
                    {/* Overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={getSeverityBadge(item.severity)} className="text-xs">
                          {item.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-foreground/80">{item.ts}</span>
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
                    <div className="aspect-video bg-gradient-to-br from-card to-panel rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={apiService.getNokImageUrl(item.name)}
                        alt={`NOK Detection ${item.id} Full Size`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center space-y-2">
                                <div class="w-16 h-16 mx-auto bg-destructive/30 rounded-lg"></div>
                                <p class="text-muted-foreground">Image not available</p>
                                <p class="text-sm text-foreground">${item.name}</p>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Timestamp:</span>
                        <span className="ml-2 text-foreground">{item.ts}</span>
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
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}