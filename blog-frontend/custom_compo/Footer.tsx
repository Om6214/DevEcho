import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Heart,
  BookOpen,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/20 border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Blogify
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A modern platform for writers and readers to share, discover, and engage with compelling stories and ideas.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Product
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  Latest
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-foreground hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and featured stories.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="flex-1 bg-background border-border text-sm"
                  type="email"
                />
                <Button size="sm" className="shrink-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {new Date().getFullYear()} Blogify. All rights reserved.
              <span className="flex items-center gap-1 text-xs">
                Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by our team
              </span>
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Built with</span>
            <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
              <span className="font-medium">Next.js</span>
              <span>+</span>
              <span className="font-medium">shadcn/ui</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Accent */}
      <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"></div>
    </footer>
  );
}