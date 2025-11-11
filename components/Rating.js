"use client";

import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Star } from 'lucide-react';

export default function Rating({ game, t }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  // نستخدم حالة محلية للعرض الفوري بعد التقييم
  const [displayRating, setDisplayRating] = useState(game.rating);
  const [ratingCount, setRatingCount] = useState(game.rating_count || 0);

  const handleRatingClick = async (rate) => {
    if (userRating) return; // لا تسمح بالتقييم مرتين

    const currentRatingCount = ratingCount;
    const currentRating = displayRating;

    const newTotalRating = currentRating * currentRatingCount + rate;
    const newRatingCount = currentRatingCount + 1;
    const newAverage = newTotalRating / newRatingCount;

    // تحديث الواجهة فوراً
    setUserRating(rate);
    setDisplayRating(newAverage);
    setRatingCount(newRatingCount);

    // إرسال التحديث إلى Supabase
    const { error } = await supabase
      .from('games')
      .update({ rating: newAverage, rating_count: newRatingCount })
      .eq('id', game.id);

    if (error) {
      console.error('Error updating rating:', error.message);
      // (يمكن التراجع عن التغيير المحلي هنا إذا فشل التحديث)
      setDisplayRating(game.rating);
      setRatingCount(game.rating_count);
      setUserRating(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const rate = i + 1;
          return (
            <Star
              key={i}
              className={`w-6 h-6 transition-colors ${
                rate <= (hoverRating || Math.round(userRating || displayRating))
                  ? 'text-yellow-400'
                  : 'text-gray-600'
              } ${
                !userRating
                  ? 'cursor-pointer hover:text-yellow-300'
                  : 'cursor-default'
              }`}
              fill="currentColor"
              onMouseEnter={() => !userRating && setHoverRating(rate)}
              onMouseLeave={() => !userRating && setHoverRating(0)}
              onClick={() => handleRatingClick(rate)}
            />
          );
        })}
      </div>
      <div className="text-gray-400 text-sm">
        <span>{displayRating.toFixed(1)} / 5</span>
        <span className="mx-2">|</span>
        <span>
          ({ratingCount} {t.ratings})
        </span>
      </div>
    </div>
  );
}