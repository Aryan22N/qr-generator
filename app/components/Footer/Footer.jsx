import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                QR
              </div>
              <span className="text-2xl font-bold text-slate-900">
                Generator
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Create professional QR codes and stunning business cards in
              seconds. Elevate your brand identity with our premium tools.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialLink href="#" icon="twitter" />
              <SocialLink href="#" icon="github" />
              <SocialLink href="#" icon="instagram" />
              <SocialLink href="#" icon="linkedin" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6">Product</h3>
            <ul className="space-y-3">
              <FooterLink href="/qr-generator">QR Generator</FooterLink>
              <FooterLink href="/Cardtemp">Business Cards</FooterLink>
              <FooterLink href="#">Templates</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Tutorials</FooterLink>
              <FooterLink href="#">Contact Support</FooterLink>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative animate-float">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white p-3 rounded-2xl shadow-xl">
                <Image
                  src="/footerimg.png"
                  alt="Footer image"
                  width={280}
                  height={200}
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} QR Generator System. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-slate-500 hover:text-blue-600 transition-colors font-medium"
    >
      {children}
    </a>
  </li>
);

// Simple SVG icons components
const SocialLink = ({ href, icon }) => {
  const icons = {
    twitter: (
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    ),
    github: (
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    ),
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
    linkedin: (
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    ),
  };

  return (
    <a
      href={href}
      className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[icon]}
      </svg>
    </a>
  );
};

export default Footer;
