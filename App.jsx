import React, { useState, useRef, useEffect } from 'react';
import { Trophy, User, Home, Plus, Globe, Users, CheckCircle, Star, Search, X, RefreshCw, LogOut, Swords, Camera, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DICTIONARY = {
  sk: {
    home: "Questy",
    newQuest: "Nový Quest",
    leaderboard: "Rebríček",
    friends: "Kamoši",
    history: "História",
    refresh: "Obnoviť questy",
    profile: "Tvoj Profil",
    change: "ZMENIŤ",
    totalXp: "Celkové XP",
    lvl: "Lvl",
    questsDone: "Splnené Questy",
    dailyStreak: "Denný Streak",
    lang: "Jazyk",
    signOut: "Odhlásiť sa",
    signIn: "Prihlásiť sa",
    uploadPhoto: "Nahrať fotku (+5 XP)",
    skipPhoto: "Preskočiť (Bez fotky)",
    completeQuest: "Splniť úlohu",
    searchHistory: "Hľadať v histórii...",
    noHistory: "Zatiaľ žiadne splnené questy.",
    attachedPhoto: "Priložená fotka",
    favorites: "Obľúbené Questy",
    show: "Ukázať",
    isolatedView: "Zobrazený konkrétny quest",
    cancelFilter: "Zrušiť filter",
    you: "Ty",
    challenge: "Vyzvať kamoša",
    customMessage: "Tvoja správa pre kamoša...",
    for24h: "Na 24 hodín",
    forWeekend: "Na tento víkend",
    sendChallenge: "Poslať výzvu",
    challengeSent: "Výzva odoslaná!",
    questName: "Názov tvojho questu...",
    aiEval: "AI Ohodnotenie",
    addQuest: "Pridať Quest",
    days: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],
    skins: "Vzhľad apky (Skiny)",
    unlocksAt: "Odomkne lvl",
    welcome: "Vitaj v Side Quest",
    onboardingDesc: "Vyber si, čo ťa baví, aby sme ti vedeli ušiť questy na mieru.",
    continue: "Pokračovať do apky",
    interests: {
      fitness: "Cvičenie & Fitness",
      tech: "IT & Kódovanie",
      creative: "Kreatíva & Tvorba",
      outdoor: "Príroda & Outdoor",
      social: "Social & Kamoši",
      productivity: "Produktivita & Škola",
      lifestyle: "Životný štýl & Návyky",
      maker: "3D Tlač & Maker"
    }
  },
  en: {
    home: "Quests",
    newQuest: "New Quest",
    leaderboard: "Leaderboard",
    friends: "Friends",
    history: "History",
    refresh: "Refresh quests",
    profile: "Your Profile",
    change: "CHANGE",
    totalXp: "Total XP",
    lvl: "Lvl",
    questsDone: "Quests Done",
    dailyStreak: "Daily Streak",
    lang: "Language",
    signOut: "Sign Out",
    signIn: "Sign In",
    uploadPhoto: "Upload Photo (+5 XP)",
    skipPhoto: "Skip (No photo)",
    completeQuest: "Complete Quest",
    searchHistory: "Search history...",
    noHistory: "No completed quests yet.",
    attachedPhoto: "Attached photo",
    favorites: "Favorite Quests",
    show: "Show",
    isolatedView: "Showing specific quest",
    cancelFilter: "Cancel filter",
    you: "You",
    challenge: "Challenge Friend",
    customMessage: "Your message to friend...",
    for24h: "For 24 hours",
    forWeekend: "For this weekend",
    sendChallenge: "Send Challenge",
    challengeSent: "Challenge Sent!",
    questName: "Name of your quest...",
    aiEval: "AI Evaluation",
    addQuest: "Add Quest",
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    skins: "App Skins",
    unlocksAt: "Unlocks lvl",
    welcome: "Welcome to Side Quest",
    onboardingDesc: "Select your interests to get personalized quests.",
    continue: "Enter App",
    interests: {
      fitness: "Fitness & Workout",
      tech: "IT & Coding",
      creative: "Creative & Art",
      outdoor: "Nature & Outdoor",
      social: "Social & Friends",
      productivity: "Productivity & School",
      lifestyle: "Lifestyle & Habits",
      maker: "3D Print & Maker"
    }
  }
};

