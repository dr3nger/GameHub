import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/Header'; // إعادة استخدام الهيدر
import Rating from '@/components/Rating'; // مكون النجوم التفاعلي
import GameCard from '@/components/GameCard'; // لإظهار الألعاب المشابهة
import GameVisitTracker from '@/components/GameVisitTracker'; // <-- الملف الجديد
import GameImage from '@/components/GameImage'; // <-- 1. استيراد المكون الجديد
import {
  ArrowLeft,
  Eye,
  AppWindow,
  Apple,
  Bot,
  Smartphone,
  Star,
} from 'lucide-react';
import Link from 'next/link';
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

const formatWebUrl = (url) => {
  if (!url) return '#';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//')
  ) {
    return url;
  }
  return `https://${url}`;
};

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
  const isRTL = lang === 'ar';

  return (
    <main>
      {/* زيادة الزيارات تتم الآن بأمان من جانب العميل */}
      <GameVisitTracker game_id={params.id} />

      <Suspense fallback={<header className="h-24 bg-black/30 backdrop-blur-md border-b border-purple-500/20"></header>}>
        <GamePageHeader lang={lang} t={t} searchParams={searchParams} />
      </Suspense>

      <div
        className="container mx-auto px-4 py-8 text-white"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Link
          href={`/?lang=${lang}`}
          className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-all mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back}</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            {/* 2. استخدام المكون الجديد بدلاً من <img> */}
            <GameImage
              src={
                game.image ||
                'https://placehold.co/400x600/4a0e71/ffffff?text=No+Image'
              }
              alt={game.name}
              className="w-full h-auto object-cover rounded-xl shadow-lg border-2 border-purple-500/30"
              errorSrc="https://placehold.co/400x600/4a0e71/ffffff?text=Error"
            />
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{game.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {(game.categories || []).map((cat) => (
                <Link
                  key={cat}
                  href={`/?lang=${lang}&category=${cat}`}
                  className="inline-block px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm hover:bg-purple-600 hover:text-white transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {game.languages && game.languages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t.supportedLanguages}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(game.languages || []).map((lang) => (
                    <span
                      key={lang}
                      className="inline-block px-3 py-1 bg-gray-600/30 text-gray-300 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Eye className="w-5 h-5" />
              <span>{game.visits || 0}</span>
            </div>

            {/* --- مكون التقييم التفاعلي --- */}
            <Rating game={game} t={t} />
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">
            {t.description}
          </h3>
          <p className="text-gray-300 text-lg whitespace-pre-wrap">
            {game.description}
          </p>
        </div>

        {game.screenshots && game.screenshots.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t.screenshots}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {game.screenshots.map((ss, index) => (
                <img
                  key={index}
                  src={ss}
                  alt={`${game.name} screenshot ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg border border-purple-500/20"
                />
              ))}
            </div>
          </div>
        )}

        {(game.links?.windows ||
          game.links?.mac ||
          game.links?.linux ||
          game.links?.android) && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t.downloads}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {game.links.windows && (
                <a
                  href={formatWebUrl(game.links.windows)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  <AppWindow className="w-6 h-6" />
                  <span className="font-semibold">{t.windows}</span>
                </a>
              )}
               {game.links.mac && (
                <a
                  href={formatWebUrl(game.links.mac)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  <Apple className="w-6 h-6" />
                  <span className="font-semibold">{t.mac}</span>
                </a>
              )}
               {game.links.linux && (
                <a
                  href={formatWebUrl(game.links.linux)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                >
                  <Bot className="w-6 h-6" />
                  <span className="font-semibold">{t.linux}</span>
                </a>
              )}
               {game.links.android && (
                <a
                  href={formatWebUrl(game.links.android)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="font-semibold">{t.android}</span>
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* قسم الألعاب المشابهة */}
        {relatedGames.length > 0 && (
          <div className="mt-12">
             <h3 className="text-2xl font-bold text-white mb-4">
              {t.relatedGames}
            </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedGames.map((relatedGame) => (
                  <GameCard key={relatedGame.id} game={relatedGame} t={t} lang={lang} />
                ))}
             </div>
          </div>
        )}
      </div>
    </main>
  );
}