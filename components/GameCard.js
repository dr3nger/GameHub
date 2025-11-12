"use client"; // <-- تأكد من وجود هذا السطر

import Link from 'next/link';
import { AppWindow, Apple, Bot, Smartphone, Star } from 'lucide-react';

export default function GameCard({ game, t }) {
  return (
    <Link
      href={`/game/${game.id}`}
      className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all hover:transform hover:scale-105 cursor-pointer"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={
            game.image ||
            'https://placehold.co/400x300/4a0e71/ffffff?text=No+Image'
          }
          alt={game.name}
          className="w-full h-full object-cover"
          onError={(e) => { // <-- هذا السطر آمن الآن
            e.target.onerror = null;
            e.target.src =
              'https://placehold.co/400x300/4a0e71/ffffff?text=Error';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="text-xl font-bold text-white truncate">{game.name}</h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {game.links?.windows && (
              <AppWindow
                className="w-4 h-4 text-blue-300"
                title={t.windows}
              />
            )}
            {game.links?.mac && (
              <Apple className="w-4 h-4 text-gray-300" title={t.mac} />
            )}
            {game.links?.linux && (
              <Bot className="w-4 h-4 text-yellow-300" title={t.linux} />
            )}
            {game.links?.android && (
              <Smartphone
                className="w-4 h-4 text-green-300"
                title={t.android}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(game.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`}
                fill="currentColor"
              />
            ))}
          </div>
          <span>({game.rating_count || 0})</span>
        </div>
      </div>
    </Link>
  );
}