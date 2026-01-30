import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const footerLinks = [
  { name: 'Audio Description', href: '#' },
  { name: 'Help Center', href: '#' },
  { name: 'Gift Cards', href: '#' },
  { name: 'Media Center', href: '#' },
  { name: 'Investor Relations', href: '#' },
  { name: 'Jobs', href: '#' },
  { name: 'Terms of Use', href: '#' },
  { name: 'Privacy', href: '#' },
  { name: 'Legal Notices', href: '#' },
  { name: 'Cookie Preferences', href: '#' },
  { name: 'Corporate Information', href: '#' },
  { name: 'Contact Us', href: '#' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="border-t border-netflix-gray bg-netflix-black py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        {/* Social Links */}
        <div className="mb-8 flex gap-6">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.name}
                href={social.href}
                className="text-netflix-lightGray hover:text-white transition-colors"
                aria-label={social.name}
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          })}
        </div>

        {/* Footer Links */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-netflix-lightGray hover:underline"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Service Code Button */}
        <button className="mb-6 border border-netflix-lightGray px-4 py-2 text-sm text-netflix-lightGray hover:border-white hover:text-white transition-colors">
          Service Code
        </button>

        {/* Copyright */}
        <p className="text-sm text-netflix-lightGray">
          © {new Date().getFullYear()} Netflix Clone. Built with Next.js, TypeScript, and Supabase.
        </p>
      </div>
    </footer>
  );
}

