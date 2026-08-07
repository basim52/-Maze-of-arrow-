import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Plus, RefreshCw, Sparkles, User, Search, Trash2, Send, CheckCircle2, UserCheck, MessageSquare, HelpCircle, Info } from 'lucide-react';
import { Friend, TradeItem, TradeOffer, ItemType } from '../types';
import { soundManager } from '../utils/sound';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  friends: Friend[];
  selectedFriendForTrade?: Friend | null;
  coins: number;
  thunders: number;
  hammers: number;
  cakes: number;
  creams: number;
  chocolates: number;
  spaceCreams: number;
  onExecuteTrade: (
    givenItems: TradeItem[],
    receivedItems: TradeItem[],
    offerTitle: string
  ) => boolean;
}

const AVAILABLE_ITEMS: { type: ItemType; labelAr: string; labelEn: string; icon: string; color: string }[] = [
  { type: 'coins', labelAr: 'نقاط', labelEn: 'Coins', icon: '🪙', color: 'from-amber-500 to-yellow-500' },
  { type: 'thunders', labelAr: 'عملات رعد', labelEn: 'Thunder', icon: '⚡', color: 'from-sky-400 to-indigo-500' },
  { type: 'cakes', labelAr: 'كعك كاب كيك', labelEn: 'Cakes', icon: '🎂', color: 'from-pink-500 to-rose-500' },
  { type: 'hammers', labelAr: 'مطارق سحرية', labelEn: 'Hammers', icon: '🔨', color: 'from-orange-500 to-amber-600' },
  { type: 'creams', labelAr: 'كريمة سحرية', labelEn: 'Creams', icon: '🍦', color: 'from-teal-400 to-emerald-500' },
  { type: 'chocolates', labelAr: 'شوكولاتة سحرية', labelEn: 'Chocolates', icon: '🍫', color: 'from-amber-800 to-yellow-950' },
  { type: 'spaceCreams', labelAr: 'كريمة فضائية', labelEn: 'Space Creams', icon: '🍦✨', color: 'from-purple-500 to-indigo-600' },
];

