"use client";

import { Suspense, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Settings,
  Search,
  Loader2,
  UploadCloud,
  Check,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// (كود الترجمة)
const translations = {
  en: {
    dashboard: 'Dashboard',
    addGame: 'Add Game',
    siteSettings: 'Site Settings',
    gameName: 'Game Name',
    description: 'Description',
    categories: 'Categories',
    addCategory: 'Add Category',
    supportedLanguages: 'Supported Languages',
    addLanguage: 'Add Language',
    coverImage: 'Cover Image',
    uploading: 'Uploading...',
    screenshots: 'Screenshots',
    downloadLinks: 'Download Links',
    visits: 'Visits',
    rating: 'Rating',
    ratingCount: 'Rating Count',
    save: 'Save',
    cancel: 'Cancel',
    searchGames: 'Search games...',
    edit: 'Edit',
    delete: 'Delete',
    gameList: 'Games List',
    settingsSaved: 'Settings saved!',
    back: 'Back to Site',
    deleteConfirm: 'Are you sure you want to delete this game?',
    addNewTag: 'Add new tag...',
    selectTag: 'Select a tag...',
    // --- 💡 إضافة ترجمات جديدة ---
    addNewLanguage: 'Add new language...',
    selectLanguage: 'Select a language...',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    addGame: 'إضافة لعبة',
    siteSettings: 'إعدادات الموقع',
    gameName: 'اسم اللعبة',
    description: 'الوصف',
    categories: 'التصنيفات',
    addCategory: 'أضف تصنيف',
    supportedLanguages: 'اللغات المدعومة',
    addLanguage: 'أضف لغة',
    coverImage: 'صورة الغلاف',
    uploading: 'جاري الرفع...',
    screenshots: 'لقطات الشاشة',
    downloadLinks: 'روابط التحميل',
    visits: 'الزيارات',
    rating: 'التقييم',
    ratingCount: 'عدد التقييمات',
    save: 'حفظ',
    cancel: 'إلغاء',
    searchGames: 'ابحث في الألعاب...',
    edit: 'تعديل',
    delete: 'حذف',
    gameList: 'قائمة الألعاب',
    settingsSaved: 'تم حفظ الإعدادات!',
    back: 'العودة للموقع',
    deleteConfirm: 'هل أنت متأكد من حذف هذه اللعبة؟',
    addNewTag: 'أضف تاغ جديد...',
    selectTag: 'اختر تاغ...',
    // --- 💡 إضافة ترجمات جديدة ---
    addNewLanguage: 'أضف لغة جديدة...',
    selectLanguage: 'اختر لغة...',
  },
  de: {
    dashboard: 'Dashboard',
    addGame: 'Spiel hinzufügen',
    siteSettings: 'Seiteneinstellungen',
    gameName: 'Spielname',
    description: 'Beschreibung',
    categories: 'Kategorien',
    addCategory: 'Kategorie hinzufügen',
    supportedLanguages: 'Unterstützte Sprachen',
    addLanguage: 'Sprache hinzufügen',
    coverImage: 'Coverbild',
    uploading: 'Lädt hoch...',
    screenshots: 'Screenshots',
    downloadLinks: 'Download-Links',
    visits: 'Besuche',
    rating: 'Bewertung',
    ratingCount: 'Anzahl Bewertungen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    searchGames: 'Spiele suchen...',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    gameList: 'Spieleliste',
    settingsSaved: 'Einstellungen gespeichert!',
    back: 'Zurück zur Seite',
    deleteConfirm: 'Sind Sie sicher, dass Sie dieses Spiel löschen möchten?',
    addNewTag: 'Neuen Tag hinzufügen...',
    selectTag: 'Tag auswählen...',
    // --- 💡 إضافة ترجمات جديدة ---
    addNewLanguage: 'Neue Sprache hinzufügen...',
    selectLanguage: 'Sprache auswählen...',
  },
};

// --- دالة مساعدة لرفع الملفات (من الكود القديم) ---
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
// --- دالة مساعدة لحذف الملفات (من الكود القديم) ---
const getPathFromUrl = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/game-images/'); // تأكد أن 'game-images' هو اسم الحاوية
    return parts[1] || null;
  } catch (e) {
    console.error('Invalid URL:', url, e);
    return null;
  }
};

