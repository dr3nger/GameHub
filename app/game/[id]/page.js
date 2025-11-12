import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/Header'; // إعادة استخدام الهيدر
// تم حذف الاستيرادات التي نُقلت إلى المكون الجديد
import GameVisitTracker from '@/components/GameVisitTracker'; // <-- الملف الجديد
import GamePageClient from '@/components/GamePageClient'; // <-- 1. استيراد المكون الجديد
// تم حذف استيراد lucide-react و Link
import { Suspense } from 'react'; // Suspense للهيدر

// (كود الترجمة الكامل)
const translations = {
  en: {
    siteName: 'porn4games',
    back: 'Back to list',
    description: 'Description',
    screenshots: 'Screenshots',
    downloads: 'Downloads',
    windows: 'Windows',
    mac: 'Mac',
    linux: 'Linux',
    android: 'Android',
    relatedGames: 'Related Games',
    supportedLanguages: 'Supported Languages',
    ratings: 'ratings',
    // ...
  },
  ar: {
    siteName: 'porn4games',
    back: 'العودة للقائمة',
    description: 'الوصف',
    screenshots: 'لقطات الشاشة',
    downloads: 'التحميلات',
    windows: 'ويندوز',
    mac: 'ماك',
    linux: 'لينكس',
    android: 'أندرويد',
    relatedGames: 'ألعاب مشابهة',
    supportedLanguages: 'اللغات المدعومة',
    ratings: 'تقييمات',
    // ...
  },
  de: {
    siteName: 'porn4games',
    back: 'Zurück zur Liste',
    description: 'Beschreibung',
    screenshots: 'Screenshots',
    downloads: 'Downloads',
    windows: 'Windows',
    mac: 'Mac',
    linux: 'Linux',
    android: 'Android',
    relatedGames: 'Ähnliche Spiele',
    supportedLanguages: 'Unterstützte Sprachen',
    ratings: 'Bewertungen',
    // ...
  },
};

// دالة جلب اللعبة (من الخادم) - تم حذف زيادة الزيارات من هنا
async function getGame(id) {
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) console.error("Error fetching game:", error.message);
  return game;
}

async function getRelatedGames(categories, id) {
  if (!categories || categories.length === 0) return [];
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .contains('categories', categories)
    .neq('id', id) // لا تُظهر اللعبة نفسها
    .limit(5);
  if (error) console.error("Error fetching related games:", error.message);
  return games || [];
}

// تم حذف دالة formatWebUrl (نُقلت إلى المكون الجديد)

// هذا المكون سيحتوي على الهيدر (الذي يستخدم searchParams)
function GamePageHeader({ lang, t, searchParams }) {
  // لا نحتاج لجلب التصنيفات هنا لأن الهيدر في صفحة اللعبة لا يعرضها
  return <Header lang={lang} t={t} allCategories={[]} searchParams={searchParams} />
}

export default async function GamePage({ params, searchParams }) {
  const lang = searchParams.lang || 'en';
  const t = translations[lang] || translations.en;
  
  // جلب اللعبة والألعاب المشابهة
  const game = await getGame(params.id);

  if (!game) {
     return (
      <main>
        <Suspense fallback={<header className="h-24 bg-black/30 backdrop-blur-md border-b border-purple-500/20"></header>}>
          <GamePageHeader lang={lang} t={t} searchParams={searchParams} />
        </Suspense>
        <div className="container mx-auto px-4 py-8 text-white text-center text-2xl">
          Game not found.
        </div>
      </main>
     );
  }
  
  const relatedGames = await getRelatedGames(game.categories, game.id);
  // تم حذف isRTL

  return (
    <main>
      {/* زيادة الزيارات تتم الآن بأمان من جانب العميل */}
      <GameVisitTracker game_id={params.id} />

      <Suspense fallback={<header className="h-24 bg-black/30 backdrop-blur-md border-b border-purple-500/20"></header>}>
        <GamePageHeader lang={lang} t={t} searchParams={searchParams} />
      </Suspense>

      {/* 2. تمرير البيانات إلى المكون الجديد */}
      <GamePageClient game={game} relatedGames={relatedGames} t={t} lang={lang} />
      
    </main>
  );
}