import React, { useState } from 'react';
import { X, UserPlus, Users, Search, Copy, Check, Gift, ArrowRightLeft, Sparkles, UserCheck, ShieldCheck, Heart, Edit3 } from 'lucide-react';
import { Friend } from '../types';
import { soundManager } from '../utils/sound';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  playerId: string;
  playerName: string;
  onUpdatePlayerName: (newName: string) => void;
  friends: Friend[];
  requests: Friend[];
  onAcceptRequest: (request: Friend) => void;
  onDeclineRequest: (requestId: string) => void;
  onAddFriend: (friendIdOrName: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onOpenTradeWithFriend: (friend: Friend) => void;
  onSendGift: (friend: Friend) => void;
  giftSentFriendIds: string[];
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  isOpen,
  onClose,
  language,
  playerId,
  playerName,
  onUpdatePlayerName,
  friends,
  requests,
  onAcceptRequest,
  onDeclineRequest,
  onAddFriend,
  onRemoveFriend,
  onOpenTradeWithFriend,
  onSendGift,
  giftSentFriendIds,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'myFriends' | 'add' | 'requests'>('myFriends');
  const [searchInput, setSearchInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [addInput, setAddInput] = useState('');
  
  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

  if (!isOpen) return null;

  const handleCopyId = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(playerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    soundManager.playVictory();
    onUpdatePlayerName(nameInput.trim());
    setIsEditingName(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = addInput.trim().replace(/\D/g, '');
    if (!cleanCode) {
      alert(isAr ? 'يرجى إدخال كود اللاعب يتكون من أرقام فقط!' : 'Please enter a player code with numbers only!');
      return;
    }
    soundManager.playVictory();
    onAddFriend(cleanCode);
    setAddInput('');
  };

  const filteredFriends = friends.filter((f) => {
    const q = searchInput.trim();
    if (!q) return true;
    return f.id.includes(q) || f.name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-sky-400/80 text-white w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.3)] flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-sky-500/20 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-xl shadow-md border border-sky-300/40">
              👥
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-white">
                {isAr ? 'الأصدقاء والمجتمع' : 'Friends & Community'}
              </h2>
              <p className="text-[11px] text-sky-200/80 font-medium">
                {isAr ? 'تواصل، تبادل المواد، واستقبل طلبات الأصدقاء! 🎁' : 'Connect, trade items, and receive friend requests! 🎁'}
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

        {/* Player Profile & ID Card with Edit Name Button */}
        <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/90 via-indigo-950/90 to-purple-950/90 border border-sky-400/40 space-y-2 shadow-inner">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xl shadow-xs">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">{playerName}</span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setNameInput(playerName);
                      setIsEditingName(!isEditingName);
                    }}
                    className="p-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 transition-all cursor-pointer border border-sky-400/30"
                    title={isAr ? 'تعديل اسمك' : 'Edit Your Name'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-sky-300 font-bold block leading-none font-mono">
                  {isAr ? 'كود اللاعب:' : 'ID Code:'} <span className="text-amber-300">{playerId}</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyId}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
            >
              {copiedId ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ الكود' : 'Copy ID'}</span>
                </>
              )}
            </button>
          </div>

          {/* Edit Name Form (If active) */}
          {isEditingName && (
            <form onSubmit={handleSaveName} className="flex gap-2 pt-2 border-t border-sky-500/20 animate-fade-in">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={isAr ? 'أدخل اسمك الجديد...' : 'Enter new name...'}
                className="flex-1 bg-slate-950 border border-sky-400/50 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-sm cursor-pointer"
              >
                {isAr ? 'حفظ' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </form>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-sky-500/20 px-4 mt-3 gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('myFriends');
            }}
            className={`flex-1 py-2 rounded-t-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'myFriends'
                ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isAr ? `الأصدقاء (${friends.length})` : `Friends (${friends.length})`}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('add');
            }}
            className={`flex-1 py-2 rounded-t-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'add'
                ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة لاعب' : 'Add Player'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('requests');
            }}
            className={`py-2 px-3 rounded-t-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 relative ${
              activeTab === 'requests'
                ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'الطلبات' : 'Requests'}</span>
            {requests.length > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {requests.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          
          {/* TAB 1: My Friends List */}
          {activeTab === 'myFriends' && (
            <div>
              {/* Search input */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.replace(/\D/g, ''))}
                  placeholder={isAr ? 'ابحث عن صديق بكود اللاعب (أرقام فقط)...' : 'Search friend by code (numbers only)...'}
                  className="w-full bg-slate-950/80 border border-sky-500/30 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono tracking-wider"
                />
              </div>

              {filteredFriends.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <div className="text-3xl">👥</div>
                  <p className="text-xs">
                    {isAr ? 'لا يوجد أصدقاء حالياً في القائمة. أضف أصدقاءك للبدء بالتبادل!' : 'No friends found. Add friends to start trading!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFriends.map((friend) => {
                    const isGiftSent = giftSentFriendIds.includes(friend.id);
                    return (
                      <div
                        key={friend.id}
                        className="p-3 rounded-2xl bg-slate-950/70 border border-sky-500/20 hover:border-sky-400/50 flex items-center justify-between gap-2 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-sky-400/40 flex items-center justify-center text-xl shadow-xs">
                              {friend.avatar}
                            </div>
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                                friend.status === 'online'
                                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                  : friend.status === 'ingame'
                                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse'
                                  : 'bg-slate-500'
                              }`}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-xs text-white">{friend.name}</span>
                              <span className="text-[9px] bg-sky-950 text-sky-300 font-bold px-1.5 py-0.2 rounded-md border border-sky-500/30">
                                Lvl {friend.level}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {friend.id} •{' '}
                              <span className="text-emerald-300 font-semibold">
                                {friend.status === 'online'
                                  ? isAr ? 'متصل الآن 🟢' : 'Online 🟢'
                                  : friend.status === 'ingame'
                                  ? isAr ? 'في يلعب الآن 🎮' : 'In Game 🎮'
                                  : friend.lastSeenAr || (isAr ? 'غير متصل' : 'Offline')}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          {/* Send Gift Button */}
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              onSendGift(friend);
                            }}
                            disabled={isGiftSent}
                            className={`px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                              isGiftSent
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:scale-105 active:scale-95 border border-amber-300'
                            }`}
                            title={isAr ? 'أرسل هدية اليوم (10 نقاط 🪙)' : 'Send daily gift (10 coins 🪙)'}
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                              {isGiftSent ? (isAr ? 'تم الإرسال' : 'Sent') : (isAr ? 'هدية 🎁' : 'Gift 🎁')}
                            </span>
                          </button>

                          {/* Trade button */}
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              onOpenTradeWithFriend(friend);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-300/40"
                            title={isAr ? 'مقايضة وتبادل العناصر' : 'Trade Items'}
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isAr ? 'تبادل' : 'Trade'}</span>
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              onRemoveFriend(friend.id);
                            }}
                            className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 hover:text-white transition-all cursor-pointer"
                            title={isAr ? 'إزالة من القائمة' : 'Remove friend'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Add Friend Form */}
          {activeTab === 'add' && (
            <div className="space-y-4">
              <form onSubmit={handleAddSubmit} className="space-y-2">
                <label className="text-xs font-bold text-sky-200 block">
                  {isAr ? 'أدخل كود اللاعب (أرقام فقط):' : 'Enter Player Code (numbers only):'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={addInput}
                    onChange={(e) => setAddInput(e.target.value.replace(/\D/g, ''))}
                    placeholder={isAr ? 'مثال: 582910' : 'e.g. 582910'}
                    className="flex-1 bg-slate-950/80 border border-sky-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-300 font-mono tracking-widest text-center font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة' : 'Add'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Friend Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <div className="text-3xl">🛡️</div>
                  <p className="text-xs">
                    {isAr ? 'لا توجد طلبات صداقة معلقة حالياً.' : 'No pending friend requests.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-400/60 flex items-center justify-between gap-2 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-amber-400/40 flex items-center justify-center text-xl">
                          {req.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{req.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {req.id} • Lvl {req.level}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            soundManager.playVictory();
                            onAcceptRequest(req);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xs active:scale-95 cursor-pointer"
                        >
                          {isAr ? 'قبول 🟢' : 'Accept 🟢'}
                        </button>
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onDeclineRequest(req.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 cursor-pointer"
                        >
                          {isAr ? 'رفض' : 'Decline'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Note */}
        <div className="p-3 border-t border-sky-500/20 bg-slate-950/80 text-center">
          <p className="text-[10px] text-sky-200/70 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>
              {isAr
                ? 'يمكنك التبادل وإرسال الهدايا يومياً لزيادة رصيدك من المطارق والكعك والنقاط!'
                : 'Trade and send gifts daily to boost your hammers, cakes, and coins!'}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};
