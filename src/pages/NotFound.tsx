
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80">
      <div className="text-center space-y-6 max-w-md p-6">
        <div className="mx-auto size-20 rounded-full bg-muted/50 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-destructive/80" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
        
        <p className="text-muted-foreground text-lg">
          Sorry, we couldn't find the page you're looking for. The page may have been moved or doesn't exist.
        </p>
        
        <div className="pt-4">
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Error: Attempted to access <code className="px-1 py-0.5 bg-muted/50 rounded">{location.pathname}</code>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
