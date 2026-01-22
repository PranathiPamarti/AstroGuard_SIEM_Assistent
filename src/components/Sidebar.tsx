import { Shield, LayoutDashboard, MessageSquare, Database, FileText, Globe, FileBarChart, Target, Sparkles } from 'lucide-react';
import { cn } from './ui/utils';
import { Badge } from './ui/badge';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
  { id: 'mission', label: 'Mission Mode', icon: Target, badge: 'New', badgeColor: 'orange' },
  { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  { id: 'threatmap', label: 'Threat Map', icon: Globe },
  { id: 'explorer', label: 'Event Explorer', icon: Database },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 shadow-lg">
            <Sparkles className="h-7 w-7 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AstroGuard</h2>
            <p className="text-xs text-muted-foreground">ISRO AI Copilot</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                  isActive
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "" : "group-hover:scale-110 transition-transform"
                )} />
                <span className="text-sm flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className={cn(
                      "text-xs px-1.5 py-0",
                      item.badgeColor === 'orange' && !isActive && "border-orange-600 text-orange-600"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-3">
        <div className="p-3 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 rounded-lg border">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-medium">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Smart India Hackathon 2025
        </p>
      </div>
    </aside>
  );
}