const SKINS = [
  { id: 'default', name: 'Základný Temný', unlockLevel: 1, gradient: 'from-sky-600 to-sky-400', color: 'sky-400', hex: '#38bdf8' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', unlockLevel: 5, gradient: 'from-fuchsia-600 to-pink-400', color: 'pink-400', hex: '#f472b6' },
  { id: 'oled', name: 'OLED Pitch Black', unlockLevel: 10, gradient: 'from-neutral-700 to-neutral-500', color: 'neutral-300', hex: '#d4d4d4' },
  { id: 'sunset', name: 'Sunset Gold', unlockLevel: 15, gradient: 'from-orange-600 to-yellow-400', color: 'yellow-400', hex: '#facc15' },
  { id: 'emerald', name: 'Toxic Emerald', unlockLevel: 25, gradient: 'from-emerald-600 to-green-400', color: 'emerald-400', hex: '#34d399' },
];

const MASTER_QUEST_LIBRARY = [
  // Tech & Coding
  { id: 't1', key: 'Hodina kódovania (Python/JS)', tags: ['tech', 'productivity'], xp: 50 },
  { id: 't2', key: 'Vyrieš 1 LeetCode problém', tags: ['tech'], xp: 45 },
  { id: 't3', key: 'Prečítaj si IT článok (Medium/Dev.to)', tags: ['tech', 'lifestyle'], xp: 20 },
  { id: 't4', key: 'Zálohuj si dôležité súbory', tags: ['tech', 'productivity'], xp: 30 },
  { id: 't5', key: 'Upratať plochu na počítači', tags: ['tech', 'productivity'], xp: 15 },
  { id: 't6', key: 'Nakonfiguruj si nový Linux nástroj', tags: ['tech'], xp: 60 },
  { id: 't7', key: 'Pozri si 1 tutoriál o programovaní', tags: ['tech'], xp: 35 },
  // Fitness
  { id: 'f1', key: '100 kľukov', tags: ['fitness'], xp: 40 },
  { id: 'f2', key: 'Choď do gymu (Leg day)', tags: ['fitness'], xp: 70 },
  { id: 'f3', key: 'Choď do gymu (Upper body)', tags: ['fitness'], xp: 70 },
  { id: 'f4', key: '10 minút strečing', tags: ['fitness', 'lifestyle'], xp: 20 },
  { id: 'f5', key: 'Urob si 30 drepov', tags: ['fitness'], xp: 25 },
  { id: 'f6', key: 'Zabehni 3 kilometre', tags: ['fitness', 'outdoor'], xp: 60 },
  { id: 'f7', key: 'Vypi 3 litre vody', tags: ['fitness', 'lifestyle'], xp: 30 },
  // Maker / 3D Print / Moto
  { id: 'm1', key: 'Navrhni súčiastku vo Fusion 360', tags: ['maker', 'tech'], xp: 55 },
  { id: 'm2', key: 'Vytlač 3D model', tags: ['maker'], xp: 40 },
  { id: 'm3', key: 'Vyčisti a namaž reťaz na motorke', tags: ['maker', 'outdoor'], xp: 50 },
  { id: 'm4', key: 'Kalibrácia 3D tlačiarne', tags: ['maker'], xp: 35 },
  // Outdoor & Social
  { id: 'o1', key: 'Urbex Fotka (Nové miesto)', tags: ['outdoor', 'creative'], xp: 60 },
  { id: 'o2', key: 'Choď von na bicykel', tags: ['outdoor', 'fitness'], xp: 50 },
  { id: 'o3', key: 'Stráv 30 minút na slnku bez mobilu', tags: ['outdoor', 'lifestyle'], xp: 30 },
  { id: 's1', key: 'Napíš kamošovi, s ktorým si dlho nehovoril', tags: ['social'], xp: 25 },
  { id: 's2', key: 'Choď von s kamošmi', tags: ['social'], xp: 45 },
  // Lifestyle & Productivity
  { id: 'l1', key: 'Studená sprcha (3 minúty)', tags: ['lifestyle', 'fitness'], xp: 35 },
  { id: 'l2', key: 'Prečítaj 10 strán z knihy', tags: ['productivity', 'lifestyle'], xp: 20 },
  { id: 'l3', key: 'Choď spať pred 23:00', tags: ['lifestyle', 'fitness'], xp: 40 },
  { id: 'l4', key: 'Upratať si izbu', tags: ['lifestyle', 'productivity'], xp: 30 },
  { id: 'l5', key: 'Skús meditovať 10 minút', tags: ['lifestyle'], xp: 25 },
  { id: 'l6', key: '0 hodín na TikToku / Reals', tags: ['productivity', 'lifestyle'], xp: 50 },
  { id: 'p1', key: 'Napíš si ciele na tento týždeň', tags: ['productivity'], xp: 30 },
  { id: 'p2', key: 'Urob si úlohu do školy predčasne', tags: ['productivity'], xp: 50 },
];

export default function App() {
  const [lang, setLang] = useState('sk');
  const t = DICTIONARY[lang];
  
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const [pfp, setPfp] = useState(null);
  const [userStats, setUserStats] = useState({ xp: 4550, level: 1, streak: 12, questsDone: 1 });
  const [activeSkin, setActiveSkin] = useState(SKINS[0]);
  
  const pfpInputRef = useRef(null);
  const questPhotoInputRef = useRef(null);

  const [quests, setQuests] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isolatedQuestId, setIsolatedQuestId] = useState(null);
  const [selectedQuestToComplete, setSelectedQuestToComplete] = useState(null);

  useEffect(() => {
    setUserStats(prev => ({ ...prev, level: Math.floor(prev.xp / 1000) + 1 }));
  }, [userStats.xp]);

  useEffect(() => {
    if (activeSkin.id === 'default' && userStats.level >= 5) {
      setActiveSkin(SKINS.find(s => s.id === 'cyberpunk') || SKINS[0]);
    }
  }, [userStats.level]);

  const generateQuestsForUser = (interests) => {
    let pool = MASTER_QUEST_LIBRARY;
    if (interests.length > 0) {
      pool = MASTER_QUEST_LIBRARY.filter(q => q.tags.some(tag => interests.includes(tag)));
      if (pool.length < 4) pool = MASTER_QUEST_LIBRARY;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setShowOnboarding(true);
      setIsLoggingIn(false);
    }, 1500);
  };

  const finishOnboarding = () => {
    setQuests(generateQuestsForUser(selectedInterests));
    setShowOnboarding(false);
    setIsLoggedIn(true);
  };

  const completeQuest = (photoUrl = null) => {
    if (!selectedQuestToComplete) return;
    const finalXp = selectedQuestToComplete.xp + (photoUrl ? 5 : 0);
    
    const historyItem = {
      instanceId: Date.now().toString(),
      name: selectedQuestToComplete.key || selectedQuestToComplete.name,
      xp: finalXp,
      photo: photoUrl,
      timestamp: new Date().toLocaleTimeString(),
      originalId: selectedQuestToComplete.id
    };

    setHistory([historyItem, ...history]);
    setUserStats(prev => ({ ...prev, xp: prev.xp + finalXp, questsDone: prev.questsDone + 1 }));
    setQuests(quests.filter(q => q.id !== selectedQuestToComplete.id));
    setSelectedQuestToComplete(null);
  };

  const toggleFavorite = (historyItem) => {
    if (favorites.some(f => f.instanceId === historyItem.instanceId)) {
      setFavorites(favorites.filter(f => f.instanceId !== historyItem.instanceId));
    } else {
      setFavorites([...favorites, historyItem]);
    }
  };

  const toggleInterest = (tag) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(i => i !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const cText = `text-${activeSkin.color}`;
  const cBorder = `border-${activeSkin.color}`;
  const cBg = `bg-${activeSkin.color}`;

  if (!isLoggedIn && !showOnboarding) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-200">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full max-w-sm">
          <Trophy size={64} className="text-sky-400 mb-8 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
          <h1 className="text-4xl font-serif text-white mb-2">Side Quest</h1>
          <p className="text-neutral-400 mb-12">Level up in real life.</p>
          <button onClick={handleGoogleLogin} className="w-full bg-white text-black font-medium py-4 px-8 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform mb-4">
            {isLoggingIn ? <RefreshCw className="animate-spin text-neutral-500" /> : <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />}
            {isLoggingIn ? (lang === 'sk' ? "Pripájam..." : "Connecting...") : t.signIn}
          </button>
        </motion.div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col p-6 text-neutral-200 pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 w-full max-w-md mx-auto flex flex-col">
          <h1 className="text-3xl font-serif text-sky-400 mb-3">{t.welcome}</h1>
          <p className="text-neutral-400 mb-8">{t.onboardingDesc}</p>
          
          <div className="flex-1 flex content-start flex-wrap gap-3 mb-10 overflow-y-auto">
            {Object.entries(t.interests).map(([tag, label]) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <button 
                  key={tag} 
                  onClick={() => toggleInterest(tag)}
                  className={`px-4 py-3 rounded-xl border transition-all active:scale-95 ${isSelected ? 'border-sky-400 bg-sky-400/10 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'border-neutral-800 bg-neutral-900 text-neutral-400'}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button onClick={finishOnboarding} className="w-full bg-sky-500 text-white font-medium py-4 px-8 rounded-xl active:scale-95 transition-transform mt-auto mb-8 shadow-lg shadow-sky-500/20">
            {t.continue}
          </button>
        </motion.div>
      </div>
    );
  }

  const renderHome = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 pb-24">
      <div className="flex justify-between items-end border-b border-neutral-800 pb-2">
        <h2 className={`text-2xl font-serif ${cText}`}>{t.home}</h2>
        <button onClick={() => setQuests(generateQuestsForUser(selectedInterests))} className={`text-sm text-neutral-400 flex items-center gap-1 active:${cText} transition-colors`}>
          <RefreshCw size={14} /> {t.refresh}
        </button>
      </div>
      <div className="space-y-4">
        {quests.length === 0 && <p className="text-neutral-500 text-center py-10">Všetky questy splnené. Skús obnoviť zoznam!</p>}
        {quests.map(q => (
          <motion.div whileTap={{ scale: 0.98 }} key={q.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center shadow-lg">
            <span className="font-medium text-white">{q.name || q.key}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-400">+{q.xp} XP</span>
              <button onClick={() => setSelectedQuestToComplete(q)} className={`w-8 h-8 rounded-full border-2 ${cBorder} active:bg-${activeSkin.color}/20 transition-colors shrink-0`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderHistory = () => {
    let displayedHistory = history;
    if (isolatedQuestId) {
      displayedHistory = history.filter(h => h.instanceId === isolatedQuestId);
    } else if (searchQuery) {
      displayedHistory = history.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 pb-24">
        <h2 className={`text-2xl font-serif ${cText}`}>{t.history}</h2>
        {!isolatedQuestId ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input type="text" placeholder={t.searchHistory} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:${cBorder} transition-colors`} />
          </div>
        ) : (
          <div className={`bg-${activeSkin.color}/10 border border-${activeSkin.color}/30 rounded-xl p-3 flex justify-between items-center`}>
            <span className={`text-sm ${cText}`}>{t.isolatedView}</span>
            <button onClick={() => setIsolatedQuestId(null)} className="text-sm text-neutral-300 hover:text-white bg-neutral-800 px-3 py-1 rounded-lg">{t.cancelFilter}</button>
          </div>
        )}
        <div className="space-y-4">
          {displayedHistory.length === 0 ? (
            <p className="text-center text-neutral-500 pt-10">{t.noHistory}</p>
          ) : (
            displayedHistory.map(h => (
              <div key={h.instanceId} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="pr-4">
                    <h3 className="font-medium text-white">{h.name}</h3>
                    <p className="text-xs text-neutral-500">{h.timestamp} • +{h.xp} XP</p>
                  </div>
                  <button onClick={() => toggleFavorite(h)} className="shrink-0">
                    <Star size={20} className={favorites.some(f => f.instanceId === h.instanceId) ? `fill-${activeSkin.color} ${cText}` : "text-neutral-600"} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans px-6 pt-12 relative overflow-hidden">
      <div className="flex justify-between items-center mb-10 relative z-10">
        <button onClick={() => setIsFavoritesOpen(true)} className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center bg-neutral-900 shadow-lg active:scale-95 transition-transform">
          <Trophy size={18} className={cText} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-serif italic text-white tracking-wider">lvl <span className="text-4xl not-italic ml-1">{userStats.level}</span></h1>
        </div>
        <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 rounded-full border border-neutral-800 overflow-hidden bg-neutral-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
          {pfp ? <img src={pfp} className="w-full h-full object-cover"/> : <User size={18} className="text-neutral-500" />}
        </button>
      </div>

      <div className="w-full bg-neutral-900 h-3 rounded-full mb-10 relative z-10 overflow-hidden border border-neutral-800 shadow-inner">
        <motion.div initial={{ width: 0 }} animate={{ width: `${((userStats.xp % 1000) / 1000) * 100}%` }} transition={{ duration: 1 }} className={`bg-gradient-to-r ${activeSkin.gradient} h-full rounded-full`} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && <RenderWrapper key="home">{renderHome()}</RenderWrapper>}
        {activeTab === 'history' && <RenderWrapper key="history">{renderHistory()}</RenderWrapper>}
        {activeTab === 'friends' && (
          <RenderWrapper key="friends">
            <div className="space-y-6 pb-24">
              <h2 className={`text-2xl font-serif ${cText}`}>{t.friends}</h2>
              <div className="space-y-3">
                {['Rišo', 'Samo', 'Tomáš'].map((name, i) => (
                  <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                        <User size={18} className="text-neutral-500"/>
                      </div>
                      <span className="font-medium text-white">{name}</span>
                    </div>
                    <button className={`${cText} p-2 bg-${activeSkin.color}/10 rounded-lg active:scale-95 transition-transform`}><Swords size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </RenderWrapper>
        )}
        {activeTab === 'leaderboard' && (
          <RenderWrapper key="leaderboard">
            <div className="space-y-6 pb-24">
              <h2 className={`text-2xl font-serif ${cText}`}>{t.leaderboard}</h2>
              <div className="space-y-3">
                {[
                  { name: 'Rišo', xp: 51200 },
                  { name: 'Samo', xp: 45000 },
                  { name: `Maxim (${t.you})`, xp: userStats.xp, isMe: true },
                  { name: 'Tomáš', xp: 3200 }
                ].sort((a,b) => b.xp - a.xp).map((user, idx) => (
                  <div key={idx} className={`bg-neutral-900 border ${user.isMe ? cBorder : 'border-neutral-800'} rounded-xl p-4 flex justify-between items-center shadow-lg`}>
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-500 font-serif">#{idx + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center">
                         {user.isMe && pfp ? <img src={pfp} className="w-full h-full object-cover"/> : <User size={14} className="text-neutral-500"/>}
                      </div>
                      <span className={user.isMe ? "font-bold text-white" : "text-neutral-300"}>{user.name}</span>
                    </div>
                    <span className={`text-sm ${cText}`}>{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </RenderWrapper>
        )}
        {activeTab === 'custom' && (
          <RenderWrapper key="custom">
            <div className="space-y-6 pb-24">
               <h2 className={`text-2xl font-serif ${cText}`}>{t.newQuest}</h2>
               <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-4 shadow-lg">
                 <input type="text" placeholder={t.questName} className={`w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:${cBorder} outline-none transition-colors`} id="customQName"/>
                 <button onClick={() => {
                     const name = document.getElementById('customQName').value || 'Custom Quest';
                     const randomXp = Math.floor(Math.random() * (60 - 15 + 1)) + 15;
                     setQuests([{ id: Date.now().toString(), key: name, xp: randomXp, custom: true }, ...quests]);
                     setActiveTab('home');
                   }}
                   className={`w-full text-white py-3 rounded-lg font-medium active:scale-95 transition-transform shadow-lg shadow-${activeSkin.color}/20`}
                   style={{ backgroundColor: activeSkin.hex }}
                 >
                   {t.addQuest}
                 </button>
               </div>
            </div>
          </RenderWrapper>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileOpen && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-50 bg-neutral-950 flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-10 mt-4">
              <h2 className={`text-3xl font-serif ${cText}`}>{t.profile}</h2>
              <button onClick={() => setIsProfileOpen(false)}><X className="text-neutral-400" size={32}/></button>
            </div>
            <div className="flex flex-col items-center mb-10 relative group">
              <div onClick={() => pfpInputRef.current?.click()} className="w-32 h-32 rounded-full border-4 border-neutral-800 overflow-hidden relative cursor-pointer flex items-center justify-center bg-neutral-900">
                {pfp ? <img src={pfp} alt="Profile" className="w-full h-full object-cover" /> : <User size={48} className="text-neutral-600" />}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold tracking-widest text-white">{t.change}</span>
                </div>
              </div>
              <input type="file" ref={pfpInputRef} onChange={handlePfpUpload} className="hidden" accept="image/*" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center">
                <span className="text-xs text-neutral-500 mb-1">{t.totalXp}</span>
                <span className={`text-2xl font-medium ${cText}`}>{userStats.xp}</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center">
                <span className="text-xs text-neutral-500 mb-1">{t.lvl}</span>
                <span className="text-2xl font-medium text-white">{userStats.level}</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center">
                <span className="text-xs text-neutral-500 mb-1">{t.questsDone}</span>
                <span className="text-2xl font-medium text-white">{userStats.questsDone}</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col items-center">
                <span className="text-xs text-neutral-500 mb-1">{t.dailyStreak}</span>
                <span className={`text-2xl font-medium ${cText}`}>{userStats.streak}</span>
              </div>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex justify-between items-center mb-8">
              <span className="text-neutral-300">{t.lang}</span>
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className={`bg-neutral-950 border border-neutral-700 ${cText} rounded-lg px-3 py-1 outline-none focus:${cBorder}`}
              >
                <option value="sk">Slovenčina</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="mb-8 space-y-3">
              <h3 className="text-neutral-400 font-medium mb-4">{t.skins}</h3>
              {SKINS.map(skin => (
                <button 
                  key={skin.id}
                  disabled={userStats.level < skin.unlockLevel}
                  onClick={() => setActiveSkin(skin)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between border ${activeSkin.id === skin.id ? cBorder + ' bg-neutral-900' : 'border-neutral-800 bg-neutral-900/50'} ${userStats.level < skin.unlockLevel ? 'opacity-50 grayscale' : 'active:scale-95 transition-all'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${skin.gradient}`} />
                    <span className={userStats.level < skin.unlockLevel ? "text-neutral-500" : "text-white"}>{skin.name}</span>
                  </div>
                  {userStats.level < skin.unlockLevel && <span className="text-xs text-neutral-500">{t.unlocksAt} {skin.unlockLevel}</span>}
                </button>
              ))}
            </div>

            <button onClick={() => { setIsLoggedIn(false); setShowOnboarding(false); }} className="mt-auto mb-8 w-full border border-red-900/30 bg-red-900/10 text-red-500 py-4 rounded-xl flex justify-center items-center gap-2 font-medium active:scale-95 transition-transform">
              <LogOut size={18} />
              {t.signOut}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFavoritesOpen && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-50 bg-neutral-950 flex flex-col p-6">
            <div className="flex justify-between items-center mb-8 mt-4">
              <h2 className={`text-2xl font-serif ${cText}`}>{t.favorites}</h2>
              <button onClick={() => setIsFavoritesOpen(false)}><X className="text-neutral-400" size={28}/></button>
            </div>
            <div className="space-y-4 overflow-y-auto">
              {favorites.length === 0 ? <p className="text-neutral-500 text-center pt-10">Zatiaľ žiadne obľúbené.</p> : null}
              {favorites.map(f => (
                <div key={f.instanceId} className="bg-neutral-900 p-4 rounded-xl flex justify-between items-center border border-neutral-800">
                  <div>
                    <h3 className="font-medium text-white">{f.name}</h3>
                    <p className="text-xs text-neutral-500">{f.timestamp}</p>
                  </div>
                  <button onClick={() => handleShowFavorite(f.instanceId)} className={`bg-${activeSkin.color}/20 ${cText} px-4 py-1.5 rounded-lg text-sm active:scale-95 transition-transform`}>{t.show}</button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedQuestToComplete && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 bg-black/80 z-50 flex items-end p-4 pb-24 backdrop-blur-sm">
            <div className="bg-neutral-900 w-full rounded-3xl p-6 border border-neutral-800 space-y-4 shadow-2xl">
              <h3 className="text-xl text-white font-medium text-center mb-6">{selectedQuestToComplete.key || selectedQuestToComplete.name}</h3>
              <button onClick={() => completeQuest()} className={`w-full py-4 rounded-xl text-white font-medium active:scale-95 transition-transform shadow-lg shadow-${activeSkin.color}/20`} style={{ backgroundColor: activeSkin.hex }}>
                {t.completeQuest}
              </button>
              <button onClick={() => setSelectedQuestToComplete(null)} className="w-full py-2 text-neutral-500 text-sm mt-2">Zrušiť</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-900 flex justify-around items-center px-4 z-40">
        <button onClick={() => setActiveTab('home')} className={`p-3 transition-colors ${activeTab === 'home' ? cText : 'text-neutral-600'}`}><Home size={24} /></button>
        <button onClick={() => setActiveTab('friends')} className={`p-3 transition-colors ${activeTab === 'friends' ? cText : 'text-neutral-600'}`}><Users size={24} /></button>
        <button onClick={() => setActiveTab('custom')} className={`w-14 h-14 rounded-full flex items-center justify-center text-black -translate-y-5 shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95 transition-transform`} style={{ backgroundColor: activeSkin.hex }}><Plus size={30} /></button>
        <button onClick={() => setActiveTab('leaderboard')} className={`p-3 transition-colors ${activeTab === 'leaderboard' ? cText : 'text-neutral-600'}`}><Globe size={24} /></button>
        <button onClick={() => setActiveTab('history')} className={`p-3 transition-colors ${activeTab === 'history' ? cText : 'text-neutral-600'}`}><CheckCircle size={24} /></button>
      </div>
    </div>
  );
}

const RenderWrapper = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
);