interface SearchedPlayer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  isOnline: boolean;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  language,
  friends,
  selectedFriendForTrade,
  coins,
  thunders,
  hammers,
  cakes,
  creams,
  chocolates,
  spaceCreams,
  onExecuteTrade,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'searchInvite' | 'myOffers'>('searchInvite');

  // Search Input and Searched Player State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchedPlayer, setSearchedPlayer] = useState<SearchedPlayer | null>(null);

  // Invite & Room State
  const [invitationStatus, setInvitationStatus] = useState<'idle' | 'sending' | 'accepted' | 'connected'>('idle');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  // Offers history
  const [marketOffers, setMarketOffers] = useState<TradeOffer[]>(() => {
    try {
      const saved = localStorage.getItem('player_trade_offers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('player_trade_offers', JSON.stringify(marketOffers));
    } catch (e) {}
  }, [marketOffers]);

  // Trade Form Items State
  const [offeredType, setOfferedType] = useState<ItemType>('cakes');
  const [offeredAmount, setOfferedAmount] = useState<number>(1);

  const [requestedType, setRequestedType] = useState<ItemType>('hammers');
  const [requestedAmount, setRequestedAmount] = useState<number>(2);

  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  // Automatically update suggested counter-item based on what user offers
  useEffect(() => {
    if (offeredType === 'cakes') {
      setRequestedType('hammers');
      setRequestedAmount(offeredAmount * 2);
    } else if (offeredType === 'hammers') {
      setRequestedType('thunders');
      setRequestedAmount(offeredAmount * 25);
    } else if (offeredType === 'thunders') {
      setRequestedType('creams');
      setRequestedAmount(Math.max(1, Math.floor(offeredAmount / 15)));
    } else if (offeredType === 'coins') {
      setRequestedType('chocolates');
      setRequestedAmount(Math.max(1, Math.floor(offeredAmount / 35)));
    } else if (offeredType === 'creams') {
      setRequestedType('cakes');
      setRequestedAmount(offeredAmount * 1);
    } else if (offeredType === 'chocolates') {
      setRequestedType('hammers');
      setRequestedAmount(offeredAmount * 1);
    } else if (offeredType === 'spaceCreams') {
      setRequestedType('thunders');
      setRequestedAmount(offeredAmount * 50);
    }
  }, [offeredType, offeredAmount]);

  // Prefill when selectedFriendForTrade changes or modal opens
  useEffect(() => {
    if (selectedFriendForTrade && isOpen) {
      const p: SearchedPlayer = {
        id: selectedFriendForTrade.id,
        name: selectedFriendForTrade.name,
        avatar: selectedFriendForTrade.avatar || '🤝',
        level: selectedFriendForTrade.level || 12,
        isOnline: true,
      };
      setSearchQuery(selectedFriendForTrade.name);
      setSearchedPlayer(p);
      setHasSearched(true);
      setInvitationStatus('connected');
    }
  }, [selectedFriendForTrade, isOpen]);

  if (!isOpen) return null;

  const getItemCount = (type: ItemType): number => {
    switch (type) {
      case 'coins': return coins;
      case 'thunders': return thunders;
      case 'hammers': return hammers;
      case 'cakes': return cakes;
      case 'creams': return creams;
      case 'chocolates': return chocolates;
      case 'spaceCreams': return spaceCreams;
      default: return 0;
    }
  };

  const getItemInfo = (type: ItemType) => {
    return AVAILABLE_ITEMS.find((i) => i.type === type) || AVAILABLE_ITEMS[0];
  };

  // Handle Clicking Search Button ("زر البحث")
  const handleSearchPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundManager.playClick();

    const query = searchQuery.trim().replace(/\D/g, '');
    if (!query) {
      alert(isAr ? 'يرجى كتابة كود اللاعب (أرقام فقط) للبحث عنه!' : 'Please enter player code (numbers only) to search!');
      return;
    }

    // Match existing friend or create searched player
    const matchedFriend = friends.find(
      (f) => f.id === query || f.id.includes(query)
    );

    const player: SearchedPlayer = matchedFriend
      ? {
          id: matchedFriend.id,
          name: matchedFriend.name,
          avatar: matchedFriend.avatar || '👤',
          level: matchedFriend.level || 15,
          isOnline: true,
        }
      : {
          id: query,
          name: isAr ? `لاعب (${query})` : `Player (${query})`,
          avatar: '👤',
          level: Math.floor(Math.random() * 12) + 8,
          isOnline: true,
        };

    setSearchedPlayer(player);
    setHasSearched(true);
    setInvitationStatus('idle');
    setInviteSuccessMsg(null);
  };

  // Handle Clicking Invite Button ("زر دعوة")
  const handleSendInvitation = () => {
    if (!searchedPlayer) return;
    soundManager.playClick();

    setInvitationStatus('sending');
    setInviteSuccessMsg(
      isAr
        ? `جاري إرسال دعوة التبادل المباشرة إلى [${searchedPlayer.name}]... 📩`
        : `Sending live trade invitation to [${searchedPlayer.name}]... 📩`
    );

    // Simulated instant arrival and auto-acceptance from invited player!
    setTimeout(() => {
      soundManager.playVictory();
      setInvitationStatus('connected');
      setInviteSuccessMsg(
        isAr
          ? `وصلت الدعوة بنجاح! وقَبِل [${searchedPlayer.name}] الدعوة تلقائياً 🤝✨ تم فتح غرفة التبادل!`
          : `Invitation delivered! [${searchedPlayer.name}] accepted automatically! 🤝✨ Trade room open!`
      );
    }, 1000);
  };

  // Handle Confirming Trade Execution inside Trade Room
  const handleConfirmLiveTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedPlayer) return;

    const available = getItemCount(offeredType);
    if (available < offeredAmount) {
      soundManager.playClick();
      alert(
        isAr
          ? `عذراً! لا تملك كمية كافية من ${getItemInfo(offeredType).labelAr} (متوفر لديك: ${available})!`
          : `Sorry! You do not have enough ${getItemInfo(offeredType).labelEn} (You have: ${available})!`
      );
      return;
    }

    soundManager.playVictory();

    // Execute trade via prop: deduct offered items, grant requested items
    const success = onExecuteTrade(
      [{ type: offeredType, amount: offeredAmount }],
      [{ type: requestedType, amount: requestedAmount }],
      searchedPlayer.name
    );

    if (success) {
      const newOffer: TradeOffer = {
        id: `TRADE-${Date.now()}`,
        senderId: 'YOU',
        senderName: searchedPlayer.name,
        senderAvatar: searchedPlayer.avatar,
        offeredItems: [{ type: offeredType, amount: offeredAmount }],
        requestedItems: [{ type: requestedType, amount: requestedAmount }],
        status: 'accepted',
        timestamp: isAr ? 'مكتمل الآن' : 'Completed just now',
      };

      setMarketOffers((prev) => [newOffer, ...prev]);
      setTradeSuccessMsg(
        isAr
          ? `🎉 تم إتمام التبادل المباشر مع [${searchedPlayer.name}] بنجاح! تم تحديث مخزونك!`
          : `🎉 Live trade with [${searchedPlayer.name}] completed successfully! Inventory updated!`
      );

      setTimeout(() => setTradeSuccessMsg(null), 4000);
    }
  };

  const handleCancelOffer = (offerId: string) => {
    soundManager.playClick();
    const offer = marketOffers.find((o) => o.id === offerId);
    if (offer && offer.status === 'pending') {
      const offered = offer.offeredItems[0];
      onExecuteTrade([], [{ type: offered.type, amount: offered.amount }], 'إلغاء التبادل');
    }
    setMarketOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 border-2 border-emerald-400/80 text-white w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/20 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-md border border-emerald-300/40">
              🔄
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white">
                {isAr ? 'نظام التبادل والمقايضة المباشر' : 'Direct Player Exchange'}
              </h2>
              <p className="text-[11px] text-emerald-200/80 font-medium">
                {isAr ? 'ابحث عن أي لاعب، أرسل له دعوة وسيعود بالقبول فوراً للتبادل! 🤝' : 'Search player, send invitation & trade items live! 🤝'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inventory Summary Bar */}
        <div className="mx-4 mt-3 p-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-around text-[11px] font-bold text-emerald-200 flex-wrap gap-2">
          <span className="flex items-center gap-1">🪙 {coins}</span>
          <span className="flex items-center gap-1">⚡ {thunders}</span>
          <span className="flex items-center gap-1">🔨 {hammers}</span>
          <span className="flex items-center gap-1">🎂 {cakes}</span>
          <span className="flex items-center gap-1">🍦 {creams}</span>
          <span className="flex items-center gap-1">🍫 {chocolates}</span>
          <span className="flex items-center gap-1">🍦✨ {spaceCreams}</span>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-emerald-500/20 px-4 mt-3 gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('searchInvite');
            }}
            className={`flex-1 py-2 rounded-t-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'searchInvite'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isAr ? 'البحث والدعوة المباشرة 🔍' : 'Search & Invite'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('myOffers');
            }}
            className={`flex-1 py-2 rounded-t-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'myOffers'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? `سجل التبادلات (${marketOffers.length})` : `Trade Log (${marketOffers.length})`}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          
          {tradeSuccessMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 font-black text-xs text-center animate-bounce">
              {tradeSuccessMsg}
            </div>
          )}

          {/* TAB 1: Search & Invite Flow */}
          {activeTab === 'searchInvite' && (
            <div className="space-y-4">
              
              {/* SEARCH INPUT BAR WITH Explicit SEARCH BUTTON ("زر البحث") */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 space-y-2">
                <label className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'ابحث بكود اللاعب للتبادل (أرقام فقط):' : 'Search Player Code (numbers only):'}</span>
                </label>

                <form onSubmit={handleSearchPlayer} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ''))}
                      placeholder={isAr ? 'أدخل كود اللاعب الرقمي (مثال: 582910)...' : 'Enter numeric player code (e.g. 582910)...'}
                      className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-300 font-mono tracking-wider"
                    />
                  </div>

                  {/* Explicit SEARCH BUTTON ("زر البحث") */}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isAr ? 'بحث' : 'Search'}</span>
                  </button>
                </form>

                {/* Quick Friends Select Shortcut */}
                {friends.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto custom-scrollbar">
                    <span className="text-[10px] text-slate-400 shrink-0">{isAr ? 'أو اختر صديق:' : 'Or choose friend:'}</span>
                    {friends.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setSearchQuery(f.name);
                          const player: SearchedPlayer = {
                            id: f.id,
                            name: f.name,
                            avatar: f.avatar || '👤',
                            level: f.level || 10,
                            isOnline: true,
                          };
                          setSearchedPlayer(player);
                          setHasSearched(true);
                          setInvitationStatus('idle');
                        }}
                        className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-[10px] text-emerald-200 font-bold shrink-0 cursor-pointer"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SEARCH RESULT & INVITE CARD */}
              {hasSearched && searchedPlayer && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-sky-400/50 space-y-3 shadow-lg animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-xl shadow">
                        {searchedPlayer.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-xs text-white">{searchedPlayer.name}</h3>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-[10px] text-emerald-300 font-bold">
                            {isAr ? 'متصل الآن 🟢' : 'Online 🟢'}
                          </span>
                        </div>
                        <p className="text-[10px] text-sky-200/70">
                          {isAr ? `المستوى ${searchedPlayer.level} • معرّف: ${searchedPlayer.id}` : `Level ${searchedPlayer.level} • ID: ${searchedPlayer.id}`}
                        </p>
                      </div>
                    </div>

                    {/* INVITE BUTTON ("زر دعوة") */}
                    {invitationStatus === 'idle' && (
                      <button
                        type="button"
                        onClick={handleSendInvitation}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600 hover:from-sky-400 hover:to-indigo-400 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-sky-300/40"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isAr ? 'دعوة للتبادل 📩' : 'Invite to Trade 📩'}</span>
                      </button>
                    )}

                    {invitationStatus === 'sending' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/50 text-sky-200 text-xs font-bold animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-300" />
                        <span>{isAr ? 'جاري الدعوة...' : 'Inviting...'}</span>
                      </div>
                    )}

                    {invitationStatus === 'connected' && (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>{isAr ? 'متصل وغرفة التبادل مفتوحة' : 'Connected'}</span>
                      </div>
                    )}
                  </div>

                  {/* Toast/Notification when invitation arrives & accepts */}
                  {inviteSuccessMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{inviteSuccessMsg}</span>
                    </div>
                  )}
                </div>
              )}

              {/* LIVE INTERACTIVE TRADE ROOM (غرفة التبادل المباشرة مع اللاعب) */}
              {invitationStatus === 'connected' && searchedPlayer && (
                <form onSubmit={handleConfirmLiveTrade} className="p-4 rounded-2xl bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 border-2 border-emerald-400/60 space-y-3.5 shadow-2xl animate-fade-in">
                  
                  {/* Player Acceptance Chat Speech Bubble */}
                  <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-start gap-2.5">
                    <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-xs text-emerald-200">{searchedPlayer.name}:</span>
                        <span className="text-[10px] text-emerald-400">({isAr ? 'وصلت الدعوة وقُبلت' : 'Accepted Invitation'})</span>
                      </div>
                      <p className="text-xs text-emerald-100 font-medium mt-0.5">
                        {isAr
                          ? `« أهلاً بك! وصلتني دعوتك وقبلتها، اختر المواد التي تريد تقديمها وسأعطيك المكونات المقابلة فوراً! 🤝✨ »`
                          : `« Hello! Received your invite and accepted it! Select what you offer and let's trade! 🤝✨ »`}
                      </p>
                    </div>
                  </div>

                  {/* Trade Items Negotiation Board */}
                  <div className="space-y-3">
                    
                    {/* What You Offer */}
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-emerald-200">
                        <span>{isAr ? '1. ما ستقدمه أنت في التبادل:' : '1. What You Offer:'}</span>
                        <span className="text-[11px] text-amber-300">
                          (متوفر لديك: {getItemCount(offeredType)})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={offeredType}
                          onChange={(e) => setOfferedType(e.target.value as ItemType)}
                          className="bg-slate-950 border border-emerald-500/50 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          {AVAILABLE_ITEMS.map((item) => (
                            <option key={item.type} value={item.type}>
                              {item.icon} {isAr ? item.labelAr : item.labelEn}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-2 bg-slate-950 rounded-xl px-2 border border-emerald-500/50">
                          <button
                            type="button"
                            onClick={() => setOfferedAmount((a) => Math.max(1, a - 1))}
                            className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 flex items-center justify-center font-black cursor-pointer"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-black text-xs text-white">{offeredAmount}</span>
                          <button
                            type="button"
                            onClick={() => setOfferedAmount((a) => a + 1)}
                            className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 flex items-center justify-center font-black cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Swap Arrows Icon */}
                    <div className="flex items-center justify-center my-1 text-emerald-400">
                      <ArrowRightLeft className="w-5 h-5 animate-pulse" />
                    </div>

                    {/* What Invited Player Offers You */}
                    <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50 space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-indigo-200">
                        <span>{isAr ? `2. ما يقدّمه لك اللاعب [ ${searchedPlayer.name} ]:` : `2. Offered by [ ${searchedPlayer.name} ]:`}</span>
                        <span className="text-[10px] text-indigo-300 font-normal">({isAr ? 'تلقائي بناءً على العرض' : 'Auto counter-offer'})</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={requestedType}
                          onChange={(e) => setRequestedType(e.target.value as ItemType)}
                          className="bg-slate-950 border border-indigo-500/50 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          {AVAILABLE_ITEMS.map((item) => (
                            <option key={item.type} value={item.type}>
                              {item.icon} {isAr ? item.labelAr : item.labelEn}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-2 bg-slate-950 rounded-xl px-2 border border-indigo-500/50">
                          <button
                            type="button"
                            onClick={() => setRequestedAmount((a) => Math.max(1, a - 1))}
                            className="w-7 h-7 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-indigo-100 flex items-center justify-center font-black cursor-pointer"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-black text-xs text-white">{requestedAmount}</span>
                          <button
                            type="button"
                            onClick={() => setRequestedAmount((a) => a + 1)}
                            className="w-7 h-7 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-indigo-100 flex items-center justify-center font-black cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EXECUTE LIVE TRADE BUTTON */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>
                      {isAr
                        ? `تأكيد وإتمام التبادل الفوري مع [ ${searchedPlayer.name} ] 🔄`
                        : `Confirm & Complete Trade with [ ${searchedPlayer.name} ] 🔄`}
                    </span>
                  </button>

                </form>
              )}

            </div>
          )}

          {/* TAB 2: Completed / Sent Trade Offers List */}
          {activeTab === 'myOffers' && (
            <div className="space-y-3">
              {marketOffers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <div className="text-3xl">🔄</div>
                  <p className="text-xs">
                    {isAr ? 'لا توجد تبادلات سابقة حتى الآن. ابحث عن لاعب وأرسل له دعوة بسهولة!' : 'No previous trades yet. Search player and invite to trade!'}
                  </p>
                </div>
              ) : (
                marketOffers.map((offer) => {
                  const offered = offer.offeredItems[0];
                  const requested = offer.requestedItems[0];
                  const offeredInfo = getItemInfo(offered.type);
                  const requestedInfo = getItemInfo(requested.type);

                  return (
                    <div
                      key={offer.id}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 shadow-md space-y-2"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="font-black text-xs text-emerald-200">
                            {isAr ? `تبادل مع: ${offer.senderName}` : `Trade with: ${offer.senderName}`}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {offer.timestamp}
                        </span>
                      </div>

                      <div className="grid grid-cols-7 items-center gap-1 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                        <div className="col-span-3 text-center p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                          <span className="text-[10px] text-emerald-300 font-bold block mb-1">
                            {isAr ? 'قدمت أنت:' : 'You Offered:'}
                          </span>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-base">{offeredInfo.icon}</span>
                            <span className="font-black text-xs text-white">
                              {offered.amount} {isAr ? offeredInfo.labelAr : offeredInfo.labelEn}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-1 flex items-center justify-center text-emerald-400">
                          <ArrowRightLeft className="w-4 h-4" />
                        </div>

                        <div className="col-span-3 text-center p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                          <span className="text-[10px] text-indigo-300 font-bold block mb-1">
                            {isAr ? 'استلمت أنت:' : 'You Received:'}
                          </span>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-base">{requestedInfo.icon}</span>
                            <span className="font-black text-xs text-white">
                              {requested.amount} {isAr ? requestedInfo.labelAr : requestedInfo.labelEn}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-emerald-500/20 bg-slate-950/80 text-center">
          <p className="text-[10px] text-emerald-200/70">
            {isAr
              ? 'نظام التبادل المباشر: ابحث عن اللاعب ثم أرسل له عرض التبادل مباشرة!'
              : 'Direct Exchange System: Search player and send trade offer directly!'}
          </p>
        </div>

      </div>
    </div>
  );
};
