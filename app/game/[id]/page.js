import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/Header'; // إعادة استخدام الهيدر
// تم حذف الاستيرادات التي نُقلت إلى المكون الجديد
import GameVisitTracker from '@/components/GameVisitTracker'; // <-- الملف الجديد
import GamePageClient from '@/components/GamePageClient'; // <-- 1. استيراد المكون الجديد
// تم حذف استيراد lucide-react و Link
import { Suspense } from 'react'; // Suspense للهيدر

// (كود الترجمة الكامل - يبقى كما هو)
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

// دالة جلب اللعبة (من الخادم) - تبقى كما هي
async function getGame(id) {
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) console.error("Error fetching game:", error.message);
  return game;
}

// --- 💡 بداية التعديل: دالة جلب الألعاب المرتبطة ---
async function getRelatedGames(categories, id) {
  const MIN_COMMON_TAGS = 3; // الشرط: 3 تاغات مشتركة
  const MAX_RESULTS = 5; // أقصى عدد للألعاب المرتبطة
  const CANDIDATE_LIMIT = 50; // كم عدد الألعاب المرشحة لجلبها من قاعدة البيانات

  // إذا لم تكن هناك تاغات، أعد مصفوفة فارغة
  if (!categories || categories.length === 0) {
    return [];
  }

  // --- الشرط الأساسي (Fallback) ---
  // إذا كانت اللعبة نفسها تحتوي على أقل من 3 تاغات، فمن المستحيل إيجاد 3 تاغات مشتركة
  // لذلك، نعود للمنطق القديم (تاغ واحد مشترك على الأقل)
  if (categories.length < MIN_COMMON_TAGS) {
    console.warn(`Game ${id} has < ${MIN_COMMON_TAGS} tags. Falling back to 1-tag match.`);
    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .contains('categories', categories)
      .neq('id', id)
      .limit(MAX_RESULTS);
    if (error) console.error("Error fetching related games (fallback):", error.message);
    return games || [];
  }

  // --- المنطق الجديد (3+ تاغات مشتركة) ---

  // الخطوة 1: جلب الألعاب "المرشحة" التي تشترك في تاغ واحد على الأقل
  const { data: candidateGames, error } = await supabase
    .from('games')
    .select('*') // جلب كل البيانات للألعاب المرشحة
    .contains('categories', categories) // .contains = (تاغ1 أو تاغ2 أو تاغ3 ...)
    .neq('id', id) // استثناء اللعبة الحالية
    .limit(CANDIDATE_LIMIT); // جلب 50 مرشحاً للفلترة

  if (error) {
    console.error("Error fetching related game candidates:", error.message);
    return [];
  }

  // الخطوة 2: فلترة "المرشحين" في جافاسكريبت
  const currentGameTags = new Set(categories); // Set للبحث السريع
  const relatedGames = [];

  for (const game of (candidateGames || [])) {
    // تخطي إذا لم يكن للعبة تاغات
    if (!game.categories || game.categories.length === 0) continue;

    let commonTagsCount = 0;
    const gameTags = new Set(game.categories);

    // حساب عدد التاغات المشتركة
    for (const tag of gameTags) {
      if (currentGameTags.has(tag)) {
        commonTagsCount++;
      }
    }

    // الخطوة 3: التحقق إذا كانت اللعبة تطابق الشرط (3+ تاغات)
    if (commonTagsCount >= MIN_COMMON_TAGS) {
      relatedGames.push(game);
    }

    // الخطوة 4: التوقف عند الوصول للحد الأقصى للنتائج
    if (relatedGames.length >= MAX_RESULTS) {
      break;
    }
  }

  return relatedGames;
}
// --- 💡 نهاية التعديل ---


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
  
  // 💡 استدعاء الدالة الجديدة. سيتم الآن جلب الألعاب حسب المنطق الجديد
  const relatedGames = await getRelatedGames(game.categories, game.id);

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