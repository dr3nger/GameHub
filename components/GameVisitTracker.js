"use client";

import { useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function GameVisitTracker({ game_id }) {
  useEffect(() => {
    const increment = async () => {
      try {
        // نقوم بزيادة عدد الزيارات هنا من جانب العميل
        await supabase.rpc('increment_visits', { game_id: game_id });
      } catch (rpcError) {
        console.error('Error incrementing visits:', rpcError);
      }
    };
    
    // تأكد من أن game_id موجود قبل الاستدعاء
    if (game_id) {
      increment();
    }
  }, [game_id]); // سيتم تشغيله مرة واحدة عند تحميل الصفحة

  return null; // هذا المكون لا يعرض أي شيء
}