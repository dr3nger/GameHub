import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/Header'; 
import GameVisitTracker from '@/components/GameVisitTracker'; 
import GamePageClient from '@/components/GamePageClient'; 
import { Suspense } from 'react'; 

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

// --- 💡 إضافة SEO 💡 ---
// دالة لإنشاء البيانات الوصفية الديناميكية
export async function generateMetadata({ params, searchParams }) {
  const game = await getGame(params.id);

  if (!game) {
    return {
      title: 'Game Not Found',
      description: 'The game you are looking for does not exist.',
    };
  }

  // اقتصاص الوصف ليكون مناسباً لـ SEO (عادة 155-160 حرف)
  const description = game.description 
    ? game.description.substring(0, 155) + '...'
    : 'No description available for this game.';

  // --- 💡 إضافة SEO: الكلمات المفتاحية ---
  // إنشاء كلمات مفتاحية ديناميكية من اسم اللعبة وتصنيفاتها
  const dynamicKeywords = [game.name, `download ${game.name}`, `free ${game.name}`];
  if (game.categories && game.categories.length > 0) {
    dynamicKeywords.push(...game.categories);
  }
  // --- نهاية الإضافة ---

  return {
    title: game.name, // سيستخدم القالب ليصبح "Game Name | porn4games"
    description: description,
    // --- 💡 إضافة SEO: الكلمات المفتاحية ---
    keywords: dynamicKeywords,
    // --- نهاية الإضافة ---
    openGraph: {
      title: game.name,
      description: description,
      images: [
        {
          url: game.image || '/logo.png', // استخدم صورة اللعبة
          width: 400,
          height: 600,
          alt: game.name,
        },
      ],
      type: 'article', // يمكنك اعتباره "مقالة" عن اللعبة
    },
    twitter: {
      card: 'summary_large_image',
      title: game.name,
      description: description,
      images: [game.image || '/logo.png'],
    },
  };
}
// --- نهاية إضافة SEO ---


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

// --- 💡 دالة جلب الألعاب المرتبطة (المنطق المطلوب موجود هنا بالفعل) ---
async function getRelatedGames(categories, id) {
  // 1. هذا هو المعيار الذي طلبته: 3 تاغات مشتركة كحد أدنى
  const MIN_COMMON_TAGS = 3; 
  const MAX_RESULTS = 5; 
  const CANDIDATE_LIMIT = 50; 

  // إذا لم تكن هناك تاغات، أعد مصفوفة فارغة
  if (!categories || categories.length === 0) {
    return [];
  }

  // --- الشرط الأساسي (Fallback) ---
  // إذا كانت اللعبة نفسها تحتوي على أقل من 3 تاغات، نعود للمنطق القديم (تاغ واحد مشترك)
  if (categories.length < MIN_COMMON_TAGS) {
    console.warn(`Game ${id} has < ${MIN_COMMON_TAGS} tags. Falling back to 1-tag match.`);
    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .overlaps('categories', categories) // <-- تم التغيير هنا أيضاً للأمان
      .neq('id', id)
      .limit(MAX_RESULTS);
    if (error) console.error("Error fetching related games (fallback):", error.message);
    return games || [];
  }

  // --- المنطق الجديد (3+ تاغات مشتركة) - هذا هو ما طلبته ---

  // الخطوة 1: جلب الألعاب "المرشحة" التي تشترك في تاغ واحد على الأقل
  const { data: candidateGames, error } = await supabase
    .from('games')
    .select('*') 
    // --- 💡💡💡 هذا هو السطر الذي تم إصلاحه 💡💡💡 ---
    .overlaps('categories', categories) // <-- هذا هو الإصلاح (يطلب *تاغ واحد مشترك* على الأقل)
    // --- نهاية الإصلاح ---
    .neq('id', id) // استثناء اللعبة الحالية
    .limit(CANDIDATE_LIMIT); // جلب 50 مرشحاً للفلترة

  if (error) {
    console.error("Error fetching related game candidates:", error.message);
    return [];
  }

  // الخطوة 2: فلترة "المرشحين" في جافاسكريبت (هذا الكود كان صحيحاً ويعمل)
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
    // 💡 هنا يتم تطبيق المعيار الذي طلبته
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
// --- 💡 نهاية الدالة ---


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