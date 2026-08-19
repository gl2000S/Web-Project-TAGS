import Link from 'next/link';
import TAGS_logo from './TAGS_logo';

export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border-subtle py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center">
          <div className="scale-75 origin-left">
            <TAGS_logo/>
          </div>
        </div>

        <div className="flex gap-8">
          <Link href="/about" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">
            About
          </Link>
          <Link href="/contact" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">
            Contact
          </Link>
          <Link href="/privacy" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">
            Privacy
          </Link>
        </div>
        
        <div className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} TAGSearch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}