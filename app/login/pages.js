"use client";

import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// (ضع كود الترجمة المصغر هنا)
const translations = {
  en: {
    adminLogin: 'Admin Login',
    email: 'Email',
    password: 'Password',
    cancel: 'Cancel',
    login: 'Login',
    loggingIn: 'Logging in...',
    loginError: 'Login failed. Check email or password.',
  },
  ar: {
    adminLogin: 'دخول المدير',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    cancel: 'إلغاء',
    login: 'تسجيل الدخول',
    loggingIn: 'جاري الدخول...',
    loginError: 'فشل الدخول. تأكد من البريد أو كلمة المرور.',
  },
  de: {
    // ...
  },
};

export default function LoginPage({ searchParams }) {
  const lang = searchParams.lang || 'en';
  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setLoginError(t.loginError);
    } else {
      // نجاح! أعد توجيهه إلى لوحة التحكم
      router.push('/dashboard');
    }
    setIsLoggingIn(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-gray-800 border border-purple-500/30 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {t.adminLogin}
        </h2>
        {loginError && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">
            {loginError}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
              onClick={() => router.back()} // زر الرجوع
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
}