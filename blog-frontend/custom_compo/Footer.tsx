import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-3/4 mx-auto mt-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">Blogify</h2>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blogify. All rights reserved.
          </p>
        </div>

        {/* Middle Links */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>

        {/* Right Section (Social / CTA) */}
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com">GitHub</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://twitter.com">Twitter</Link>
          </Button>
        </div>
      </div>

      <Separator />
      <p className="text-center text-xs text-muted-foreground py-3">
        Built with ❤️ using Next.js & shadcn/ui
      </p>
    </footer>
  );
}
