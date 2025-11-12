import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import Pagination from '@/components/Pagination';
import Footer from '@/components/Footer';
import { Suspense } from 'react'; // لإضافة حدود Suspense

// --- 💡 الحل الجديد هنا 💡 ---
// هذا السطر يخبر Vercel أن هذه الصفحة ديناميكية دائماً
// ويجب جلب البيانات مع كل زيارة
export const dynamic = 'force-dynamic';
// --- نهاية الحل ---

const GAMES_PER_PAGE = 20;

// (كود الترجمة)
const translations = {
  en: {
    siteName: 'porn4games',
    search: 'Search games...',
    popular: 'Popular',
    new: 'New',
    tags: 'Tags',
    allCategories: 'All Categories',
    noGames: 'No games found matching your criteria.',
    loadingGames: 'Loading games...',
    page: 'Page',
    of: 'of',
    first: 'First',
    last: 'Last',
    back: 'Back',
    next: 'Next',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    submitSearch: 'Search',
    windows: 'Windows',
    mac: 'Mac',
    linux: 'Linux',
    android: 'Android',
    ratings: 'ratings',
  },
  ar: {
    siteName: 'porn4games',
    search: 'ابحث عن الألعاب...',
    popular: 'الأكثر شعبية',
    new: 'الأحدث',
    tags: 'التصنيفات',
    allCategories: 'كل التصنيفات',
    noGames: 'لا توجد ألعاب تطابق بحثك.',
    loadingGames: 'جاري تحميل الألعاب...',
    page: 'صفحة',
    of: 'من',
    first: 'الأولى',
    last: 'الأخيرة',
    back: 'العودة',
    next: 'التالي',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    submitSearch: 'بحث',
    windows: 'ويندوز',
    mac: 'ماك',
    linux: 'لينكس',
    android: 'أندرويد',
    ratings: 'تقييمات',
  },
  de: {
    siteName: 'porn4games',
    search: 'Spiele suchen...',
    popular: 'Beliebt',
    new: 'Neu',
    tags: 'Tags',
    allCategories: 'Alle Kategorien',
    noGames: 'Keine Spiele gefunden, die Ihren Kriterien entsprechen.',
    loadingGames: 'Lade Spiele...',
    page: 'Seite',
    of: 'von',
    first: 'Erste',
    last: 'Letzte',
    back: 'Zurück',
    next: 'Nächste',
    login: 'Anmelden',
    logout: 'Abmelden',
    dashboard: 'Dashboard',
    submitSearch: 'Suchen',
    windows: 'Windows',
    mac: 'Mac',
    linux: 'Linux',
    android: 'Android',
    ratings: 'Bewertungen',
  },
};

// دالة جلب الألعاب (تعمل على الخادم)
async function fetchGames(searchParams) {
  const t = translations[searchParams.lang] || translations.en;
  let query = supabase.from('games').select('*', { count: 'exact' });

  // 1. الفلترة بالبحث
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  // 2. الفلترة بالتصنيف
  if (searchParams.category) {
    query = query.contains('categories', [searchParams.category]);
  }

  // 3. الفرز
  const sortBy = searchParams.sortBy || 'new';
  query = query.order(sortBy === 'popular' ? 'visits' : 'created_at', {
    ascending: false,
  });

  // 4. ترقيم الصفحات
  const page = parseInt(searchParams.page) || 1;
  const from = (page - 1) * GAMES_PER_PAGE;
  const to = from + GAMES_PER_PAGE - 1;
  query = query.range(from, to);

  // تنفيذ الطلب
  const { data: games, error, count } = await query;

  if (error) {
    console.error('Error fetching games:', error.message);
    return { games: [], totalPages: 0, t, error: error.message };
  }

  const totalPages = Math.ceil(count / GAMES_PER_PAGE);
  return { games, totalPages, t, error: null };
}

// جلب الإعدادات والروابط الاجتماعية
async function fetchSettings() {
    try {
        const { data: settingsData, error: settingsError } = await supabase
            .from('site_settings')
            .select('social_links')
            .eq('id', 1)
            .single();
        if(settingsError && settingsError.code !== 'PGRST116') { // تجاهل خطأ "عدم وجود صفوف" إذا كان الجدول فارغاً
           throw settingsError;
        }
        return settingsData?.social_links || { reddit: '', telegram: '', youtube: '', twitter: '', email: '' };
    } catch (error) {
         console.error("Error fetching settings: ", error.message);
        return { reddit: '', telegram: '', youtube: '', twitter: '', email: '' }; // إرجاع قيم افتراضية عند الفشل
    }
}

// جلب كل التصنيفات للفلتر
async function fetchAllCategories() {
     try {
        const { data: categoriesData, error } = await supabase
            .from('games')
            .select('categories');
        if(error) throw error;
        const allCategories = [
            ...new Set((categoriesData || []).flatMap((game) => game.categories || [])),
        ].sort();
        return allCategories;
     } catch (error) {
        console.error("Error fetching categories: ", error.message);
        return [];
     }
}

// مكون الهيدر كـ "مكون عميل" منفصل ليتم تغليفه
function PageHeader({ lang, t, allCategories, searchParams }) {
  return <Header lang={lang} t={t} allCategories={allCategories} searchParams={searchParams} />
}

// --- المكون الرئيسي (مكون خادم) ---
export default async function Home({ searchParams }) {
  const lang = searchParams.lang || 'en';
  const page = parseInt(searchParams.page) || 1;
  
  // جلب البيانات بالتوازي لتحسين الأداء
  const [gameData, socialLinks, allCategories] = await Promise.all([
      fetchGames(searchParams),
      fetchSettings(),
      fetchAllCategories()
  ]);

  const { games, totalPages, t, error } = gameData;

  return (
    <main>
      {/* تم تغليف الهيدر بـ Suspense
        لأن الهيدر (مكون عميل) يستخدم useSearchParams
        وهذه الصفحة (مكون خادم) تقوم بعرضه
      */}
      <Suspense fallback={<header className="h-24 bg-black/30 backdrop-blur-md border-b border-purple-500/20"></header>}>
        <PageHeader lang={lang} t={t} allCategories={allCategories} searchParams={searchParams} />
      </Suspense>

      <div className="container mx-auto px-4 py-8">
        {error ? (
           <div className="col-span-full text-center text-red-400 py-12">
             Error loading games: {error.message}
           </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} t={t} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            {t.noGames}
          </div>
        )}

        {/* تم تمرير searchParams إلى Pagination
          لأنه أيضاً "مكون عميل" ويحتاج للوصول إليها
        */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          t={t}
          lang={lang}
          searchParams={searchParams} 
        />
      </div>
      
      <Footer socialLinks={socialLinks} />
    </main>
  );
}