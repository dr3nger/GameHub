"use client"; // <-- تأكد من وجود هذا السطر

import { Mail, Send, Twitter, Youtube } from 'lucide-react';
import { RedditIcon } from './Icons'; // الأيقونة المخصصة التي أنشأناها

// قائمة الأيقونات لربطها بالأسماء
const iconMap = {
  reddit: <RedditIcon className="w-6 h-6" />,
  telegram: <Send className="w-6 h-6" />,
  youtube: <Youtube className="w-6 h-6" />,
  twitter: <Twitter className="w-6 h-6" />,
  email: <Mail className="w-6 h-6" />,
};

const formatWebUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.includes('@')) {
    return `mailto:${url}`;
  }
  return `https://${url}`;
};

export default function Footer({ socialLinks }) {
  // التأكد من أن socialLinks موجود قبل محاولة استخدامه
  if (!socialLinks) {
    return null; // أو إرجاع تذييل افتراضي
  }

  return (
    <footer className="bg-black/30 border-t border-purple-500/20 mt-12 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 mb-4 md:mb-0">
          © {new Date().getFullYear()} porn4games. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          {Object.entries(socialLinks).map(([key, url]) => {
            if (url) {
              return (
                <a
                  key={key}
                  href={formatWebUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {iconMap[key] || <span>{key}</span>}
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>
    </footer>
  );
}