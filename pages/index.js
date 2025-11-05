"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Gamepad2,
  ArrowLeft,
  Download,
  Laptop,
  Smartphone,
  ChevronDown,
  LayoutDashboard,
  AppWindow,
  Apple,
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Settings,
  Send,
  Youtube,
  Twitter,
  Mail,
  Star,
  Loader2,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';

// استيراد Supabase
import { supabase } from '../utils/supabaseClient'; // <-- المسار الصحيح
// استيراد UUID
import { v4 as uuidv4 } from 'uuid';

// ... (كود الترجمة Translations لا يتغير) ...
const translations = {
  en: {
    siteName: 'GameHub',
    search: 'Search games...',
    addGame: 'Add Game',
    dashboard: 'Dashboard',
    home: 'Home',
    noGames: 'No games found',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    gameName: 'Game Name',
    description: 'Description',
    category: 'Category',
    categories: 'Categories',
    addCategory: 'Add category (press Enter)',
    addCategoryBtn: 'Add Category',
    uploadImage: 'Upload Cover Image',
    uploadScreenshots: 'Upload Screenshots',
    screenshots: 'Screenshots',
    action: 'Action',
    adventure: 'Adventure',
    rpg: 'RPG',
    strategy: 'Strategy',
    sports: 'Sports',
    puzzle: 'Puzzle',
    back: 'Back to list',
    downloads: 'Downloads',
    windows: 'Windows',
    mac: 'Mac',
    linux: 'Linux',
    android: 'Android',
    downloadLinks: 'Download Links',
    windowsLink: 'Windows URL',
    macLink: 'Mac URL',
    linuxLink: 'Linux URL',
    androidLink: 'Android URL',
    submitSearch: 'Search',
    popular: 'Popular',
    new: 'New',
    tags: 'Tags',
    allCategories: 'All Categories',
    visits: 'Visits',
    relatedGames: 'Related Games',
    page: 'Page',
    of: 'of',
    first: 'First',
    last: 'Last',
    dashboardSearch: 'Search in dashboard...',
    siteSettings: 'Site Settings',
    redditLink: 'Reddit URL',
    telegramLink: 'Telegram URL',
    youtubeLink: 'YouTube URL',
    twitterLink: 'Twitter (X) URL',
    email: 'Email',
    saved: 'Saved!',
    rating: 'Rating',
    ratingCount: 'Rating Count',
    ratings: 'ratings',
    uploading: 'Uploading...',
    loadingGames: 'Loading games...',
    login: 'Login',
    logout: 'Logout',
    adminLogin: 'Admin Login',
    password: 'Password',
    loginError: 'Login failed. Check email or password.',
    loggingIn: 'Logging in...',
    supportedLanguages: 'Supported Languages',
    addLanguage: 'Add language (press Enter)',
    addLanguageBtn: 'Add Language',
  },
  ar: {
    siteName: 'GameHub',
    search: 'ابحث عن الألعاب...',
    addGame: 'إضافة لعبة',
    dashboard: 'لوحة التحكم',
    home: 'الرئيسية',
    noGames: 'لا توجد ألعاب',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    gameName: 'اسم اللعبة',
    description: 'الوصف',
    category: 'الفئة',
    categories: 'التصنيفات',
    addCategory: 'أضف تصنيف (اضغط Enter)',
    addCategoryBtn: 'إضافة تصنيف',
    uploadImage: 'رفع صورة الغلاف',
    uploadScreenshots: 'رفع لقطات شاشة',
    screenshots: 'لقطات الشاشة',
    action: 'أكشن',
    adventure: 'مغامرات',
    rpg: 'آر بي جي',
    strategy: 'استراتيجية',
    sports: 'رياضة',
    puzzle: 'ألغاز',
    back: 'العودة للقائمة',
    downloads: 'التحميلات',
    windows: 'ويندوز',
    mac: 'ماك',
    linux: 'لينكس',
    android: 'أندرويد',
    downloadLinks: 'روابط التحميل',
    windowsLink: 'رابط ويندوز',
    macLink: 'رابط ماك',
    linuxLink: 'رابط لينكس',
    androidLink: 'رابط أندرويد',
    submitSearch: 'بحث',
    popular: 'الأكثر شعبية',
    new: 'الأحدث',
    tags: 'التصنيفات',
    allCategories: 'كل التصنيفات',
    visits: 'الزيارات',
    relatedGames: 'ألعاب مشابهة',
    page: 'صفحة',
    of: 'من',
    first: 'الأولى',
    last: 'الأخيرة',
    dashboardSearch: 'ابحث في لوحة التحكم...',
    siteSettings: 'إعدادات الموقع',
    redditLink: 'رابط Reddit',
    telegramLink: 'رابط Telegram',
    youtubeLink: 'رابط YouTube',
    twitterLink: 'رابط Twitter (X)',
    email: 'البريد الإلكتروني',
    saved: 'تم الحفظ!',
    rating: 'التقييم',
    ratingCount: 'عدد التقييمات',
    ratings: 'تقييمات',
    uploading: 'جاري الرفع...',
    loadingGames: 'جاري تحميل الألعاب...',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    adminLogin: 'دخول المدير',
    password: 'كلمة المرور',
    loginError: 'فشل الدخول. تأكد من البريد أو كلمة المرور.',
    loggingIn: 'جاري الدخول...',
    supportedLanguages: 'اللغات المدعومة',
    addLanguage: 'أضف لغة (اضغط Enter)',
    addLanguageBtn: 'إضافة لغة',
  },
  de: {
    siteName: 'SpielHub',
    search: 'Spiele suchen...',
    addGame: 'Spiel hinzufügen',
    dashboard: 'Dashboard',
    home: 'Startseite',
    noGames: 'Keine Spiele gefunden',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    gameName: 'Spielname',
    description: 'Beschreibung',
    category: 'Kategorie',
    categories: 'Kategorien',
    addCategory: 'Kategorie hinzufügen (Enter)',
    addCategoryBtn: 'Kategorie hinzufügen',
    uploadImage: 'Coverbild hochladen',
    uploadScreenshots: 'Screenshots hochladen',
    screenshots: 'Screenshots',
    action: 'Action',
    adventure: 'Abenteuer',
    rpg: 'RPG',
    strategy: 'Strategie',
    sports: 'Sport',
    puzzle: 'Puzzle',
    back: 'Zurück zur Liste',
    downloads: 'Downloads',
    windows: 'Windows',
    mac: 'Mac',
    linux: 'Linux',
    android: 'Android',
    downloadLinks: 'Download-Links',
    windowsLink: 'Windows-URL',
    macLink: 'Mac-URL',
    linuxLink: 'Linux-URL',
    androidLink: 'Android-URL',
    submitSearch: 'Suchen',
    popular: 'Beliebt',
    new: 'Neu',
    tags: 'Tags',
    allCategories: 'Alle Kategorien',
    visits: 'Besuche',
    relatedGames: 'Ähnliche Spiele',
    page: 'Seite',
    of: 'von',
    first: 'Erste',
    last: 'Letzte',
    dashboardSearch: 'In Dashboard suchen...',
    siteSettings: 'Site-Einstellungen',
    redditLink: 'Reddit-URL',
    telegramLink: 'Telegram-URL',
    youtubeLink: 'YouTube-URL',
    twitterLink: 'Twitter (X)-URL',
    email: 'Email',
    saved: 'Gespeichert!',
    rating: 'Bewertung',
    ratingCount: 'Anzahl Bewertungen',
    ratings: 'Bewertungen',
    uploading: 'Lädt hoch...',
    loadingGames: 'Lade Spiele...',
    login: 'Anmelden',
    logout: 'Abmelden',
    adminLogin: 'Admin-Anmeldung',
    password: 'Passwort',
    loginError: 'Anmeldung fehlgeschlagen. E-Mail oder Passwort prüfen.',
    loggingIn: 'Anmelden...',
    supportedLanguages: 'Unterstützte Sprachen',
    addLanguage: 'Sprache hinzufügen (Enter)',
    addLanguageBtn: 'Sprache hinzufügen',
  },
};
// ... (أيقونة Reddit و Pagination لا يتغير) ...
// <<< START SVG Icon for Reddit >>>
const RedditIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="currentColor"
    >
      R
    </text>
  </svg>
);
// <<< END SVG Icon for Reddit >>>

