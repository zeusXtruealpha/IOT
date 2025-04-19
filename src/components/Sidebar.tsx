
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  Database, 
  LineChart, 
  BrainCircuit, 
  Activity, 
  Settings,
  Droplets,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();
  
  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
    { href: '/data-analytics', icon: LineChart, label: 'Data Analytics' },
    { href: '/model-analysis', icon: BrainCircuit, label: 'Model Analysis' },
    { href: '/advanced-analysis', icon: Activity, label: 'Advanced Analysis' },
    { href: '/recent-data', icon: Database, label: 'Recent Data' },
  ];
  
  return (
    <aside className="h-screen w-64 bg-sidebar fixed left-0 top-0 z-30 border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <Droplets className="h-6 w-6 text-water-400" />
          <span className="text-xl font-semibold">AquaQuality</span>
        </div>
        <div className="text-xs text-sidebar-foreground/70 mt-1">
          Water Quality Monitoring System
        </div>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "sidebar-link",
              location.pathname === link.href && "active"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-sidebar-foreground/80">System Active</span>
          </div>
          <Settings className="h-4 w-4 text-sidebar-foreground/60" />
        </div>
        <div className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>API Key: 6PC469...</span>
        </div>
      </div>
    </aside>
  );
}
