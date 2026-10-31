import React, { useState, useRef } from 'react';
import { Trophy, User, Home, Plus, Globe, Users, CheckCircle, Image as ImageIcon, Star, Search, X, RefreshCw, LogOut, Swords, Camera } from 'lucide-react';

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
    bonusEarned: "110% Bonus získaný!",
    q_coldShower: "Studená sprcha",
    q_urbex: "Urbex Fotka",
    q_3dPrint: "3D tlač - Model vo Fusion",
    q_moto: "Údržba motorky (Reťaz/Olej)",
    q_read: "Prečítať 10 strán knihy",
    q_code: "Hodina kódovania",
    q_pushups: "100 kľukov"
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
    lang: "Language / Jazyk",
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
    bonusEarned: "110% Bonus earned!",
    q_coldShower: "Cold Shower",
    q_urbex: "Urbex Photo",
    q_3dPrint: "3D Print - Fusion Model",
    q_moto: "Motorcycle Maintenance",
    q_read: "Read 10 pages",
    q_code: "One hour of coding",
    q_pushups: "100 Pushups"
  }
};

export default function App() {
  const [lang, setLang] = useState('sk');
  const t = DICTIONARY[lang];

  const [activeTab, setActiveTab] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
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
  
  const fallbackQuests = [
    { id: 'fb1', key: 'q_read', xp: 20 },
    { id: 'fb2', key: 'q_code', xp: 55 },
    { id: 'fb3', key: 'q_pushups', xp: 45 },
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

  const handleRefreshQuests = () => {
    setQuests([...fallbackQuests].sort(() => 0.5 - Math.random()).slice(0, 4));
  };

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
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + finalXp,
      questsDone: prev.questsDone + 1
    }));

    if (!isCustom) {
      setQuests(quests.filter(q => q.id !== selectedQuestToComplete.id));
    }

    setSelectedQuestToComplete(null);
  };

  const handleQuestPhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      completeQuest(url);
    }
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
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-end border-b border-gray-800 pb-2">
        <h2 className="text-2xl font-serif text-[#457bc2]">{t.home}</h2>
        <button onClick={handleRefreshQuests} className="text-sm text-gray-400 flex items-center gap-1">
          <RefreshCw size={14} /> {t.refresh}
        </button>
      </div>

      <div className="space-y-4">
        {quests.map(q => (
          <div key={q.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
            <span className="font-medium">{t[q.key]}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">+{q.xp} XP</span>
              <button onClick={() => setSelectedQuestToComplete(q)} className="w-8 h-8 rounded-full border-2 border-[#457bc2] hover:bg-[#457bc2]/20 transition-colors" />
            </div>
          </div>
        ))}
        {customQuests.map(q => (
          <div key={q.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#457bc2]">{q.name}</span>
              <span className="text-xs text-[#457bc2]">+{q.xp} XP / den</span>
            </div>
            <div className="flex gap-2">
              {q.days.map((day, idx) => (
                <div key={idx} onClick={() => setSelectedQuestToComplete({...q, custom: true})} className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-xs text-gray-400 hover:border-[#457bc2] cursor-pointer">
                  {day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => {
    let displayedHistory = history;

    if (isolatedQuestId) {
      displayedHistory = history.filter(h => h.instanceId === isolatedQuestId);
    } else if (searchQuery) {
      displayedHistory = history.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return (
      <div className="space-y-6 pb-24">
        <h2 className="text-2xl font-serif text-[#457bc2]">{t.history}</h2>
        
        {!isolatedQuestId ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder={t.searchHistory}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#457bc2]"
            />
          </div>
        ) : (
          <div className="bg-[#457bc2]/10 border border-[#457bc2]/30 rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-[#457bc2]">{t.isolatedView}</span>
            <button onClick={() => setIsolatedQuestId(null)} className="text-sm text-gray-300 hover:text-white bg-gray-800 px-3 py-1 rounded-lg">
              {t.cancelFilter}
            </button>
          </div>
        )}

        {displayedHistory.length === 0 ? (
          <p className="text-center text-gray-500 pt-10">{t.noHistory}</p>
        ) : (
          <div className="space-y-4">
            {displayedHistory.map(h => (
              <div key={h.instanceId} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-white">{h.name}</h3>
                    <p className="text-xs text-gray-500">{h.timestamp} • +{h.xp} XP</p>
                  </div>
                  <button onClick={() => toggleFavorite(h)}>
                    <Star size={20} className={favorites.some(f => f.instanceId === h.instanceId) ? "fill-[#457bc2] text-[#457bc2]" : "text-gray-600"} />
                  </button>
                </div>
                {h.photo && (
                  <div className="mt-3 w-full h-48 rounded-lg overflow-hidden border border-gray-800 relative">
                    <img src={h.photo} alt="Quest" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFavoritesModal = () => {
    if (!isFavoritesOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col p-6">
        <div className="flex justify-between items-center mb-8 mt-4">
          <h2 className="text-2xl font-serif text-[#457bc2]">{t.favorites}</h2>
          <button onClick={() => setIsFavoritesOpen(false)}><X className="text-gray-400" size={28}/></button>
        </div>
        <div className="space-y-4 overflow-y-auto">
          {favorites.map(f => (
            <div key={f.instanceId} className="bg-gray-900 p-4 rounded-xl flex justify-between items-center border border-gray-800">
              <div>
                <h3 className="font-medium text-white">{f.name}</h3>
                <p className="text-xs text-gray-500">{f.timestamp}</p>
              </div>
              <button 
                onClick={() => handleShowFavorite(f.instanceId)}
                className="bg-[#457bc2]/20 text-[#457bc2] px-4 py-1.5 rounded-lg text-sm"
              >
                {t.show}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfileFullscreen = () => {
    if (!isProfileOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-10 mt-4">
          <h2 className="text-3xl font-serif text-[#457bc2]">{t.profile}</h2>
          <button onClick={() => setIsProfileOpen(false)}><X className="text-gray-400" size={32}/></button>
        </div>
        
        <div className="flex flex-col items-center mb-10 relative group">
          <div 
            onClick={() => pfpInputRef.current?.click()}
            className="w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden relative cursor-pointer flex items-center justify-center bg-gray-900"
          >
            {pfp ? (
              <img src={pfp} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-600" />
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-bold tracking-widest text-white">{t.change}</span>
            </div>
          </div>
          <input type="file" ref={pfpInputRef} onChange={handlePfpUpload} className="hidden" accept="image/*" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{t.totalXp}</span>
            <span className="text-2xl font-medium text-[#457bc2]">{userStats.xp}</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{t.lvl}</span>
            <span className="text-2xl font-medium text-white">{userStats.level}</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{t.questsDone}</span>
            <span className="text-2xl font-medium text-white">{userStats.questsDone}</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{t.dailyStreak}</span>
            <span className="text-2xl font-medium text-[#457bc2]">{userStats.streak}</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-center mb-8">
          <span className="text-gray-300">{t.lang}</span>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-black border border-gray-700 text-[#457bc2] rounded-lg px-3 py-1 outline-none"
          >
            <option value="sk">Slovenčina</option>
            <option value="en">English</option>
          </select>
        </div>

        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="mt-auto mb-8 w-full border border-red-900/30 bg-red-900/10 text-red-500 py-4 rounded-xl flex justify-center items-center gap-2 font-medium"
        >
          <LogOut size={18} />
          {isLoggedIn ? t.signOut : t.signIn}
        </button>
      </div>
    );
  };

  const renderFriends = () => (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-serif text-[#457bc2]">{t.friends}</h2>
      <div className="space-y-3">
        {['Rišo', 'Samo', 'Tomáš'].map((name, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <User size={18} className="text-gray-500"/>
              </div>
              <span className="font-medium">{name}</span>
            </div>
            <button onClick={() => setChallengeModal({ open: true, friend: name })} className="text-[#457bc2] p-2 bg-[#457bc2]/10 rounded-lg">
              <Swords size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans px-6 pt-12 relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <button onClick={() => setIsFavoritesOpen(true)} className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gray-900">
          <Trophy size={18} className="text-[#457bc2]" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-serif italic text-white tracking-wider">lvl <span className="text-4xl not-italic ml-1">{userStats.level}</span></h1>
        </div>
        <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 rounded-full border border-gray-800 overflow-hidden bg-gray-900 flex items-center justify-center">
          {pfp ? <img src={pfp} className="w-full h-full object-cover"/> : <User size={18} className="text-gray-500" />}
        </button>
      </div>

      <div className="w-full bg-gray-900 h-3 rounded-full mb-10 relative z-10 overflow-hidden border border-gray-800">
        <div className="bg-gradient-to-r from-[#2c5282] to-[#457bc2] h-full rounded-full" style={{ width: `${(userStats.xp / 7000) * 100}%` }}></div>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white/50">
          {userStats.xp} / 7000 xp
        </div>
      </div>

      {activeTab === 'home' && renderHome()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'friends' && renderFriends()}
      
      {activeTab === 'leaderboard' && (
        <div className="space-y-6 pb-24">
          <h2 className="text-2xl font-serif text-[#457bc2]">{t.leaderboard}</h2>
          <div className="space-y-3">
            {[
              { name: 'Rišo', xp: 51200 },
              { name: 'Samo', xp: 45000 },
              { name: `Maxim (${t.you})`, xp: userStats.xp, isMe: true },
              { name: 'Tomáš', xp: 3200 }
            ].sort((a,b) => b.xp - a.xp).map((user, idx) => (
              <div key={idx} className={`bg-gray-900 border ${user.isMe ? 'border-[#457bc2]' : 'border-gray-800'} rounded-xl p-4 flex justify-between items-center`}>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-serif">#{idx + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                     {user.isMe && pfp ? <img src={pfp} className="w-full h-full object-cover"/> : <User size={14} className="text-gray-500"/>}
                  </div>
                  <span className={user.isMe ? "font-bold text-white" : "text-gray-300"}>{user.name}</span>
                </div>
                <span className="text-sm text-[#457bc2]">{user.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-6 pb-24">
           <h2 className="text-2xl font-serif text-[#457bc2]">{t.newQuest}</h2>
           <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
             <input type="text" placeholder={t.questName} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-[#457bc2] outline-none" id="customQName"/>
             <button className="w-full flex items-center justify-center gap-2 text-[#457bc2] bg-[#457bc2]/10 py-3 rounded-lg border border-[#457bc2]/30">
               <Star size={16} /> {t.aiEval}
             </button>
             <button 
               onClick={() => {
                 const name = document.getElementById('customQName').value || 'Custom Quest';
                 const newQ = { id: Date.now().toString(), name, xp: Math.floor(Math.random() * 45) + 15, days: [t.days[0], t.days[2], t.days[4]] };
                 setCustomQuests([newQ, ...customQuests]);
                 setActiveTab('home');
               }}
               className="w-full bg-[#457bc2] text-white py-3 rounded-lg font-medium"
             >
               {t.addQuest}
             </button>
           </div>
        </div>
      )}

      {/* Completion Modal */}
      {selectedQuestToComplete && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end p-4 pb-24">
          <div className="bg-gray-900 w-full rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-xl text-white font-medium text-center mb-6">
              {selectedQuestToComplete.custom ? selectedQuestToComplete.name : t[selectedQuestToComplete.key]}
            </h3>
            
            <input type="file" ref={questPhotoInputRef} onChange={handleQuestPhotoUpload} className="hidden" accept="image/*" />
            
            <button onClick={() => questPhotoInputRef.current?.click()} className="w-full py-4 rounded-xl border border-[#457bc2] text-[#457bc2] flex items-center justify-center gap-2 font-medium bg-[#457bc2]/10">
              <Camera size={20} /> {t.uploadPhoto}
            </button>
            <button onClick={() => completeQuest()} className="w-full py-4 rounded-xl bg-gray-800 text-white font-medium">
              {t.skipPhoto}
            </button>
            <button onClick={() => setSelectedQuestToComplete(null)} className="w-full py-2 text-gray-500 text-sm mt-2">
              Zrušiť
            </button>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      {challengeModal.open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full rounded-2xl p-6 border border-gray-800 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-[#457bc2] font-serif">{t.challenge} {challengeModal.friend}</h3>
              <button onClick={() => setChallengeModal({open: false, friend: null})}><X size={20} className="text-gray-500"/></button>
            </div>
            
            <textarea placeholder={t.customMessage} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white h-24 resize-none focus:border-[#457bc2] outline-none"></textarea>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-lg text-sm border border-gray-700 focus:border-[#457bc2] focus:text-[#457bc2] focus:bg-[#457bc2]/10">{t.for24h}</button>
              <button className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-lg text-sm border border-gray-700 focus:border-[#457bc2] focus:text-[#457bc2] focus:bg-[#457bc2]/10">{t.forWeekend}</button>
            </div>
            
            <button onClick={() => { alert(t.challengeSent); setChallengeModal({open: false, friend: null}); }} className="w-full bg-[#457bc2] text-white py-4 rounded-xl font-medium mt-4">
              {t.sendChallenge}
            </button>
          </div>
        </div>
      )}

      {renderProfileFullscreen()}
      {renderFavoritesModal()}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-gray-900 flex justify-around items-center px-4 z-40">
        <button onClick={() => setActiveTab('home')} className={`p-3 ${activeTab === 'home' ? 'text-[#457bc2]' : 'text-gray-600'}`}><Home size={22} /></button>
        <button onClick={() => setActiveTab('friends')} className={`p-3 ${activeTab === 'friends' ? 'text-[#457bc2]' : 'text-gray-600'}`}><Users size={22} /></button>
        <button onClick={() => setActiveTab('custom')} className="w-14 h-14 rounded-full bg-[#457bc2] flex items-center justify-center text-white -translate-y-5 shadow-[0_0_20px_rgba(69,123,194,0.3)]"><Plus size={28} /></button>
        <button onClick={() => setActiveTab('leaderboard')} className={`p-3 ${activeTab === 'leaderboard' ? 'text-[#457bc2]' : 'text-gray-600'}`}><Globe size={22} /></button>
        <button onClick={() => setActiveTab('history')} className={`p-3 ${activeTab === 'history' ? 'text-[#457bc2]' : 'text-gray-600'}`}><CheckCircle size={22} /></button>
      </div>
    </div>
  );
}