const GAMES_PER_PAGE = 20;

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, t, isRTL }) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Max 5 page number buttons
    const delta = 2; // Show 2 pages before and 2 after current

    if (totalPages <= maxPagesToShow + 2) {
      // If 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Ellipsis after first
      if (currentPage > delta + 2) {
        pages.push('...');
      }

      // Pages around current
      let start = Math.max(2, currentPage - delta);
      let end = Math.min(totalPages - 1, currentPage + delta);

      if (currentPage <= delta + 1) {
        end = 1 + maxPagesToShow - 1;
      }

      if (currentPage >= totalPages - delta) {
        start = totalPages - maxPagesToShow + 2;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Ellipsis before last
      if (currentPage < totalPages - delta - 1) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap mt-8">
      {/* Page X of Y */}
      <span className="text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2 text-sm font-semibold">
        {t.page} {currentPage} {t.of} {totalPages}
      </span>

      {/* First Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title={t.first}
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronsLeft className="w-5 h-5" />
      </button>

      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title={t.back}
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((num, index) =>
        num === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              currentPage === num
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-white hover:bg-purple-600'
            }`}
          >
            {num}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title={t.new} // "New" doesn't make sense, but "Next" isn't in translations. Re-using "back" logic is bad. Let's add a "next" translation.
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Last Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title={t.last}
        className="px-3 py-2 bg-gray-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
      >
        <ChevronsRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

// --- 🔐 مكون تسجيل الدخول 🔐 ---
const LoginModal = ({ t, isRTL, onLogin, onCancel, loginError, isLoggingIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="bg-gray-800 border border-purple-500/30 rounded-xl p-8 w-full max-w-md"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {t.adminLogin}
        </h2>
        {loginError && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">
            {loginError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-300 text-sm">
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                         placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-300 text-sm">
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                         placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoggingIn}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all
                         disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all
                         disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.loggingIn}
                </>
              ) : (
                t.login
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// --- 🔐 نهاية مكون تسجيل الدخول 🔐 ---

export default function Home() {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const [sortBy, setSortBy] = useState('new');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');

  const [socialLinks, setSocialLinks] = useState({
    reddit: '',
    telegram: '',
    youtube: '',
    twitter: '',
    email: '',
  });
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);

  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(null);

  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // --- 🔐 حالة المصادقة (Auth) 🔐 ---
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // <-- للتأكد من فحص الجلسة أولاً
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // --- 🔐 نهاية حالة المصادقة 🔐 ---

  const [isClient, setIsClient] = useState(false);

  // --- ⭐️ بداية إصلاح زر الرجوع (Refs) ⭐️ ---
  const allGamesRef = useRef(allGames);
  useEffect(() => {
    allGamesRef.current = allGames;
  }, [allGames]);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);
  // --- ⭐️ نهاية إصلاح زر الرجوع (Refs) ⭐️ ---

  const [imageFile, setImageFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryDropdownRef]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, categoryFilter, searchResults]);

  // --- ⭐️ بداية إصلاح زر الرجوع (المستمع) ⭐️ ---
  useEffect(() => {
    // 1. تعيين الحالة الأولية عند تحميل الصفحة
    window.history.replaceState({ view: 'home', category: '' }, '');

    // 2. مستمع حدث الرجوع
    const handlePopState = (event) => {
      const state = event.state;

      if (!state) {
        // كحل احتياطي، العودة للرئيسية
        setShowLogin(false);
        setSelectedGame(null);
        setShowDashboard(false);
        setCategoryFilter('');
        return;
      }

      // التبديل بناءً على الحالة التي نعود إليها
      switch (state.view) {
        case 'game':
          const gameToView = allGamesRef.current.find(
            (g) => g.id === state.gameId
          );
          if (gameToView) {
            setSelectedGame(gameToView);
            setShowDashboard(false);
            setShowLogin(false);
          } else {
            setSelectedGame(null);
            setShowDashboard(false);
            setShowLogin(false);
            setCategoryFilter('');
          }
          break;
        case 'dashboard':
          if (userRef.current) {
            setSelectedGame(null);
            setShowDashboard(true);
            setShowLogin(false);
          } else {
            setSelectedGame(null);
            setShowDashboard(false);
            setShowLogin(false);
            setCategoryFilter('');
            window.history.replaceState({ view: 'home', category: '' }, '');
          }
          break;
        case 'login':
          setSelectedGame(null);
          setShowDashboard(false);
          setShowLogin(true);
          break;
        case 'home':
        default:
          setSelectedGame(null);
          setShowDashboard(false);
          setShowLogin(false);
          setCategoryFilter(state.category || '');
          break;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // <-- المصفوفة الفارغة هامة جداً لضمان تشغيل هذا مرة واحدة فقط
  // --- ⭐️ نهاية إصلاح زر الرجوع (المستمع) ⭐️ ---


  // --- 🔐 جلب البيانات وفحص المصادقة ---
  useEffect(() => {
    setIsClient(true);
    fetchGamesAndSettings();

    // فحص جلسة المستخدم
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    // الاستماع لتغيرات المصادقة (تسجيل دخول/خروج)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []); // <-- المصفوفة الفارغة تضمن تشغيله مرة واحدة

  async function fetchGamesAndSettings() {
    setLoading(true);
    try {
      // 1. جلب الألعاب
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (gamesError) throw gamesError;
      setGames(gamesData || []);
      setAllGames(gamesData || []); // <-- هذا سيقوم بتشغيل الـ Ref
    } catch (error) {
      console.error('Error fetching games:', error.message);
    }

    try {
      // 2. جلب الإعدادات
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('social_links')
        .eq('id', 1)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        // PGRST116 = "النتيجة لا تحتوي على أي صفوف" (وهذا طبيعي إذا لم يتم إدخال الإعدادات بعد)
        throw settingsError;
      }
      
      if (settingsData) {
        setSocialLinks(settingsData.social_links);
      }
    } catch (error) {
      console.error('Error fetching settings:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // --- 🔐 دوال المصادقة (Auth) 🔐 ---
  const handleLogin = async (email, password) => {
    setIsLoggingIn(true);
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setLoginError(t.loginError);
    } else {
      // سيتم تحديث 'user' بواسطة onAuthStateChange
      setShowLogin(false);
      setShowDashboard(true); // <-- فتح لوحة التحكم بعد نجاح الدخول
      // ⭐️ إصلاح الهيستوري: استبدال 'login' بـ 'dashboard'
      window.history.replaceState({ view: 'dashboard' }, '');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDashboard(false); // <-- إخفاء لوحة التحكم عند الخروج
    // ⭐️ إصلاح الهيستوري: إضافة حالة 'home'
    window.history.pushState({ view: 'home', category: '' }, '');
  };

  const handleDashboardClick = () => {
    if (user) {
      setShowDashboard(true);
      setSelectedGame(null);
      // ⭐️ إصلاح الهيستوري: إضافة حالة 'dashboard'
      window.history.pushState({ view: 'dashboard' }, '');
    } else {
      setLoginError(null);
      setShowLogin(true); // <-- إظهار نافذة تسجيل الدخول
      // ⭐️ إصلاح الهيستوري: إضافة حالة 'login'
      window.history.pushState({ view: 'login' }, '');
    }
  };
  // --- 🔐 نهاية دوال المصادقة 🔐 ---

  // ... (بقية الدوال: handleImageUpload, handleScreenshotsUpload, etc.) ...
  // --- SUPABASE: تعديل دالة رفع صورة الغلاف ---
  const handleImageUpload = (e, target = 'new') => {
    const file = e.target.files[0];
    if (file) {
      if (target === 'new') {
        setImageFile(file); // <-- تخزين كائن الملف مباشرة
        // تحديث المعاينة
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewGame({ ...newGame, image: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        // (من الأفضل التعامل مع تعديل الملفات بشكل منفصل، لكن سنبقيها للمعاينة)
        // هذا الكود سيتجاهل تعديل الملف في دالة handleUpdateGame
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditingGame({ ...editingGame, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // --- SUPABASE: تعديل دالة رفع لقطات الشاشة ---
  const handleScreenshotsUpload = (e, target = 'new') => {
    const files = Array.from(e.target.files);
    if (target === 'new') {
      setScreenshotFiles(files); // <-- تخزين كائنات الملفات مباشرة
      // تحديث المعاينة
      const previewUrls = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewUrls.push(reader.result);
          if (previewUrls.length === files.length) {
            setNewGame({ ...newGame, screenshots: previewUrls });
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      // (تعديل الملفات معقد، سنتجاهله في دالة التحديث الآن)
    }
  };

  const removeScreenshot = (index, target = 'new') => {
    if (target === 'new') {
      const updatedFiles = screenshotFiles.filter((_, i) => i !== index);
      setScreenshotFiles(updatedFiles);
      const updatedPreviews = newGame.screenshots.filter(
        (_, i) => i !== index
      );
      setNewGame({ ...newGame, screenshots: updatedPreviews });
    } else {
      // (يتطلب منطق تعديل/حذف من Supabase Storage)
    }
  };

  const t = translations[lang];
  const isRTL = lang === 'ar';

  // --- 🌍 بداية منطق اللغات 🌍 ---
  const handleAddLanguage = (target = 'new') => {
    const language = (target === 'new' ? newLanguage : editLanguage)
      .trim()
      .toLowerCase();
    if (language) {
      if (target === 'new' && !newGame.languages.includes(language)) {
        setNewGame({
          ...newGame,
          languages: [...newGame.languages, language],
        });
        setNewLanguage('');
      } else if (
        target === 'edit' &&
        !editingGame.languages.includes(language)
      ) {
        setEditingGame({
          ...editingGame,
          languages: [...editingGame.languages, language],
        });
        setEditLanguage('');
      }
    }
  };

  const handleRemoveLanguage = (langToRemove, target = 'new') => {
    if (target === 'new') {
      setNewGame({
        ...newGame,
        languages: newGame.languages.filter((l) => l !== langToRemove),
      });
    } else {
      setEditingGame({
        ...editingGame,
        languages: editingGame.languages.filter((l) => l !== langToRemove),
      });
    }
  };
  // --- 🌍 نهاية منطق اللغات 🌍 ---

  // --- Start Category Logic ---
  const handleAddCategory = (target = 'new') => {
    const category = (target === 'new' ? newCategory : editCategory)
      .trim()
      .toLowerCase();
    if (category) {
      if (target === 'new' && !newGame.categories.includes(category)) {
        setNewGame({ ...newGame, categories: [...newGame.categories, category] });
        setNewCategory('');
      } else if (
        target === 'edit' &&
        !editingGame.categories.includes(category)
      ) {
        setEditingGame({
          ...editingGame,
          categories: [...editingGame.categories, category],
        });
        setEditCategory('');
      }
    }
  };

  const handleRemoveCategory = (catToRemove, target = 'new') => {
    if (target === 'new') {
      setNewGame({
        ...newGame,
        categories: newGame.categories.filter((c) => c !== catToRemove),
      });
    } else {
      setEditingGame({
        ...editingGame,
        categories: editingGame.categories.filter((c) => c !== catToRemove),
      });
    }
  };

  // --- SUPABASE: تعديل مصدر التصنيفات ---
  const allCategories = [
    ...new Set(allGames.flatMap((game) => game.categories || [])), // <-- استخدام allGames
  ].sort();
  // --- End Category Logic ---

  // --- SUPABASE: تعديل منطق البحث ---
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const matchingGames = allGames.filter(
        // <-- استخدام allGames
        (game) =>
          game.name.toLowerCase().includes(query.toLowerCase()) ||
          game.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matchingGames);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults(null);
      setGames(allGames); // <-- إظهار كل الألعاب
    } else {
      const matchingGames = allGames.filter(
        (game) =>
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(matchingGames);
      setGames(matchingGames); // <-- إظهار نتائج البحث
    }
    setSuggestions([]);
    setShowDashboard(false);
    setSelectedGame(null);
    // ⭐️ إصلاح الهيستوري: إضافة حالة 'home'
    window.history.pushState({ view: 'home', category: '' }, '');
  };

  const handleSuggestionClick = (game) => {
    setSearchQuery(game.name);
    setSearchResults([game]);
    setGames([game]); // <-- إظهار اللعبة المختارة
    setSuggestions([]);
    setShowDashboard(false);
    setSelectedGame(null);
    // ⭐️ إصلاح الهيستوري: إضافة حالة 'home'
    window.history.pushState({ view: 'home', category: '' }, '');
  };
  // --- End Search Logic ---

  // --- SUPABASE: تعديل منطق الفرز ---
  // (ملاحظة: الفرز الآن يحدث على الواجهة الأمامية، للأداء الأفضل يجب أن يتم في Supabase query)
  const filteredAndSortedGames = (searchResults !== null ? searchResults : games)
    .filter((game) => {
      if (categoryFilter === '') return true;
      return (game.categories || []).includes(categoryFilter);
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.visits - a.visits;
      }
      return new Date(b.created_at) - new Date(a.created_at); // <-- استخدام created_at
    });

  const totalPages = Math.ceil(
    filteredAndSortedGames.length / GAMES_PER_PAGE
  );

  const gamesToShow = filteredAndSortedGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );
  // --- End Game List Logic ---

  // --- SUPABASE: دالة مساعدة لرفع الملفات ---
  async function uploadFile(file, bucket) {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const filePath = `public/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  // --- ⭐️ دالة مساعدة جديدة لحذف الملفات ⭐️ ---
  const getPathFromUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      // المسار هو كل شيء بعد اسم الدلو
      // .../public/game-images/[public/image.png]
      const parts = urlObj.pathname.split('/game-images/');
      return parts[1] || null;
    } catch (e) {
      console.error('Invalid URL:', url, e);
      return null;
    }
  };


  // --- SUPABASE: تعديل دالة إضافة لعبة ---
  const [editingGame, setEditingGame] = useState(null);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    categories: [],
    languages: [], // <-- 🌍 جديد
    image: '',
    screenshots: [],
    links: { windows: '', mac: '', linux: '', android: '' },
    visits: '',
    rating: '',
    ratingCount: '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [newLanguage, setNewLanguage] = useState(''); // <-- 🌍 جديد
  const [editLanguage, setEditLanguage] = useState(''); // <-- 🌍 جديد

  const handleAddGame = async () => {
    if (!newGame.name || !newGame.description) {
      alert('Please fill in game name and description.'); // (يفضل استخدام modal)
      return;
    }

    setIsUploading(true);

    try {
      // 1. رفع صورة الغلاف
      const imageUrl = await uploadFile(imageFile, 'game-images');
      if (!imageUrl && imageFile) {
        throw new Error('Failed to upload cover image.');
      }

      // 2. رفع لقطات الشاشة
      const screenshotUrls = await Promise.all(
        screenshotFiles.map((file) => uploadFile(file, 'game-images'))
      );

      // 3. تجهيز بيانات اللعبة
      const gameData = {
        name: newGame.name,
        description: newGame.description,
        categories: newGame.categories,
        languages: newGame.languages, // <-- 🌍 جديد
        links: newGame.links,
        visits: Number(newGame.visits) || 0,
        rating: Number(newGame.rating) || 0,
        rating_count: Number(newGame.ratingCount) || 0, // <-- ⭐️ تم الإصلاح
        image: imageUrl,
        screenshots: screenshotUrls.filter((url) => url !== null),
      };

      // 4. إدراج البيانات في Supabase
      const { data: insertedGame, error } = await supabase
        .from('games')
        .insert(gameData)
        .select() // <-- طلب إرجاع الصف المُضاف
        .single();

      if (error) throw error;

      // 5. تحديث الحالة المحلية
      setGames([insertedGame, ...games]);
      setAllGames([insertedGame, ...allGames]);

      // 6. إعادة تعيين النموذج
      setNewGame({
        name: '',
        description: '',
        categories: [],
        languages: [], // <-- 🌍 جديد
        image: '',
        screenshots: [],
        links: { windows: '', mac: '', linux: '', android: '' },
        visits: '',
        rating: '',
        ratingCount: '',
      });
      setImageFile(null);
      setScreenshotFiles([]);
      setNewCategory('');
      setNewLanguage(''); // <-- 🌍 جديد
    } catch (error) {
      console.error('Error adding game:', error.message);
      alert('Failed to add game: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // --- SUPABASE: تعديل دالة تحديث لعبة ---
  // (ملاحظة: هذا التحديث مبسط ولا يعالج تغيير الصور)
  const handleUpdateGame = async () => {
    const updatedGame = {
      name: editingGame.name,
      description: editingGame.description,
      categories: editingGame.categories,
      languages: editingGame.languages, // <-- 🌍 جديد
      links: editingGame.links,
      visits: Number(editingGame.visits) || 0,
      rating: Number(editingGame.rating) || 0,
      rating_count: Number(editingGame.rating_count) || 0, // <-- ⭐️ تم الإصلاح
      // (تعديل الصور يتطلب منطقاً إضافياً)
    };

    const { data: returnedGame, error } = await supabase
      .from('games')
      .update(updatedGame)
      .eq('id', editingGame.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating game:', error.message);
      return;
    }

    setGames(games.map((g) => (g.id === editingGame.id ? returnedGame : g)));
    setAllGames(
      allGames.map((g) => (g.id === editingGame.id ? returnedGame : g))
    );
    setEditingGame(null);
    setEditCategory('');
    setEditLanguage(''); // <-- 🌍 جديد
  };

  // --- ⭐️ SUPABASE: دالة حذف اللعبة (مُعدلة لحذف الملفات) ⭐️ ---
  const handleDeleteGame = async (game) => {
    // 1. جمع كل مسارات الملفات
    const pathsToDelete = [];
    
    const imagePath = getPathFromUrl(game.image);
    if (imagePath) {
      pathsToDelete.push(imagePath);
    }

    if (game.screenshots && game.screenshots.length > 0) {
      game.screenshots.forEach(url => {
        const screenshotPath = getPathFromUrl(url);
        if (screenshotPath) {
          pathsToDelete.push(screenshotPath);
        }
      });
    }

    // 2. حذف الملفات من Storage
    if (pathsToDelete.length > 0) {
      const { data: fileData, error: fileError } = await supabase.storage
        .from('game-images')
        .remove(pathsToDelete);
      
      if (fileError) {
        console.error('Error deleting storage files:', fileError.message);
        // سنستمر لحذف سجل قاعدة البيانات حتى لو فشل حذف الملفات
        // يمكنك تغيير هذا السلوك إذا أردت
      } else {
        console.log('Deleted files:', fileData);
      }
    }

    // 3. حذف السجل من قاعدة البيانات
    const { error: dbError } = await supabase.from('games').delete().eq('id', game.id);

    if (dbError) {
      console.error('Error deleting game record:', dbError.message);
      alert('Failed to delete game record: ' + dbError.message); // إبلاغ المستخدم
      return;
    }

    // 4. تحديث الحالة المحلية
    setGames(games.filter((g) => g.id !== game.id));
    setAllGames(allGames.filter((g) => g.id !== game.id));
  };


  // --- SUPABASE: تعديل دالة حفظ الإعدادات ---
  const handleSaveSettings = async () => {
    const { error } = await supabase
      .from('site_settings')
      .update({ social_links: socialLinks })
      .eq('id', 1); // تحديث الصف ذي id = 1

    if (error) {
      console.error('Error saving settings:', error.message);
    } else {
      setShowSettingsSaved(true);
      setTimeout(() => setShowSettingsSaved(false), 2000);
    }
  };

  // --- SUPABASE: تعديل دالة تقييم اللعبة ---
  const handleRatingClick = async (rate) => {
    if (userRating || !selectedGame) return;
    
    // ⭐️ تم الإصلاح (يجب استخدام rating_count من قاعدة البيانات)
    const currentRatingCount = selectedGame.rating_count || 0;
    const currentRating = selectedGame.rating || 0;

    const newTotalRating =
      currentRating * currentRatingCount + rate;
    const newRatingCount = currentRatingCount + 1;
    const newAverage = newTotalRating / newRatingCount;

    setUserRating(rate); // تحديث الواجهة فوراً

    // تحديث الحالة المحلية
    const updatedGame = {
      ...selectedGame,
      rating: newAverage,
      rating_count: newRatingCount, // ⭐️ تم الإصلاح
    };
    setSelectedGame(updatedGame);
    setGames(games.map((g) => (g.id === selectedGame.id ? updatedGame : g)));
    setAllGames(
      allGames.map((g) => (g.id === selectedGame.id ? updatedGame : g))
    );

    // إرسال التحديث إلى Supabase
    const { error } = await supabase
      .from('games')
      .update({ rating: newAverage, rating_count: newRatingCount }) // <-- ⭐️ تم الإصلاح
      .eq('id', selectedGame.id);

    if (error) {
      console.error('Error updating rating:', error.message);
      // (يمكن التراجع عن التغيير المحلي هنا إذا فشل التحديث)
    }
  };

  // --- ⭐️ إصلاح الهيستوري: تعديل دوال التنقل ---

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setShowDashboard(false);
    setSearchResults(null);
    setSearchQuery('');
    setUserRating(null);
    setHoverRating(0);
    window.history.pushState({ view: 'game', gameId: game.id }, '');
  };

  const handleGoBack = () => {
    // هذه الدالة الآن تشغل مستمع 'popstate'
    window.history.back();
  };

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    setIsCategoryDropdownOpen(false);
    setSearchResults(null);
    setSearchQuery('');
    setSelectedGame(null);
    window.history.pushState({ view: 'home', category: category }, '');
    // إرجاع الألعاب إلى القائمة الكاملة عند الفلترة
    setGames(allGames);
  };
  
  // (بقية الدوال المساعدة لا تتغير)

  const getRelatedGames = () => {
    if (!selectedGame) return [];
    return allGames // <-- استخدام allGames
      .filter(
        (g) =>
          g.id !== selectedGame.id &&
          (g.categories || []).some((cat) =>
            (selectedGame.categories || []).includes(cat)
          )
      )
      .slice(0, 5);
  };

  const filteredDashboardGames = allGames.filter(
    // <-- استخدام allGames
    (game) =>
      game.name.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(dashboardSearchQuery.toLowerCase())
  );

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

  const formatEmailUrl = (email) => {
    if (!email) return '#';
    if (email.startsWith('mailto:')) {
      return email;
    }
    return `mailto:${email}`;
  };

  // --- شاشة التحميل ---
  // (تم تعديلها لتشمل loadingAuth)
  if (!isClient || loadingAuth || (loading && games.length === 0 && !user)) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 ${
          isRTL ? 'rtl' : 'ltr'
        } flex flex-col items-center justify-center text-white`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin mb-4" />
        <h1 className="text-2xl font-semibold">{t.loadingGames}</h1>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* --- 🔐 نافذة تسجيل الدخول 🔐 --- */}
      {showLogin && !user && (
        <LoginModal
          t={t}
          isRTL={isRTL}
          onLogin={handleLogin}
          onCancel={() => {
            // ⭐️ إصلاح الهيستوري: استخدام window.history.back()
            window.history.back();
          }}
          loginError={loginError}
          isLoggingIn={isLoggingIn}
        />
      )}

      {/* --- Header (معدل) --- */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={() => {
                setShowDashboard(false);
                setSelectedGame(null);
                setSearchResults(null);
                setSearchQuery('');
                setSuggestions([]);
                setCurrentPage(1);
                setCategoryFilter(''); // ⭐️ إصلاح الهيستوري: تنظيف الفلتر
                // ⭐️ إصلاح الهيستوري: إضافة حالة 'home'
                window.history.pushState({ view: 'home', category: '' }, '');
                setGames(allGames); // <-- إرجاع القائمة الكاملة
              }}
              className="flex items-center gap-3 order-1"
            >
              <Gamepad2 className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {t.siteName}
              </h1>
            </button>

            {/* --- 🔐 أزرار الدخول والخروج 🔐 --- */}
            <div className="flex items-center gap-2 order-2 md:order-4">
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className={`w-full bg-white/10 border border-purple-500/30 rounded-lg font-semibold transition-all
                           appearance-none cursor-pointer ${
                             isRTL ? 'pr-10 pl-4' : 'pl-4 pr-10'
                           } py-2 text-white
                           focus:outline-none focus:border-purple-400`}
                >
                  <option value="en" className="bg-gray-800 text-white">
                    EN
                  </option>
                  <option value="ar" className="bg-gray-800 text-white">
                    AR
                  </option>
                  <option value="de" className="bg-gray-800 text-white">
                    DE
                  </option>
                </select>
                <ChevronDown
                  className={`absolute top-2.5 ${
                    isRTL ? 'left-3' : 'right-3'
                  } w-5 h-5 text-gray-300 pointer-events-none`}
                />
              </div>

              {user ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    title={t.dashboard}
                    className="p-2 rounded-lg font-semibold transition-all bg-white/10 text-gray-300 hover:bg-purple-600 hover:text-white"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    title={t.logout}
                    className="p-2 rounded-lg font-semibold transition-all bg-white/10 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDashboardClick}
                  title={t.login}
                  className="p-2 rounded-lg font-semibold transition-all bg-white/10 text-gray-300 hover:bg-purple-600 hover:text-white"
                >
                  <LogIn className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* --- 🔐 نهاية أزرار الدخول والخروج 🔐 --- */}

            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full md:flex-1 md:max-w-md order-3 md:order-2"
            >
              <div className="relative">
                <Search
                  className={`absolute top-3 ${
                    isRTL ? 'right-3' : 'left-3'
                  } w-5 h-5 text-gray-400`}
                />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                    isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  } py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400`}
                />

                {suggestions.length > 0 && (
                  <div
                    className={`absolute top-full mt-2 w-full bg-gray-800 border border-purple-500/30 rounded-lg z-20 shadow-lg max-h-60 overflow-y-auto`}
                  >
                    {suggestions.map((game) => (
                      <div
                        key={game.id}
                        onClick={() => handleSuggestionClick(game)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-purple-700"
                      >
                        <img
                          src={
                            game.image ||
                            'https://placehold.co/100x100/4a0e71/ffffff?text=?'
                          }
                          alt={game.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <span className="text-white">{game.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                title={t.submitSearch}
                className="absolute top-1/2 -translate-y-1/2 p-2 rounded-lg font-semibold transition-all bg-purple-600 text-white hover:bg-purple-700"
                style={isRTL ? { left: '8px' } : { right: '8px' }}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {!showDashboard && !selectedGame && (
              <div
                ref={categoryDropdownRef}
                className="relative flex items-center gap-2 md:gap-4 w-full md:w-auto order-4 md:order-3 justify-center md:justify-start"
              >
                <button
                  onClick={() => {
                    setSortBy('popular');
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === 'popular'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {t.popular}
                </button>
                <button
                  onClick={() => {
                    setSortBy('new');
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === 'new'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {t.new}
                </button>

                <div className="relative">
                  <button
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
                    className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold transition-all text-gray-300 hover:bg-white/20"
                  >
                    <span>
                      {t.tags}
                      {categoryFilter && `: ${categoryFilter}`}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isCategoryDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isCategoryDropdownOpen && (
                    <div
                      className={`absolute ${
                        isRTL ? 'left-0' : 'right-0'
                      } top-full mt-4 w-[90vw] md:w-[40rem] bg-gray-800 border border-purple-500/30 rounded-lg z-20 shadow-lg p-4`}
                    >
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        <button
                          onClick={() => handleCategoryClick('')}
                          className={`w-full text-center px-3 py-2 text-white hover:bg-purple-700 rounded-md transition-all ${
                            categoryFilter === '' ? 'bg-purple-600' : ''
                          }`}
                        >
                          {t.allCategories}
                        </button>
                        {allCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`w-full text-center px-3 py-2 text-white hover:bg-purple-700 rounded-md transition-all ${
                              categoryFilter === category
                                ? 'bg-purple-600'
                                : ''
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- Main Content (معدل) --- */}
      <main className="container mx-auto px-4 py-8">
        {!showDashboard && !selectedGame ? (
          /* Home View - Grid (لا يتغير) */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gamesToShow.length > 0 ? (
                gamesToShow.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://placehold.co/400x300/4a0e71/ffffff?text=Error';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <h3 className="text-xl font-bold text-white truncate">
                          {game.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {game.links?.windows && (
                            <AppWindow
                              className="w-4 h-4 text-blue-300"
                              title={t.windows}
                            />
                          )}
                          {game.links?.mac && (
                            <Apple
                              className="w-4 h-4 text-gray-300"
                              title={t.mac}
                            />
                          )}
                          {game.links?.linux && (
                            <Bot
                              className="w-4 h-4 text-yellow-300"
                              title={t.linux}
                            />
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
                        {/* ⭐️ تم الإصلاح */}
                        <span>({game.rating_count || 0})</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  {t.noGames}
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              t={t}
              isRTL={isRTL}
            />
          </>
        ) : !showDashboard && selectedGame ? (
          /* 🌍 Game Detail View (معدل لإظهار اللغات) 🌍 */
          <div className="text-white">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-all mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.back}</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <img
                  src={
                    selectedGame.image ||
                    'https://placehold.co/400x600/4a0e71/ffffff?text=No+Image'
                  }
                  alt={selectedGame.name}
                  className="w-full h-auto object-cover rounded-xl shadow-lg border-2 border-purple-500/30"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/400x600/4a0e71/ffffff?text=Error';
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {selectedGame.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(selectedGame.categories || []).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="inline-block px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm hover:bg-purple-600 hover:text-white transition-all"
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* --- 🌍 بداية قسم اللغات 🌍 --- */}
                {selectedGame.languages &&
                  selectedGame.languages.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {t.supportedLanguages}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedGame.languages || []).map((lang) => (
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
                {/* --- 🌍 نهاية قسم اللغات 🌍 --- */}

                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <Eye className="w-5 h-5" />
                  <span>{selectedGame.visits}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rate = i + 1;
                      return (
                        <Star
                          key={i}
                          className={`w-6 h-6 transition-colors ${
                            rate <=
                            (hoverRating ||
                              Math.round(userRating || selectedGame.rating))
                              ? 'text-yellow-400'
                              : 'text-gray-600'
                          } ${
                            !userRating
                              ? 'cursor-pointer hover:text-yellow-300'
                              : 'cursor-default'
                          }`}
                          fill="currentColor"
                          onMouseEnter={() =>
                            !userRating && setHoverRating(rate)
                          }
                          onMouseLeave={() => !userRating && setHoverRating(0)}
                          onClick={() => handleRatingClick(rate)}
                        />
                      );
                    })}
                  </div>
                  <div className="text-gray-400 text-sm">
                    <span>{selectedGame.rating.toFixed(1)} / 5</span>
                    <span className="mx-2">|</span>
                    <span>
                      {/* ⭐️ تم الإصلاح */}
                      ({selectedGame.rating_count || 0} {t.ratings})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t.description}
              </h3>
              <p className="text-gray-300 text-lg whitespace-pre-wrap">
                {selectedGame.description}
              </p>
            </div>

            {selectedGame.screenshots &&
              selectedGame.screenshots.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t.screenshots}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGame.screenshots.map((ss, index) => (
                      <img
                        key={index}
                        src={ss}
                        alt={`${selectedGame.name} screenshot ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg border border-purple-500/20"
                      />
                    ))}
                  </div>
                </div>
              )}

            {(selectedGame.links?.windows ||
              selectedGame.links?.mac ||
              selectedGame.links?.linux ||
              selectedGame.links?.android) && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t.downloads}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedGame.links.windows && (
                    <a
                      href={formatWebUrl(selectedGame.links.windows)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                      <AppWindow className="w-6 h-6" />
                      <span className="font-semibold">{t.windows}</span>
                    </a>
                  )}
                  {selectedGame.links.mac && (
                    <a
                      href={formatWebUrl(selectedGame.links.mac)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                    >
                      <Apple className="w-6 h-6" />
                      <span className="font-semibold">{t.mac}</span>
                    </a>
                  )}
                  {selectedGame.links.linux && (
                    <a
                      href={formatWebUrl(selectedGame.links.linux)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                    >
                      <Bot className="w-6 h-6" />
                      <span className="font-semibold">{t.linux}</span>
                    </a>
                  )}
                  {selectedGame.links.android && (
                    <a
                      href={formatWebUrl(selectedGame.links.android)}
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

            {getRelatedGames().length > 0 && (
              <div className="mt-12 pt-8 border-t border-purple-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t.relatedGames}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getRelatedGames().map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleSelectGame(game)}
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'https://placehold.co/400x300/4a0e71/ffffff?text=Error';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <h3 className="text-xl font-bold text-white truncate">
                            {game.name}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {game.links?.windows && (
                              <AppWindow
                                className="w-4 h-4 text-blue-300"
                                title={t.windows}
                              />
                            )}
                            {game.links?.mac && (
                              <Apple
                                className="w-4 h-4 text-gray-300"
                                title={t.mac}
                              />
                            )}
                            {game.links?.linux && (
                              <Bot
                                className="w-4 h-4 text-yellow-300"
                                title={t.linux}
                              />
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
                           {/* ⭐️ تم الإصلاح */}
                          <span>({game.rating_count || 0})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 🌍 Dashboard View (معدل لإضافة اللغات) 🌍 */
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                {t.addGame}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.gameName}
                  </label>
                  <input
                    type="text"
                    placeholder={t.gameName}
                    value={newGame.name}
                    onChange={(e) =>
                      setNewGame({ ...newGame, name: e.target.value })
                    }
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.visits}
                  </label>
                  <input
                    type="text"
                    placeholder={t.visits}
                    value={newGame.visits}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        visits: e.target.value,
                      })
                    }
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.rating} (0-5)
                  </label>
                  <input
                    type="text"
                    placeholder={t.rating}
                    value={newGame.rating}
                    onChange={(e) =>
                      setNewGame({ ...newGame, rating: e.target.value })
                    }
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.ratingCount}
                  </label>
                  <input
                    type="text"
                    placeholder={t.ratingCount}
                    value={newGame.ratingCount}
                    onChange={(e) =>
                      setNewGame({ ...newGame, ratingCount: e.target.value })
                    }
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.categories}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newGame.categories.map((cat) => (
                      <span
                        key={cat}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs"
                      >
                        {cat}
                        <button
                          onClick={() => handleRemoveCategory(cat, 'new')}
                          className="text-purple-300 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t.addCategory}
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory('new');
                        }
                      }}
                      className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                        isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'
                      } py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400`}
                    />
                    <button
                      type="button"
                      title={t.addCategoryBtn}
                      onClick={() => handleAddCategory('new')}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? 'left-2' : 'right-2'
                      } p-1.5 text-gray-400 hover:text-white bg-purple-600/50 hover:bg-purple-600 rounded-md`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* --- 🌍 بداية قسم إضافة اللغات 🌍 --- */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.supportedLanguages}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newGame.languages.map((lang) => (
                      <span
                        key={lang}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-600/30 text-gray-300 rounded-full text-xs"
                      >
                        {lang}
                        <button
                          onClick={() => handleRemoveLanguage(lang, 'new')}
                          className="text-gray-300 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t.addLanguage}
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLanguage('new');
                        }
                      }}
                      className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                        isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'
                      } py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400`}
                    />
                    <button
                      type="button"
                      title={t.addLanguageBtn}
                      onClick={() => handleAddLanguage('new')}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? 'left-2' : 'right-2'
                      } p-1.5 text-gray-400 hover:text-white bg-purple-600/50 hover:bg-purple-600 rounded-md`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* --- 🌍 نهاية قسم إضافة اللغات 🌍 --- */}

                <textarea
                  rows="3"
                  placeholder={t.description}
                  value={newGame.description}
                  onChange={(e) =>
                    setNewGame({ ...newGame, description: e.target.value })
                  }
                  className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                  placeholder-gray-400 focus:outline-none focus:border-purple-400 md:col-span-2"
                />
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.uploadImage}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'new')}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                  />
                  {newGame.image && ( // <-- استخدام newGame.image للمعاينة
                    <img
                      src={newGame.image}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded-lg border border-purple-500/30"
                    />
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.uploadScreenshots}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleScreenshotsUpload(e, 'new')}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                  />
                </div>
              </div>
              {newGame.screenshots.length > 0 && ( // <-- استخدام newGame.screenshots للمعاينة
                <div className="mt-4">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.screenshots} ({newGame.screenshots.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {newGame.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-purple-500/30"
                        />
                        <button
                          onClick={() => removeScreenshot(index, 'new')}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0
                                                group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block mb-2 text-gray-300 text-sm">
                  {t.downloadLinks}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t.windowsLink}
                    value={newGame.links.windows}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        links: { ...newGame.links, windows: e.target.value },
                      })
                    }
                    className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                  <input
                    type="text"
                    placeholder={t.macLink}
                    value={newGame.links.mac}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        links: { ...newGame.links, mac: e.target.value },
                      })
                    }
                    className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                  <input
                    type="text"
                    placeholder={t.linuxLink}
                    value={newGame.links.linux}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        links: { ...newGame.links, linux: e.target.value },
                      })
                    }
                    className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                  <input
                    type="text"
                    placeholder={t.androidLink}
                    value={newGame.links.android}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        links: { ...newGame.links, android: e.target.value },
                      })
                    }
                    className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <button
                onClick={handleAddGame}
                disabled={isUploading} // <-- تعطيل الزر أثناء الرفع
                className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all
                                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.uploading}
                  </span>
                ) : (
                  t.addGame
                )}
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                {t.siteSettings}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t.telegramLink}
                  value={socialLinks.telegram}
                  onChange={(e) =>
                    setSocialLinks({
                      ...socialLinks,
                      telegram: e.target.value,
                    })
                  }
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  placeholder={t.redditLink}
                  value={socialLinks.reddit}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, reddit: e.target.value })
                  }
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  placeholder={t.youtubeLink}
                  value={socialLinks.youtube}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, youtube: e.target.value })
                  }
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  placeholder={t.twitterLink}
                  value={socialLinks.twitter}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, twitter: e.target.value })
                  }
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="email"
                  placeholder={t.email}
                  value={socialLinks.email}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, email: e.target.value })
                  }
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handleSaveSettings} // <-- دالة الحفظ المحدثة
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  {t.save}
                </button>
                {showSettingsSaved && (
                  <span className="text-green-400">{t.saved}</span>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-white">
                  {t.dashboard}
                </h2>
                <div className="relative flex-1 min-w-[250px]">
                  <Search
                    className={`absolute top-3 ${
                      isRTL ? 'right-3' : 'left-3'
                    } w-5 h-5 text-gray-400`}
                  />
                  <input
                    type="text"
                    placeholder={t.dashboardSearch}
                    value={dashboardSearchQuery}
                    onChange={(e) => setDashboardSearchQuery(e.target.value)}
                    className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                      isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                    } py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredDashboardGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-white/5 rounded-lg p-4 border border-purple-500/20"
                  >
                    {editingGame?.id === game.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-1">
                            <label className="block mb-2 text-gray-300 text-sm">
                              {t.gameName}
                            </label>
                            <input
                              type="text"
                              value={editingGame.name}
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  name: e.target.value,
                                })
                              }
                              className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                              placeholder={t.gameName}
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block mb-2 text-gray-300 text-sm">
                              {t.visits}
                            </label>
                            <input
                              type="text"
                              value={editingGame.visits}
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  visits: e.target.value,
                                })
                              }
                              className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                              placeholder={t.visits}
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block mb-2 text-gray-300 text-sm">
                              {t.rating} (0-5)
                            </label>
                            <input
                              type="text"
                              placeholder={t.rating}
                              value={editingGame.rating}
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  rating: e.target.value,
                                })
                              }
                              className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block mb-2 text-gray-300 text-sm">
                              {t.ratingCount}
                            </label>
                            <input
                              type="text"
                              placeholder={t.ratingCount}
                              // ⭐️ تم الإصلاح
                              value={editingGame.rating_count} 
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  rating_count: e.target.value, 
                                })
                              }
                              className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <textarea
                          rows="3"
                          value={editingGame.description}
                          onChange={(e) =>
                            setEditingGame({
                              ...editingGame,
                              description: e.target.value,
                            })
                          }
                          className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                          placeholder={t.description}
                        />

                        <div>
                          <label className="block mb-2 text-gray-300 text-sm">
                            {t.categories}
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(editingGame.categories || []).map((cat) => (
                              <span
                                key={cat}
                                className="flex items-center gap-1 px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs"
                              >
                                {cat}
                                <button
                                  onClick={() =>
                                    handleRemoveCategory(cat, 'edit')
                                  }
                                  className="text-purple-300 hover:text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={t.addCategory}
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCategory('edit');
                                }
                              }}
                              className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                                isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'
                              } py-2 text-white
                                            placeholder-gray-400 focus:outline-none focus:border-purple-400`}
                            />
                            <button
                              type="button"
                              title={t.addCategoryBtn}
                              onClick={() => handleAddCategory('edit')}
                              className={`absolute top-1/2 -translate-y-1/2 ${
                                isRTL ? 'left-2' : 'right-2'
                              } p-1.5 text-gray-400 hover:text-white bg-purple-600/50 hover:bg-purple-600 rounded-md`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* --- 🌍 بداية قسم تعديل اللغات 🌍 --- */}
                        <div>
                          <label className="block mb-2 text-gray-300 text-sm">
                            {t.supportedLanguages}
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(editingGame.languages || []).map((lang) => (
                              <span
                                key={lang}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-600/30 text-gray-300 rounded-full text-xs"
                              >
                                {lang}
                                <button
                                  onClick={() =>
                                    handleRemoveLanguage(lang, 'edit')
                                  }
                                  className="text-gray-300 hover:text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={t.addLanguage}
                              value={editLanguage}
                              onChange={(e) =>
                                setEditLanguage(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddLanguage('edit');
                                }
                              }}
                              className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                                isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'
                              } py-2 text-white
                                            placeholder-gray-400 focus:outline-none focus:border-purple-400`}
                            />
                            <button
                              type="button"
                              title={t.addLanguageBtn}
                              onClick={() => handleAddLanguage('edit')}
                              className={`absolute top-1/2 -translate-y-1/2 ${
                                isRTL ? 'left-2' : 'right-2'
                              } p-1.5 text-gray-400 hover:text-white bg-purple-600/50 hover:bg-purple-600 rounded-md`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {/* --- 🌍 نهاية قسم تعديل اللغات 🌍 --- */}

                        {/* (تعديل الصور هنا - تم تخطيه للتبسيط) */}

                        <div className="mt-4">
                          <label className="block mb-2 text-gray-300 text-sm">
                            {t.downloadLinks}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder={t.windowsLink}
                              value={editingGame.links?.windows || ''}
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  links: {
                                    ...editingGame.links,
                                    windows: e.target.value,
                                  },
                                })
                              }
                              className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                            <input
                              type="text"
                              placeholder={t.macLink}
                              value={editingGame.links?.mac || ''}
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  links: {
                                    ...editingGame.links,
                                    mac: e.target.value,
                                  },
                                })
                              }
                              className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                            <input
                              type="text"
                              placeholder={t.linuxLink}
                              value={editingGame.links?.linux || ''}
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  links: {
                                    ...editingGame.links,
                                    linux: e.target.value,
                                  },
                                })
                              }
                              className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                            <input
                              type="text"
                              placeholder={t.androidLink}
                              value={editingGame.links?.android || ''}
                              onChange={(e) =>
                                setEditingGame({
                                  ...editingGame,
                                  links: {
                                    ...editingGame.links,
                                    android: e.target.value,
                                  },
                                })
                              }
                              className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateGame}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                            {t.save}
                          </button>
                          <button
                            onClick={() => setEditingGame(null)}
                            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg
                                                  hover:bg-gray-700"
                          >
                            <X className="w-4 h-4" />
                            {t.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate">
                            {game.name}
                          </h3>
                          <p className="text-gray-300 text-sm truncate">
                            {game.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(game.categories || []).map((cat) => (
                              <span
                                key={cat}
                                className="inline-block mt-2 px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              // ⭐️ تم الإصلاح
                              setEditingGame({
                                ...game,
                                rating_count: game.rating_count || 0,
                              });
                            }}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            // ⭐️⭐️⭐️ تم الإصلاح: إرسال كائن اللعبة كاملاً
                            onClick={() => handleDeleteGame(game)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ... (Footer لا يتغير) ... */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-purple-500/20">
        <div className="flex items-center justify-center gap-6">
          {socialLinks.telegram && (
            <a
              href={formatWebUrl(socialLinks.telegram)}
              title="Telegram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Send className="w-6 h-6" />
            </a>
          )}
          {socialLinks.reddit && (
            <a
              href={formatWebUrl(socialLinks.reddit)}
              title="Reddit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <RedditIcon className="w-6 h-6" />
            </a>
          )}
          {socialLinks.youtube && (
            <a
              href={formatWebUrl(socialLinks.youtube)}
              title="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Youtube className="w-6 h-6" />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              href={formatWebUrl(socialLinks.twitter)}
              title="Twitter (X)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Twitter className="w-6 h-6" />
            </a>
          )}
          {socialLinks.email && (
            <a
              href={formatEmailUrl(socialLinks.email)}
              title="Email"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Mail className="w-6 h-6" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}