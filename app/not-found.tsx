import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4 md:p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>
          Return to Home
        </Button>
      </Link>
    </div>
  );
} 