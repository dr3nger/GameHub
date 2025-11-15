"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient'; // التأكد من أن المسار صحيح

// 1. إنشاء الـ Context
const AuthContext = createContext(null);

// 2. إنشاء المزود (Provider)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // حالة للتحميل

  useEffect(() => {
    // 3. جلب الجلسة الحالية عند التحميل
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 4. الاستماع لأي تغييرات في المصادقة (تسجيل دخول/خروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // 5. إلغاء الاشتراك عند إغلاق المكون
    return () => subscription.unsubscribe();
  }, []);

  // 6. توفير الحالة (user) لكل المكونات الفرعية
  const value = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 7. إنشاء Hook مخصص لسهولة الاستخدام
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};