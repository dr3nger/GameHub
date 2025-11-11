"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  LogIn,
} from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { CustomGameIcon } from '@/components/Icons'; // سنقوم بإنشائه

// (ضع كود الترجمة المصغر هنا)
const translations = {
  en: { siteName: 'porn4games', login: 'Login', logout: 'Logout', /*...*/ },
  ar: { siteName: 'porn4games', login: 'تسجيل الدخول', logout: 'تسجيل الخروج', /*...*/ },
  de: { /*...*/ },
};

export default function Header({ lang, t, allCategories, searchParams }) {
  const router = useRouter();
  const [currentSearch, setCurrentSearch] = useState(searchParams.search || '');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const isRTL = lang === 'ar';

  // --- حالة المصادقة ---
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/'); // العودة للرئيسية
  };
  
  // --- إغلاق القائمة ---
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

  // --- دالة لتحديث الرابط (URL) ---
  const updateQuery = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // إعادة تعيين الصفحة عند تغيير الفلتر
    if (key !== 'page') {
      params.delete('page');
    }
    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery('search', currentSearch);
  };
  
  const handleLangChange = (e) => {
    const newLang = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.push(`?${params.toString()}`);
  };

  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link href={`/?lang=${lang}`} className="flex items-center gap-3 order-1">
            <CustomGameIcon className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {t.siteName}
            </h1>
          </Link>

          {/* --- أزرار الدخول/الخروج واللغة --- */}
          <div className="flex items-center gap-2 order-2 md:order-4">
            <div className="relative">
              <select
                value={lang}
                onChange={handleLangChange}
                className={`w-full bg-white/10 border border-purple-500/30 rounded-lg font-semibold transition-all
                           appearance-none cursor-pointer ${
                             isRTL ? 'pr-10 pl-4' : 'pl-4 pr-10'
                           } py-2 text-white
                           focus:outline-none focus:border-purple-400`}
              >
                <option value="en" className="bg-gray-800 text-white">EN</option>
                <option value="ar" className="bg-gray-800 text-white">AR</option>
                <option value="de" className="bg-gray-800 text-white">DE</option>
              </select>
              <ChevronDown className={`absolute top-2.5 ${ isRTL ? 'left-3' : 'right-3' } w-5 h-5 text-gray-300 pointer-events-none`} />
            </div>

            {user ? (
              <>
                <Link href="/dashboard" title={t.dashboard} className="p-2 rounded-lg font-semibold transition-all bg-white/10 text-gray-300 hover:bg-purple-600 hover:text-white">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  title={t.logout}
                  className="p-2 rounded-lg font-semibold transition-all bg-white/10 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link href="/login" title={t.login} className="p-2 rounded-lg font-semibold transition-all bg-white/10 text-gray-300 hover:bg-purple-600 hover:text-white">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* --- نموذج البحث --- */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:flex-1 md:max-w-md order-3 md:order-2"
          >
            <div className="relative">
              <Search className={`absolute top-3 ${ isRTL ? 'right-3' : 'left-3' } w-5 h-5 text-gray-400`} />
              <input
                type="text"
                placeholder={t.search}
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
                className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                  isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                } py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400`}
              />
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

          {/* --- الفلاتر --- */}
          <div
            ref={categoryDropdownRef}
            className="relative flex items-center gap-2 md:gap-4 w-full md:w-auto order-4 md:order-3 justify-center md:justify-start"
          >
            <button
              onClick={() => updateQuery('sortBy', 'popular')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                searchParams.sortBy === 'popular'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/20'
              }`}
            >
              {t.popular}
            </button>
            <button
              onClick={() => updateQuery('sortBy', 'new')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                (searchParams.sortBy || 'new') === 'new'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/20'
              }`}
            >
              {t.new}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold transition-all text-gray-300 hover:bg-white/20"
              >
                <span>
                  {t.tags}
                  {searchParams.category && `: ${searchParams.category}`}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${ isCategoryDropdownOpen ? 'rotate-180' : '' }`} />
              </button>
            </div>

            {isCategoryDropdownOpen && (
              <div
                className={`absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 ${
                  isRTL ? 'md:left-0' : 'md:right-0'
                } top-full mt-4 w-[90vw] md:w-[40rem] bg-gray-800 border border-purple-500/30 rounded-lg z-20 shadow-lg p-4`}
              >
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  <button
                    onClick={() => updateQuery('category', null)}
                    className={`w-full text-center px-3 py-2 text-white hover:bg-purple-700 rounded-md transition-all ${
                      !searchParams.category ? 'bg-purple-600' : ''
                    }`}
                  >
                    {t.allCategories}
                  </button>
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => updateQuery('category', category)}
                      className={`w-full text-center px-3 py-2 text-white hover:bg-purple-700 rounded-md transition-all ${
                        searchParams.category === category
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
      </div>
    </header>
  );
}