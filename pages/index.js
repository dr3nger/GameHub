"use client"; // <<< هذا السطر ضروري لـ Next.js

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
  Laptop, // Kept for fallback
  Smartphone, // Re-added for Android
  ChevronDown,
  LayoutDashboard,
  AppWindow, // Added for Windows
  Apple, // Added for Mac
  Bot, // Added for Linux (Tux)
  ChevronLeft, // For Pagination
  ChevronRight, // For Pagination
  ChevronsLeft, // For Pagination
  ChevronsRight, // For Pagination
} from 'lucide-react';

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
    page: 'Page', // For Pagination
    of: 'of', // For Pagination
    first: 'First', // For Pagination
    last: 'Last', // For Pagination
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
    page: 'صفحة', // For Pagination
    of: 'من', // For Pagination
    first: 'الأولى', // For Pagination
    last: 'الأخيرة', // For Pagination
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
    page: 'Seite', // For Pagination
    of: 'von', // For Pagination
    first: 'Erste', // For Pagination
    last: 'Letzte', // For Pagination
  },
};

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
          <span key={`ellipsis-${index}`} className="text-gray-400 px-2 py-2">
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

// تم تغيير اسم المكون من App إلى Home
export default function Home() {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // null = no search done, [] = search done, no results
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Sorting and Filtering
  const [sortBy, setSortBy] = useState('new'); // 'new', 'popular'
  const [categoryFilter, setCategoryFilter] = useState(''); // '' = all
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [games, setGames] = useState([
    {
      id: 1,
      name: 'Cyber Warriors',
      description: 'Epic futuristic combat game',
      categories: ['action', 'strategy'],
      image:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
      ],
      links: {
        windows: 'https://example.com/win',
        mac: 'https://example.com/mac',
      },
      visits: 1500,
      dateAdded: '2023-10-01T10:00:00Z',
    },
    {
      id: 2,
      name: 'Dragon Quest',
      description: 'Fantasy adventure RPG',
      categories: ['rpg', 'adventure'],
      image:
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
      screenshots: [
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
      ],
      links: {
        windows: 'https://example.com/win',
        linux: 'https://example.com/linux',
      },
      visits: 2200,
      dateAdded: '2023-09-15T14:30:00Z',
    },
    {
      id: 3,
      name: 'Racing Thunder',
      description: 'High-speed racing action',
      categories: ['sports', 'action'],
      image:
        'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=300&fit=crop',
      screenshots: [],
      links: {
        android: 'https://example.com/android',
      },
      visits: 800,
      dateAdded: '2023-10-05T12:00:00Z',
    },
    // Add 18 more dummy games for pagination testing
    ...Array.from({ length: 18 }, (v, i) => ({
      id: i + 4,
      name: `Demo Game ${i + 1}`,
      description: 'This is a demo game description.',
      categories: [i % 2 === 0 ? 'action' : 'puzzle', 'adventure'],
      image: `https://placehold.co/400x300/4a0e71/ffffff?text=Game+${i + 1}`,
      screenshots: [],
      links: {
        windows: 'https://example.com/win',
      },
      visits: Math.floor(Math.random() * 1000),
      dateAdded: `2023-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
    })),
    {
      id: 22,
      name: 'Last Page Game',
      description: 'This game should be on page 2.',
      categories: ['strategy'],
      image: 'https://placehold.co/400x300/7e22ce/ffffff?text=Game+22',
      screenshots: [],
      links: {
        windows: 'https://example.com/win',
      },
      visits: 50,
      dateAdded: '2022-12-31T12:00:00Z',
    },
  ]);
  const [editingGame, setEditingGame] = useState(null);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    categories: [],
    image: '',
    screenshots: [],
    links: { windows: '', mac: '', linux: '', android: '' },
    visits: 0,
  });
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);

  // Close category dropdown when clicking outside
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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, categoryFilter, searchResults]);

  const handleImageUpload = (e, target = 'new') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'new') {
          setImageFile(reader.result);
          setNewGame({ ...newGame, image: reader.result });
        } else {
          setEditingGame({ ...editingGame, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotsUpload = (e, target = 'new') => {
    const files = Array.from(e.target.files);
    const newScreenshots = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newScreenshots.push(reader.result);
        if (newScreenshots.length === files.length) {
          if (target === 'new') {
            setScreenshotFiles([...screenshotFiles, ...newScreenshots]);
            setNewGame({
              ...newGame,
              screenshots: [...(newGame.screenshots || []), ...newScreenshots],
            });
          } else {
            setEditingGame({
              ...editingGame,
              screenshots: [
                ...(editingGame.screenshots || []),
                ...newScreenshots,
              ],
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index, target = 'new') => {
    if (target === 'new') {
      const updatedScreenshots = screenshotFiles.filter((_, i) => i !== index);
      setScreenshotFiles(updatedScreenshots);
      setNewGame({ ...newGame, screenshots: updatedScreenshots });
    } else {
      const updatedScreenshots = editingGame.screenshots.filter(
        (_, i) => i !== index
      );
      setEditingGame({ ...editingGame, screenshots: updatedScreenshots });
    }
  };

  const t = translations[lang];
  const isRTL = lang === 'ar';

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

  const allCategories = [
    ...new Set(games.flatMap((game) => game.categories)),
  ].sort();
  // --- End Category Logic ---

  // --- Start Search Logic ---
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const matchingGames = games.filter(
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
      setSearchResults(null); // Reset search, show all games
    } else {
      const matchingGames = games.filter(
        (game) =>
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(matchingGames);
    }
    setSuggestions([]);
    setShowDashboard(false);
    setSelectedGame(null);
    // setCurrentPage(1); // Handled by useEffect
  };

  const handleSuggestionClick = (game) => {
    setSearchQuery(game.name);
    setSearchResults([game]);
    setSuggestions([]);
    setShowDashboard(false);
    setSelectedGame(null);
    // setCurrentPage(1); // Handled by useEffect
  };
  // --- End Search Logic ---

  // --- Start Game List Logic ---
  const filteredAndSortedGames = (searchResults !== null ? searchResults : games)
    .filter((game) => {
      // Category Filter
      if (categoryFilter === '') return true;
      return game.categories.includes(categoryFilter);
    })
    .sort((a, b) => {
      // Sort By
      if (sortBy === 'popular') {
        return b.visits - a.visits;
      }
      // Default to 'new'
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });

  const totalPages = Math.ceil(
    filteredAndSortedGames.length / GAMES_PER_PAGE
  );

  const gamesToShow = filteredAndSortedGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );
  // --- End Game List Logic ---

  const handleAddGame = () => {
    if (newGame.name && newGame.description) {
      setGames([
        ...games,
        {
          ...newGame,
          id: Date.now(),
          dateAdded: new Date().toISOString(),
        },
      ]);
      setNewGame({
        name: '',
        description: '',
        categories: [],
        image: '',
        screenshots: [],
        links: { windows: '', mac: '', linux: '', android: '' },
        visits: 0,
      });
      setImageFile(null);
      setScreenshotFiles([]);
      setNewCategory('');
    }
  };

  const handleUpdateGame = () => {
    setGames(games.map((g) => (g.id === editingGame.id ? editingGame : g)));
    setEditingGame(null);
    setEditCategory('');
  };

  const handleDeleteGame = (id) => {
    setGames(games.filter((g) => g.id !== id));
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setShowDashboard(false);
    setSearchResults(null);
    setSearchQuery('');
  };

  const handleGoBack = () => {
    setSelectedGame(null);
    // Don't reset search results so user can go back to their search
    // setSearchResults(null);
  };

  // Handle 'Tags' dropdown click
  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    setIsCategoryDropdownOpen(false);
    // When filtering, also reset search
    setSearchResults(null);
    setSearchQuery('');
    // setCurrentPage(1); // Handled by useEffect
  };

  // --- Start Related Games Logic ---
  const getRelatedGames = () => {
    if (!selectedGame) return [];
    return games
      .filter(
        (g) =>
          g.id !== selectedGame.id && // Not the same game
          g.categories.some((cat) => selectedGame.categories.includes(cat)) // At least one matching category
      )
      .slice(0, 5); // Show 5 related games
  };
  // --- End Related Games Logic ---

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* تم تعديل هذا الجزء ليصبح متجاوباً */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Logo - Home Button (Order 1 on mobile and desktop) */}
            <button
              onClick={() => {
                setShowDashboard(false);
                setSelectedGame(null);
                setSearchResults(null);
                setSearchQuery('');
                setSuggestions([]);
                setCategoryFilter('');
                setSortBy('new');
                setCurrentPage(1);
              }}
              className="flex items-center gap-3 order-1" // order-1
            >
              <Gamepad2 className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {t.siteName}
              </h1>
            </button>

            {/* Controls (Order 2 on mobile, 4 on desktop) */}
            <div className="flex items-center gap-2 order-2 md:order-4">
              {/* Language Switcher */}
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

              {/* Admin/Dashboard Button */}
              <button
                onClick={() => {
                  setShowDashboard(true);
                  setSelectedGame(null);
                }}
                title={t.dashboard} // Tooltip
                className="p-2 rounded-lg font-semibold transition-all bg-white/10 text-gray-300 hover:bg-purple-600 hover:text-white"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            </div>

            {/* Search (Order 3 on mobile, 2 on desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full md:flex-1 md:max-w-md order-3 md:order-2" // Responsive order and width
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

                {/* Autocomplete Suggestions */}
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
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop'
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
              {/* Submit Button */}
              <button
                type="submit"
                title={t.submitSearch}
                className="absolute top-1/2 -translate-y-1/2 p-2 rounded-lg font-semibold transition-all bg-purple-600 text-white hover:bg-purple-700"
                style={isRTL ? { left: '8px' } : { right: '8px' }}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Nav Links (Order 4 on mobile, 3 on desktop) - Removed "hidden" */}
            <div
              className="relative flex items-center gap-2 md:gap-4 w-full md:w-auto order-4 md:order-3 justify-center md:justify-start"
              ref={categoryDropdownRef}
            >
              <button
                onClick={() => {
                  setSortBy('popular');
                  // setCurrentPage(1); // Handled by useEffect
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
                  // setCurrentPage(1); // Handled by useEffect
                }}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                  sortBy === 'new'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-white/20'
                }`}
              >
                {t.new}
              </button>

              {/* Tags Dropdown */}
              <div className="">
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

                {/* Dropdown Menu - Responsive Width and Columns */}
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
                            categoryFilter === category ? 'bg-purple-600' : ''
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!showDashboard && !selectedGame ? (
          /* Home View - Grid */
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
                          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop'
                        }
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop';
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  {t.noGames}
                </div>
              )}
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              t={t}
              isRTL={isRTL}
            />
          </>
        ) : !showDashboard && selectedGame ? (
          /* Game Detail View */
          <div className="text-white">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-all mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.back}</span>
            </button>

            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <img
                  src={
                    selectedGame.image ||
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop'
                  }
                  alt={selectedGame.name}
                  className="w-full h-auto object-cover rounded-xl shadow-lg border-2 border-purple-500/30"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop';
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {selectedGame.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedGame.categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-block px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t.description}
              </h3>
              <p className="text-gray-300 text-lg whitespace-pre-wrap">
                {selectedGame.description}
              </p>
            </div>

            {/* Screenshots */}
            {selectedGame.screenshots && selectedGame.screenshots.length > 0 && (
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

            {/* Downloads */}
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
                      href={selectedGame.links.windows}
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
                      href={selectedGame.links.mac}
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
                      href={selectedGame.links.linux}
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
                      href={selectedGame.links.android}
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

            {/* === START RELATED GAMES === */}
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
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop'
                          }
                          alt={game.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop';
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* === END RELATED GAMES === */}
          </div>
        ) : (
          /* Dashboard View */
          <div className="space-y-6">
            {/* Add Game Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                {t.addGame}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Game Name Input */}
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

                {/* Visits Input */}
                <div className="md:col-span-1">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.visits}
                  </label>
                  <input
                    type="number"
                    placeholder={t.visits}
                    value={newGame.visits}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        visits: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Categories Input */}
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
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                    placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>

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
                  {imageFile && (
                    <img
                      src={imageFile}
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
              {screenshotFiles.length > 0 && (
                <div className="mt-4">
                  <label className="block mb-2 text-gray-300 text-sm">
                    {t.screenshots} ({screenshotFiles.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {screenshotFiles.map((screenshot, index) => (
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

              {/* Download Links */}
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
                className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                {t.addGame}
              </button>
            </div>

            {/* Games List */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                {t.dashboard}
              </h2>
              <div className="space-y-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-white/5 rounded-lg p-4 border border-purple-500/20"
                  >
                    {editingGame?.id === game.id ? (
                      <div className="space-y-3">
                        {/* Edit Game Name Input */}
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
                        {/* Edit Visits Input */}
                        <div className="md:col-span-1">
                          <label className="block mb-2 text-gray-300 text-sm">
                            {t.visits}
                          </label>
                          <input
                            type="number"
                            value={editingGame.visits}
                            onChange={(e) =>
                              setEditingGame({
                                ...editingGame,
                                visits: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                            placeholder={t.visits}
                          />
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

                        {/* Edit Categories Input */}
                        <div>
                          <label className="block mb-2 text-gray-300 text-sm">
                            {t.categories}
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editingGame.categories.map((cat) => (
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
                            className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white
                                            placeholder-gray-400 focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-gray-300 text-sm">
                            {t.uploadImage}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'edit')}
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                          />
                          {editingGame.image && (
                            <img
                              src={editingGame.image}
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
                            onChange={(e) => handleScreenshotsUpload(e, 'edit')}
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                          />
                        </div>
                        {editingGame.screenshots &&
                          editingGame.screenshots.length > 0 && (
                            <div>
                              <label className="block mb-2 text-gray-300 text-sm">
                                {t.screenshots} ({editingGame.screenshots.length}
                                )
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {editingGame.screenshots.map(
                                  (screenshot, index) => (
                                    <div key={index} className="relative group">
                                      <img
                                        src={screenshot}
                                        alt={`Screenshot ${index + 1}`}
                                        className="w-full h-20 object-cover rounded-lg border border-purple-500/30"
                                      />
                                      <button
                                        onClick={() =>
                                          removeScreenshot(index, 'edit')
                                        }
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full
                                                                opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Edit Download Links */}
                        <div className="mt-4">
                          <label className="block mb-2 text-gray-300 text-sm">
                            {t.downloadLinks}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder={t.windowsLink}
                              value={editingGame.links.windows}
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
                              value={editingGame.links.mac}
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
                              value={editingGame.links.linux}
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
                              value={editingGame.links.android}
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
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">
                            {game.name}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {game.description.substring(0, 100)}...
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {game.categories.map((cat) => (
                              <span
                                key={cat}
                                className="inline-block mt-2 px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingGame(game)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
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
    </div>
  );
}

