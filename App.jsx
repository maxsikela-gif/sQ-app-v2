import React, { useState, useRef } from 'react';
import { Trophy, User, Home, Plus, Globe, Users, CheckCircle, Star, Search, X, RefreshCw, LogOut, Swords, Camera } from 'lucide-react';
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
    lang: "Jazyk / Language",
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
    q_coldShower: "Studená sprcha",
    q_urbex: "Urbex Fotka",
    q_3dPrint: "3D tlač - Model vo Fusion",
    q_moto: "Údržba motorky (Reťaz/Olej)",
    q_read: "Prečítať 10 strán knihy",
    q_code: "Hodina kódovania",
    q_pushups: "100 kľukov"
  }
};

export default function App() {
  const t = DICTIONARY.sk;
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [pfp, setPfp] = useState(null);
  const [userStats, setUserStats] = useState({ xp: 4550, level: 1, streak: 12, questsDone: 1 });
  
  const pfpInputRef = useRef(null);
  const questPhotoInputRef = useRef(null);

  const defaultQuests = [
    { id: 'def1', key: 'q_coldShower', xp: 25 },
    { id: 'def2', key: 'q_urbex', xp: 60 },
    { id: 'def3', key: 'q_3dPrint', xp: 40 },
    { id: 'def4', key: 'q_moto', xp: 50 },
  ];
  
  const [quests, setQuests] = useState(defaultQuests);
  const [customQuests, setCustomQuests] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isolatedQuestId, setIsolatedQuestId] = useState(null);
  const [selectedQuestToComplete, setSelectedQuestToComplete] = useState(null);
  const [challengeModal, setChallengeModal] = useState({ open: false, friend: null });

  const handlePfpUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPfp(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoggingIn(false);
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-200">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full max-w-sm">
          <Trophy size={64} className="text-sky-400 mb-8 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
          <h1 className="text-4xl font-serif text-white mb-2">Side Quest</h1>
          <p className="text-neutral-400 mb-12">Level up in real life.</p>
          <button onClick={handleGoogleLogin} className="w-full bg-white text-black font-medium py-4 px-8 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform mb-4">
            {isLoggingIn ? <RefreshCw className="animate-spin text-neutral-500" /> : <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />}
            {isLoggingIn ? "Pripájam..." : "Prihlásiť sa cez Google"}
          </button>
          <p className="text-xs text-neutral-600 text-center">Reálne overenie vyžaduje backend. <br/>Teraz funguje ako demo kliknutie.</p>
        </motion.div>
      </div>
    );
  }

  const completeQuest = (photoUrl = null) => {
    if (!selectedQuestToComplete) return;
    const isCustom = selectedQuestToComplete.custom;
    const finalXp = selectedQuestToComplete.xp + (photoUrl ? 5 : 0);
    
    const historyItem = {
      instanceId: Date.now().toString(),
      name: isCustom ? selectedQuestToComplete.name : t[selectedQuestToComplete.key],
      xp: finalXp,
      photo: photoUrl,
      timestamp: new Date().toLocaleTimeString(),
      originalId: selectedQuestToComplete.id
    };

    setHistory([historyItem, ...history]);
    setUserStats(prev => ({ ...prev, xp: prev.xp + finalXp, questsDone: prev.questsDone + 1 }));

    if (!isCustom) setQuests(quests.filter(q => q.id !== selectedQuestToComplete.id));
    setSelectedQuestToComplete(null);
  };

  const toggleFavorite = (historyItem) => {
    if (favorites.some(f => f.instanceId === historyItem.instanceId)) {
      setFavorites(favorites.filter(f => f.instanceId !== historyItem.instanceId));
    } else {
      setFavorites([...favorites, historyItem]);
    }
  };

  const handleShowFavorite = (instanceId) => {
    setIsFavoritesOpen(false);
    setActiveTab('history');
    setIsolatedQuestId(instanceId);
    setSearchQuery('');
  };

  const renderHome = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 pb-24">
      <div className="flex justify-between items-end border-b border-neutral-800 pb-2">
        <h2 className="text-2xl font-serif text-sky-400">{t.home}</h2>
        <button onClick={() => setQuests([...defaultQuests].sort(() => 0.5 - Math.random()))} className="text-sm text-neutral-400 flex items-center gap-1 active:text-sky-400 transition-colors">
          <RefreshCw size={14} /> {t.refresh}
        </button>
      </div>
      <div className="space-y-4">
        {quests.map(q => (
          <motion.div whileTap={{ scale: 0.98 }} key={q.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center shadow-lg">
            <span className="font-medium text-white">{t[q.key]}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-400">+{q.xp} XP</span>
              <button onClick={() => setSelectedQuestToComplete(q)} className="w-8 h-8 rounded-full border-2 border-sky-400 active:bg-sky-400/20 transition-colors" />
            </div>
          </motion.div>
        ))}
        {customQuests.map(q => (
          <motion.div whileTap={{ scale: 0.98 }} key={q.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sky-400">{q.name}</span>
              <span className="text-xs text-sky-400">+{q.xp} XP / den</span>
            </div>
            <div className="flex gap-2">
              {q.days.map((day, idx) => (
                <div key={idx} onClick={() => setSelectedQuestToComplete({...q, custom: true})} className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-xs text-neutral-400 active:border-sky-400 cursor-pointer">
                  {day}
                </div>
              ))}
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
        <h2 className="text-2xl font-serif text-sky-400">{t.history}</h2>
        {!isolatedQuestId ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input type="text" placeholder={t.searchHistory} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-sky-400 transition-colors" />
          </div>
        ) : (
          <div className="bg-sky-400/10 border border-sky-400/30 rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-sky-400">{t.isolatedView}</span>
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
                  <div>
                    <h3 className="font-medium text-white">{h.name}</h3>
                    <p className="text-xs text-neutral-500">{h.timestamp} • +{h.xp} XP</p>
                  </div>
                  <button onClick={() => toggleFavorite(h)}>
                    <Star size={20} className={favorites.some(f => f.instanceId === h.instanceId) ? "fill-sky-400 text-sky-400" : "text-neutral-600"} />
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
          <Trophy size={18} className="text-sky-400" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-serif italic text-white tracking-wider">lvl <span className="text-4xl not-italic ml-1">{userStats.level}</span></h1>
        </div>
        <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 rounded-full border border-neutral-800 overflow-hidden bg-neutral-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
          {pfp ? <img src={pfp} className="w-full h-full object-cover"/> : <User size={18} className="text-neutral-500" />}
        </button>
      </div>

      <div className="w-full bg-neutral-900 h-3 rounded-full mb-10 relative z-10 overflow-hidden border border-neutral-800 shadow-inner">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(userStats.xp / 7000) * 100}%` }} transition={{ duration: 1 }} className="bg-gradient-to-r from-sky-600 to-sky-400 h-full rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && <RenderWrapper key="home">{renderHome()}</RenderWrapper>}
        {activeTab === 'history' && <RenderWrapper key="history">{renderHistory()}</RenderWrapper>}
        {activeTab === 'friends' && (
          <RenderWrapper key="friends">
            <div className="space-y-6 pb-24">
              <h2 className="text-2xl font-serif text-sky-400">{t.friends}</h2>
              <div className="space-y-3">
                {['Rišo', 'Samo', 'Tomáš'].map((name, i) => (
                  <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                        <User size={18} className="text-neutral-500"/>
                      </div>
                      <span className="font-medium text-white">{name}</span>
                    </div>
                    <button className="text-sky-400 p-2 bg-sky-400/10 rounded-lg active:scale-95 transition-transform"><Swords size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </RenderWrapper>
        )}
        {activeTab === 'leaderboard' && (
          <RenderWrapper key="leaderboard">
            <div className="space-y-6 pb-24">
              <h2 className="text-2xl font-serif text-sky-400">{t.leaderboard}</h2>
              <div className="space-y-3">
                {[
                  { name: 'Rišo', xp: 51200 },
                  { name: 'Samo', xp: 45000 },
                  { name: `Maxim (${t.you})`, xp: userStats.xp, isMe: true },
                  { name: 'Tomáš', xp: 3200 }
                ].sort((a,b) => b.xp - a.xp).map((user, idx) => (
                  <div key={idx} className={`bg-neutral-900 border ${user.isMe ? 'border-sky-400' : 'border-neutral-800'} rounded-xl p-4 flex justify-between items-center shadow-lg`}>
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-500 font-serif">#{idx + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center">
                         {user.isMe && pfp ? <img src={pfp} className="w-full h-full object-cover"/> : <User size={14} className="text-neutral-500"/>}
                      </div>
                      <span className={user.isMe ? "font-bold text-white" : "text-neutral-300"}>{user.name}</span>
                    </div>
                    <span className="text-sm text-sky-400">{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </RenderWrapper>
        )}
        {activeTab === 'custom' && (
          <RenderWrapper key="custom">
            <div className="space-y-6 pb-24">
               <h2 className="text-2xl font-serif text-sky-400">{t.newQuest}</h2>
               <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-4 shadow-lg">
                 <input type="text" placeholder={t.questName} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors" id="customQName"/>
                 <button onClick={() => {
                     const name = document.getElementById('customQName').value || 'Custom Quest';
                     setCustomQuests([{ id: Date.now().toString(), name, xp: 30, days: ["Po", "St", "Pi"] }, ...customQuests]);
                     setActiveTab('home');
                   }}
                   className="w-full bg-sky-500 text-white py-3 rounded-lg font-medium active:scale-95 transition-transform shadow-lg shadow-sky-500/20"
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
              <h2 className="text-3xl font-serif text-sky-400">{t.profile}</h2>
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
                <span className="text-2xl font-medium text-sky-400">{userStats.xp}</span>
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
                <span className="text-2xl font-medium text-sky-400">{userStats.streak}</span>
              </div>
            </div>
            <button onClick={() => setIsLoggedIn(!isLoggedIn)} className="mt-auto mb-8 w-full border border-red-900/30 bg-red-900/10 text-red-500 py-4 rounded-xl flex justify-center items-center gap-2 font-medium">
              <LogOut size={18} />
              {isLoggedIn ? t.signOut : t.signIn}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFavoritesOpen && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-50 bg-neutral-950 flex flex-col p-6">
            <div className="flex justify-between items-center mb-8 mt-4">
              <h2 className="text-2xl font-serif text-sky-400">{t.favorites}</h2>
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
                  <button onClick={() => handleShowFavorite(f.instanceId)} className="bg-sky-400/20 text-sky-400 px-4 py-1.5 rounded-lg text-sm active:scale-95 transition-transform">{t.show}</button>
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
              <h3 className="text-xl text-white font-medium text-center mb-6">{selectedQuestToComplete.custom ? selectedQuestToComplete.name : t[selectedQuestToComplete.key]}</h3>
              <button onClick={() => completeQuest()} className="w-full py-4 rounded-xl bg-sky-500 text-white font-medium active:scale-95 transition-transform shadow-lg shadow-sky-500/20">
                {t.completeQuest}
              </button>
              <button onClick={() => setSelectedQuestToComplete(null)} className="w-full py-2 text-neutral-500 text-sm mt-2">Zrušiť</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-900 flex justify-around items-center px-4 z-40">
        <button onClick={() => setActiveTab('home')} className={`p-3 transition-colors ${activeTab === 'home' ? 'text-sky-400' : 'text-neutral-600'}`}><Home size={24} /></button>
        <button onClick={() => setActiveTab('friends')} className={`p-3 transition-colors ${activeTab === 'friends' ? 'text-sky-400' : 'text-neutral-600'}`}><Users size={24} /></button>
        <button onClick={() => setActiveTab('custom')} className="w-14 h-14 rounded-full bg-sky-500 flex items-center justify-center text-white -translate-y-5 shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-95 transition-transform"><Plus size={30} /></button>
        <button onClick={() => setActiveTab('leaderboard')} className={`p-3 transition-colors ${activeTab === 'leaderboard' ? 'text-sky-400' : 'text-neutral-600'}`}><Globe size={24} /></button>
        <button onClick={() => setActiveTab('history')} className={`p-3 transition-colors ${activeTab === 'history' ? 'text-sky-400' : 'text-neutral-600'}`}><CheckCircle size={24} /></button>
      </div>
    </div>
  );
}

const RenderWrapper = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
);