// هذه الدالة ستستدعي الـ Route Handler الذي أنشأناه
async function triggerRevalidation() {
  try {
    const res = await fetch('/api/revalidate', {
      method: 'POST',
    });
    const data = await res.json();
    if (data.revalidated) {
      console.log('Revalidation successful:', data);
    } else {
      console.warn('Revalidation failed:', data);
    }
  } catch (error) {
    console.error('Failed to trigger revalidation:', error);
  }
}

// تم تغيير اسم المكون الافتراضي إلى DashboardComponent
function DashboardComponent() {
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') || 'en';
  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ar';
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- كل حالات لوحة التحكم ---
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [editingGame, setEditingGame] = useState(null);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    categories: [],
    languages: [],
    image: '',
    screenshots: [],
    links: { windows: '', mac: '', linux: '', android: '' },
    visits: 0,
    rating: 0,
    rating_count: 0,
  });
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [editLanguage, setEditLanguage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  
  const [gameToDelete, setGameToDelete] = useState(null); // لحالة نافذة التأكيد

  const [socialLinks, setSocialLinks] = useState({
    reddit: '',
    telegram: '',
    youtube: '',
    twitter: '',
    email: '',
  });
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);

  // --- حالات جديدة للتصنيفات ---
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [editSelectedCategory, setEditSelectedCategory] = useState('');
  const [showEditNewCategoryInput, setShowEditNewCategoryInput] = useState(false);

  // --- 💡 حالات جديدة للغات ---
  const [allLanguages, setAllLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showNewLanguageInput, setShowNewLanguageInput] = useState(false);
  const [editSelectedLanguage, setEditSelectedLanguage] = useState('');
  const [showEditNewLanguageInput, setShowEditNewLanguageInput] = useState(false);


  // --- التحقق من المصادقة ---
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?lang=${lang}`); // إعادة توجيه مع اللغة
      } else {
        setUser(session.user);
        fetchDashboardData();
      }
    };
    checkUser();
  }, [router, lang]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
      if (gamesError) throw gamesError;
      setGames(gamesData || []);
      setAllGames(gamesData || []);

      // --- جلب وفرز التصنيفات الفريدة ---
      const categoriesSet = new Set();
      // --- 💡 جلب وفرز اللغات الفريدة ---
      const languagesSet = new Set();
      
      (gamesData || []).forEach(game => {
        (game.categories || []).forEach(cat => categoriesSet.add(cat));
        // 💡 إضافة اللغات
        (game.languages || []).forEach(lang => languagesSet.add(lang));
      });
      
      const sortedCategories = Array.from(categoriesSet).sort((a, b) => a.localeCompare(b));
      setAllCategories(sortedCategories);
      
      // 💡 فرز وتعيين اللغات
      const sortedLanguages = Array.from(languagesSet).sort((a, b) => a.localeCompare(b));
      setAllLanguages(sortedLanguages);

    } catch (error) {
      console.error('Error fetching games:', error.message);
    }
    // (جلب الإعدادات)
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('social_links')
        .eq('id', 1)
        .single();
      if (settingsData) {
        setSocialLinks(settingsData.social_links);
      }
    } catch (error) {
      console.error('Error fetching settings:', error.message);
    }
    setLoading(false);
  }

  // --- دوال لوحة التحكم (CRUD) ---

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const imageUrl = await uploadFile(file, 'game-images');
    setIsUploading(false);
    return imageUrl;
  };

  const handleScreenshotsUpload = async (files) => {
    setIsUploading(true);
    const urls = [];
    for (const file of files) {
      const url = await uploadFile(file, 'game-images');
      if (url) urls.push(url);
    }
    setIsUploading(false);
    return urls;
  };

  const handleAddGame = async () => {
    if (!newGame.name) return;
    setIsUploading(true);
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
    }
    let screenshotUrls = [];
    if (screenshotFiles.length > 0) {
      screenshotUrls = await handleScreenshotsUpload(screenshotFiles);
    }
    setIsUploading(false);

    const gameData = {
      ...newGame,
      image: imageUrl,
      screenshots: screenshotUrls,
      // التأكد من أن الأرقام هي أرقام
      visits: parseInt(newGame.visits) || 0,
      rating: parseFloat(newGame.rating) || 0,
      rating_count: parseInt(newGame.rating_count) || 0,
    };

    const { error } = await supabase.from('games').insert([gameData]);
    if (error) {
      console.error('Error adding game:', error.message);
    } else {
      await triggerRevalidation(); // استدعاء الدالة هنا
      fetchDashboardData(); // إعادة المزامنة
      // إعادة تعيين النموذج
      setNewGame({
        name: '',
        description: '',
        categories: [],
        languages: [],
        image: '',
        screenshots: [],
        links: { windows: '', mac: '', linux: '', android: '' },
        visits: 0,
        rating: 0,
        rating_count: 0,
      });
      setImageFile(null);
      setScreenshotFiles([]);
      setShowNewCategoryInput(false); // إخفاء حقل الإدخال
      setSelectedCategory(''); // إعادة تعيين القائمة المنسدلة
      setShowNewLanguageInput(false); // 💡 إخفاء حقل الإدخال
      setSelectedLanguage(''); // 💡 إعادة تعيين القائمة المنسدلة
    }
  };

  const handleUpdateGame = async () => {
    if (!editingGame || !editingGame.id) return;
    setIsUploading(true);

    let imageUrl = editingGame.image;
    if (imageFile) {
      // حذف الصورة القديمة إذا تم رفع واحدة جديدة
      if(editingGame.image) {
        const oldPath = getPathFromUrl(editingGame.image);
        if(oldPath) await supabase.storage.from('game-images').remove([oldPath]);
      }
      imageUrl = await handleImageUpload(imageFile);
    }

    let screenshotUrls = editingGame.screenshots || [];
    if (screenshotFiles.length > 0) {
      const newUrls = await handleScreenshotsUpload(screenshotFiles);
      screenshotUrls = [...screenshotUrls, ...newUrls];
    }
    setIsUploading(false);
    
    // التأكد من أن الأرقام هي أرقام
    const updatedGameData = {
      ...editingGame,
      image: imageUrl,
      screenshots: screenshotUrls,
      visits: parseInt(editingGame.visits) || 0,
      rating: parseFloat(editingGame.rating) || 0,
      rating_count: parseInt(editingGame.rating_count) || 0,
    };

    const { data, error } = await supabase
      .from('games')
      .update(updatedGameData)
      .eq('id', editingGame.id);

    if (error) {
      console.error('Error updating game:', error.message);
    } else {
      await triggerRevalidation(); // استدعاء الدالة هنا
      setEditingGame(null);
      setImageFile(null);
      setScreenshotFiles([]);
      fetchDashboardData(); // إعادة المزامنة
      setShowEditNewCategoryInput(false); // إخفاء حقل الإدخال
      setEditSelectedCategory(''); // إعادة تعيين القائمة المنسدلة
      setShowEditNewLanguageInput(false); // 💡 إخفاء حقل الإدخال
      setEditSelectedLanguage(''); // 💡 إعادة تعيين القائمة المنسدلة
    }
  };
  
  // دالة الحذف الفعلية
  const confirmDeleteGame = async () => {
    if (!gameToDelete) return;
    
    // 1. حذف الصور
    const filesToDelete = [];
    if (gameToDelete.image) {
      const path = getPathFromUrl(gameToDelete.image);
      if (path) filesToDelete.push(path);
    }
    if (gameToDelete.screenshots && gameToDelete.screenshots.length > 0) {
      gameToDelete.screenshots.forEach((url) => {
        const path = getPathFromUrl(url);
        if (path) filesToDelete.push(path);
      });
    }

    if (filesToDelete.length > 0) {
      const { data, error } = await supabase.storage
        .from('game-images')
        .remove(filesToDelete);
      if (error) {
        console.error('Error deleting images:', error.message);
      }
    }

    // 2. حذف اللعبة
    const { error: dbError } = await supabase
      .from('games')
      .delete()
      .eq('id', gameToDelete.id);

    if (dbError) {
      console.error('Error deleting game:', dbError.message);
    } else {
      await triggerRevalidation(); // استدعاء الدالة هنا
      fetchDashboardData(); // إعادة المزامنة
    }
    setGameToDelete(null); // إغلاق نافذة التأكيد
  };

  const handleSaveSettings = async () => {
    const { error } = await supabase
      .from('site_settings')
      .update({ social_links: socialLinks })
      .eq('id', 1);

    if (error) {
      console.error('Error saving settings:', error.message);
    } else {
      // (اختياري) يمكنك استدعاء triggerRevalidation() هنا إذا كانت الإعدادات تؤثر على الصفحة الرئيسية
      // await triggerRevalidation(); 
      setShowSettingsSaved(true);
      setTimeout(() => setShowSettingsSaved(false), 3000);
    }
  };

  // --- دوال مساعدة لإدارة القوائم ---

  // --- دالة جديدة للتعامل مع القائمة المنسدلة ---
  const handleCategorySelectChange = (e, isEdit) => {
    const value = e.target.value;
    if (isEdit) {
      setEditSelectedCategory(value);
      if (value === 'ADD_NEW') {
        setShowEditNewCategoryInput(true);
      } else if (value) {
        // أضف التاغ الموجود مسبقاً
        if (!editingGame.categories.includes(value)) {
           setEditingGame({
            ...editingGame,
            categories: [...(editingGame.categories || []), value],
          });
        }
        setEditSelectedCategory(''); // إعادة تعيين القائمة المنسدلة
        setShowEditNewCategoryInput(false);
      } else {
        setShowEditNewCategoryInput(false);
      }
    } else {
      setSelectedCategory(value);
      if (value === 'ADD_NEW') {
        setShowNewCategoryInput(true);
      } else if (value) {
        // أضف التاغ الموجود مسبقاً
        if (!newGame.categories.includes(value)) {
          setNewGame({ ...newGame, categories: [...newGame.categories, value] });
        }
        setSelectedCategory(''); // إعادة تعيين القائمة المنسدلة
        setShowNewCategoryInput(false);
      } else {
        setShowNewCategoryInput(false);
      }
    }
  };

  const handleAddCategory = (isEdit) => {
    const category = (isEdit ? editCategory : newCategory).trim();
    if (category) {
      if (isEdit) {
        setEditingGame({
          ...editingGame,
          categories: [...(editingGame.categories || []), category],
        });
        setEditCategory('');
      } else {
        setNewGame({ ...newGame, categories: [...newGame.categories, category] });
        setNewCategory('');
      }
    }
  };

  const handleRemoveCategory = (index, isEdit) => {
    if (isEdit) {
      const updatedCategories = [...editingGame.categories];
      updatedCategories.splice(index, 1);
      setEditingGame({ ...editingGame, categories: updatedCategories });
    } else {
      const updatedCategories = [...newGame.categories];
      updatedCategories.splice(index, 1);
      setNewGame({ ...newGame, categories: updatedCategories });
    }
  };
  
  const handleRemoveScreenshot = (indexToRemove) => {
      // لا نحذف من الـ storage هنا، فقط من القائمة
      // الحذف من الـ storage يمكن إضافته كـ "ميزة" لاحقاً
      const updatedScreenshots = editingGame.screenshots.filter((_, index) => index !== indexToRemove);
      setEditingGame({ ...editingGame, screenshots: updatedScreenshots });
  };

  // --- 💡 دالة جديدة للغات ---
  const handleLanguageSelectChange = (e, isEdit) => {
    const value = e.target.value;
    if (isEdit) {
      setEditSelectedLanguage(value);
      if (value === 'ADD_NEW') {
        setShowEditNewLanguageInput(true);
      } else if (value) {
        if (!editingGame.languages.includes(value)) {
           setEditingGame({
            ...editingGame,
            languages: [...(editingGame.languages || []), value],
          });
        }
        setEditSelectedLanguage('');
        setShowEditNewLanguageInput(false);
      } else {
        setShowEditNewLanguageInput(false);
      }
    } else {
      setSelectedLanguage(value);
      if (value === 'ADD_NEW') {
        setShowNewLanguageInput(true);
      } else if (value) {
        if (!newGame.languages.includes(value)) {
          setNewGame({ ...newGame, languages: [...newGame.languages, value] });
        }
        setSelectedLanguage('');
        setShowNewLanguageInput(false);
      } else {
        setShowNewLanguageInput(false);
      }
    }
  };

  const handleAddLanguage = (isEdit) => {
    const lang = (isEdit ? editLanguage : newLanguage).trim();
    if (lang) {
      if (isEdit) {
        setEditingGame({
          ...editingGame,
          languages: [...(editingGame.languages || []), lang],
        });
        setEditLanguage('');
      } else {
        setNewGame({ ...newGame, languages: [...newGame.languages, lang] });
        setNewLanguage('');
      }
    }
  };

  const handleRemoveLanguage = (index, isEdit) => {
    if (isEdit) {
      const updatedLanguages = [...editingGame.languages];
      updatedLanguages.splice(index, 1);
      setEditingGame({ ...editingGame, languages: updatedLanguages });
    } else {
      const updatedLanguages = [...newGame.languages];
      updatedLanguages.splice(index, 1);
      setNewGame({ ...newGame, languages: updatedLanguages });
    }
  };

  // فلترة الألعاب في لوحة التحكم
  const handleDashboardSearch = (e) => {
    const query = e.target.value;
    setDashboardSearchQuery(query);
    if (query) {
      setGames(
        allGames.filter(
          (game) =>
            game.name.toLowerCase().includes(query.toLowerCase()) ||
            (game.description && game.description.toLowerCase().includes(query.toLowerCase()))
        )
      );
    } else {
      setGames(allGames);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
    >
      {/* هيدر لوحة التحكم */}
      <header className="bg-black/30 backdrop-blur-md p-4 sticky top-0 z-40 border-b border-purple-500/20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">
            {t.dashboard}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-gray-300 hover:text-white"
          >
            {t.back}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* --- نموذج إضافة لعبة --- */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              {t.addGame}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Game Name */}
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.gameName}
                  </label>
                  <input
                    type="text"
                    value={newGame.name}
                    onChange={(e) =>
                      setNewGame({ ...newGame, name: e.target.value })
                    }
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.description}
                  </label>
                  <textarea
                    value={newGame.description}
                    onChange={(e) =>
                      setNewGame({ ...newGame, description: e.target.value })
                    }
                    rows="4"
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  ></textarea>
                </div>
                {/* --- 💡 قسم التصنيفات المعدل --- */}
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.categories}
                  </label>
                  {/* القائمة المنسدلة */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategorySelectChange(e, false)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-2"
                  >
                    <option value="" className="bg-gray-900 text-gray-300">{t.selectTag}</option>
                    <option value="ADD_NEW" className="bg-gray-800 font-bold text-purple-300">{t.addNewTag}</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-800 text-white">{cat}</option>
                    ))}
                  </select>

                  {/* حقل الإدخال النصي (يظهر عند اختيار "إضافة جديد") */}
                  {showNewCategoryInput && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder={t.addNewTag}
                        className="flex-grow bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />
                      <button
                        onClick={() => {
                          handleAddCategory(false);
                          setShowNewCategoryInput(false); // إخفاء الحقل بعد الإضافة
                          setSelectedCategory(''); // إعادة تعيين القائمة
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                      >
                        {t.addCategory}
                      </button>
                    </div>
                  )}

                  {/* عرض التصنيفات المضافة */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newGame.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full"
                      >
                        {cat}
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => handleRemoveCategory(index, false)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                {/* --- 💡 قسم اللغات المعدل --- */}
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.supportedLanguages}
                  </label>
                  {/* القائمة المنسدلة للغات */}
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageSelectChange(e, false)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-2"
                  >
                    <option value="" className="bg-gray-900 text-gray-300">{t.selectLanguage}</option>
                    <option value="ADD_NEW" className="bg-gray-800 font-bold text-purple-300">{t.addNewLanguage}</option>
                    {allLanguages.map((lang) => (
                      <option key={lang} value={lang} className="bg-gray-800 text-white">{lang}</option>
                    ))}
                  </select>

                  {/* حقل الإدخال النصي (يظهر عند اختيار "إضافة جديد") */}
                  {showNewLanguageInput && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder={t.addNewLanguage}
                        className="flex-grow bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      />
                      <button
                        onClick={() => {
                          handleAddLanguage(false);
                          setShowNewLanguageInput(false);
                          setSelectedLanguage('');
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                      >
                        {t.addLanguage}
                      </button>
                    </div>
                  )}

                  {/* عرض اللغات المضافة */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newGame.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-gray-500/30 text-gray-200 px-3 py-1 rounded-full"
                      >
                        {lang}
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => handleRemoveLanguage(index, false)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Cover Image */}
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.coverImage}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                </div>
                {/* Screenshots */}
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.screenshots}
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setScreenshotFiles(Array.from(e.target.files))}
                    className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                </div>
                {/* Links */}
                <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.downloadLinks}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Windows"
                      value={newGame.links.windows}
                      onChange={(e) =>
                        setNewGame({
                          ...newGame,
                          links: { ...newGame.links, windows: e.target.value },
                        })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                     <input
                      type="text"
                      placeholder="Mac"
                      value={newGame.links.mac}
                      onChange={(e) =>
                        setNewGame({
                          ...newGame,
                          links: { ...newGame.links, mac: e.target.value },
                        })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                     <input
                      type="text"
                      placeholder="Linux"
                      value={newGame.links.linux}
                      onChange={(e) =>
                        setNewGame({
                          ...newGame,
                          links: { ...newGame.links, linux: e.target.value },
                        })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                     <input
                      type="text"
                      placeholder="Android"
                      value={newGame.links.android}
                      onChange={(e) =>
                        setNewGame({
                          ...newGame,
                          links: { ...newGame.links, android: e.target.value },
                        })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.visits}
                    </label>
                    <input
                      type="number"
                      value={newGame.visits}
                      onChange={(e) =>
                        setNewGame({ ...newGame, visits: e.target.value })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.rating}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newGame.rating}
                      onChange={(e) =>
                        setNewGame({ ...newGame, rating: e.target.value })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.ratingCount}
                    </label>
                    <input
                      type="number"
                      value={newGame.rating_count}
                      onChange={(e) =>
                        setNewGame({
                          ...newGame,
                          rating_count: e.target.value,
                        })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <button
              onClick={handleAddGame}
              disabled={isUploading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.uploading}
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  {t.addGame}
                </>
              )}
            </button>
          </div>

          {/* --- إعدادات الموقع --- */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              {t.siteSettings}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(socialLinks).map((key) => (
                <div key={key}>
                  <label className="block mb-2 text-gray-300 text-sm capitalize">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={socialLinks[key]}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, [key]: e.target.value })
                    }
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveSettings}
              className="mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              <Save className="w-5 h-5" />
              {t.save}
            </button>
            {showSettingsSaved && (
              <div className="mt-4 flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                {t.settingsSaved}
              </div>
            )}
          </div>

          {/* --- قائمة الألعاب (للتعديل والحذف) --- */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t.gameList}
            </h2>
            <div className="relative mb-4">
              <Search
                className={`absolute top-3 ${
                  isRTL ? 'right-3' : 'left-3'
                } w-5 h-5 text-gray-400`}
              />
              <input
                type="text"
                placeholder={t.searchGames}
                value={dashboardSearchQuery}
                onChange={handleDashboardSearch}
                className={`w-full bg-white/10 border border-purple-500/30 rounded-lg ${
                  isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                } py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400`}
              />
            </div>

            {/* القائمة */}
            <div className="space-y-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={game.image || '[https://placehold.co/64x64/4a0e71/ffffff?text=](https://placehold.co/64x64/4a0e71/ffffff?text=)...'}
                      alt={game.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <span className="text-lg font-semibold">{game.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGame({ ...game }); // نسخ اللعبة إلى حالة التعديل
                        setImageFile(null);
                        setScreenshotFiles([]);
                      }}
                      className="bg-blue-600 text-white p-2 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setGameToDelete(game)} // فتح نافذة التأكيد
                      className="bg-red-600 text-white p-2 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- نافذة التعديل (Modal) --- */}
        {editingGame && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div
              className="bg-gray-800 border border-purple-500/30 rounded-xl p-6 w-full max-w-4xl h-[90vh] overflow-y-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                {t.edit}: {editingGame.name}
              </h2>
              {/* (نفس نموذج الإضافة، ولكن مربوط بـ editingGame) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Game Name */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.gameName}
                    </label>
                    <input
                      type="text"
                      value={editingGame.name}
                      onChange={(e) =>
                        setEditingGame({ ...editingGame, name: e.target.value })
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.description}
                    </label>
                    <textarea
                      value={editingGame.description}
                      onChange={(e) =>
                        setEditingGame({ ...editingGame, description: e.target.value })
                      }
                      rows="4"
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                    ></textarea>
                  </div>
                  {/* --- 💡 قسم التصنيفات المعدل (لنافذة التعديل) --- */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.categories}
                    </label>
                    {/* القائمة المنسدلة */}
                    <select
                      value={editSelectedCategory}
                      onChange={(e) => handleCategorySelectChange(e, true)}
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-2"
                    >
                      <option value="" className="bg-gray-900 text-gray-300">{t.selectTag}</option>
                      <option value="ADD_NEW" className="bg-gray-800 font-bold text-purple-300">{t.addNewTag}</option>
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-800 text-white">{cat}</option>
                      ))}
                    </select>
                    
                    {/* حقل الإدخال النصي (يظهر عند اختيار "إضافة جديد") */}
                    {showEditNewCategoryInput && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          placeholder={t.addNewTag}
                          className="flex-grow bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                        />
                        <button
                          onClick={() => {
                            handleAddCategory(true);
                            setShowEditNewCategoryInput(false); // إخفاء الحقل بعد الإضافة
                            setEditSelectedCategory(''); // إعادة تعيين القائمة
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                        >
                          {t.addCategory}
                        </button>
                      </div>
                    )}
                    
                    {/* عرض التصنيفات المضافة */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(editingGame.categories || []).map((cat, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full"
                        >
                          {cat}
                          <X
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => handleRemoveCategory(index, true)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* --- 💡 قسم اللغات المعدل (لنافذة التعديل) --- */}
                 <div>
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.supportedLanguages}
                  </label>
                  {/* القائمة المنسدلة للغات */}
                  <select
                    value={editSelectedLanguage}
                    onChange={(e) => handleLanguageSelectChange(e, true)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-2"
                  >
                    <option value="" className="bg-gray-900 text-gray-300">{t.selectLanguage}</option>
                    <option value="ADD_NEW" className="bg-gray-800 font-bold text-purple-300">{t.addNewLanguage}</option>
                    {allLanguages.map((lang) => (
                      <option key={lang} value={lang} className="bg-gray-800 text-white">{lang}</option>
                    ))}
                  </select>
                  
                  {/* حقل الإدخال النصي (يظهر عند اختيار "إضافة جديد") */}
                  {showEditNewLanguageInput && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                        placeholder={t.addNewLanguage}
                        className="flex-grow bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                      <button
                        onClick={() => {
                          handleAddLanguage(true);
                          setShowEditNewLanguageInput(false);
                          setEditSelectedLanguage('');
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                      >
                        {t.addLanguage}
                      </button>
                    </div>
                  )}

                  {/* عرض اللغات المضافة */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(editingGame.languages || []).map((lang, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-gray-500/30 text-gray-200 px-3 py-1 rounded-full"
                      >
                        {lang}
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => handleRemoveLanguage(index, true)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Cover Image */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.coverImage} (اتركه فارغاً للاحتفاظ بالقديمة)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                  </div>
                   {/* Screenshots */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.screenshots}
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setScreenshotFiles(Array.from(e.target.files))}
                      className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(editingGame.screenshots || []).map((ssUrl, index) => (
                            <div key={index} className="relative">
                                <img src={ssUrl} className="w-20 h-20 object-cover rounded-md" />
                                <button onClick={() => handleRemoveScreenshot(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                  </div>
                  {/* Links */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">
                      {t.downloadLinks}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Windows"
                        value={editingGame.links?.windows || ''}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            links: { ...editingGame.links, windows: e.target.value },
                          })
                        }
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                       <input
                        type="text"
                        placeholder="Mac"
                        value={editingGame.links?.mac || ''}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            links: { ...editingGame.links, mac: e.target.value },
                          })
                        }
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                       <input
                        type="text"
                        placeholder="Linux"
                        value={editingGame.links?.linux || ''}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            links: { ...editingGame.links, linux: e.target.value },
                          })
                        }
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                       <input
                        type="text"
                        placeholder="Android"
                        value={editingGame.links?.android || ''}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            links: { ...editingGame.links, android: e.target.value },
                          })
                        }
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-gray-300 text-sm">
                        {t.visits}
                      </label>
                      <input
                        type="number"
                        value={editingGame.visits}
                        onChange={(e) =>
                          setEditingGame({ ...editingGame, visits: e.target.value })
                        }
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-300 text-sm">
                        {t.rating}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingGame.rating}
                        onChange={(e) =>
                          setEditingGame({ ...editingGame, rating: e.target.value })
                        }
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-300 text-sm">
                        {t.ratingCount}
                      </label>
                      <input
                        type="number"
                        value={editingGame.rating_count}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            rating_count: e.target.value,
                          })
                        }
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* أزرار الحفظ والإلغاء */}
              <div className="flex items-center justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditingGame(null)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleUpdateGame}
                  disabled={isUploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  {isUploading ? t.uploading : t.save}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* --- نافذة تأكيد الحذف --- */}
        {gameToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
             <div
              className="bg-gray-800 border border-purple-500/30 rounded-xl p-8 w-full max-w-md"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{t.deleteConfirm}</h2>
              <p className="text-gray-300 mb-6">{gameToDelete.name}</p>
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => setGameToDelete(null)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={confirmDeleteGame}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// 4. هذا هو الـ Wrapper الذي يتم تصديره
export default function DashboardPageWrapper() {
  return (
    // 5. إضافة حدود الـ Suspense
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-900"><Loader2 className="w-12 h-12 animate-spin text-purple-400" /></div>}>
      <DashboardComponent />
    </Suspense>
  );
}