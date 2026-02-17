
import React, { useState, useCallback, useEffect } from 'react';
import { Gift, RotateCcw, History as HistoryIcon, TrendingUp, X, Sparkles, Coins, Settings } from 'lucide-react';
import { LuckyMoneySession, BagState } from './types';
import { INITIAL_BAGS_COUNT } from './constants';
import { triggerConfetti } from './components/Confetti';

const App: React.FC = () => {
  const [bags, setBags] = useState<BagState[]>([]);
  const [history, setHistory] = useState<LuckyMoneySession[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [currentReveal, setCurrentReveal] = useState<LuckyMoneySession | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings state
  const [minAmount, setMinAmount] = useState(10000);
  const [maxAmount, setMaxAmount] = useState(50000);

  // Initialize bags
  useEffect(() => {
    const initialBags = Array.from({ length: INITIAL_BAGS_COUNT }, (_, i) => ({
      id: i,
      isOpened: false,
    }));
    setBags(initialBags);
  }, []);

  const getRandomAmount = (): number => {
    // Ensure min is not greater than max
    const min = Math.min(minAmount, maxAmount);
    const max = Math.max(minAmount, maxAmount);
    
    // Generate a random number between min and max
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Round to the nearest 1000 for a realistic look
    return Math.round(randomValue / 1000) * 1000;
  };

  const openBag = useCallback(async (id: number) => {
    if (isOpening || bags.find(b => b.id === id)?.isOpened) return;

    setIsOpening(true);
    
    // Slight delay for "opening" effect feel
    setTimeout(() => {
      const amount = getRandomAmount();
      const newSession: LuckyMoneySession = {
        id: Math.random().toString(36).substr(2, 9),
        amount: amount as any,
        timestamp: Date.now(),
      };

      setBags(prev => prev.map(b => b.id === id ? { ...b, isOpened: true, content: newSession } : b));
      setHistory(prev => [newSession, ...prev]);
      setCurrentReveal(newSession);
      triggerConfetti();
      setIsOpening(false);
    }, 600);
  }, [isOpening, bags, minAmount, maxAmount]);

  const resetGame = () => {
    if (confirm("Bạn có muốn làm mới tất cả túi mù không?")) {
      setBags(prev => prev.map(b => ({ ...b, isOpened: false, content: undefined })));
      setCurrentReveal(null);
    }
  };

  const totalMoney = history.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-[#fffcf2] text-slate-800 pb-12">
      {/* Festive Header */}
      <header className="bg-red-700 text-white py-8 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-4 left-4 rotate-12"><Sparkles size={48} /></div>
          <div className="absolute bottom-4 right-4 -rotate-12"><Sparkles size={64} /></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-festive font-bold mb-2 drop-shadow-md">
            Túi Mù Lì Xì
          </h1>
          <p className="text-red-100 italic">Mở túi nhận lộc - Đón Tết May Mắn</p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm sm:text-base">
            <div className="bg-amber-400 text-red-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-md">
              <TrendingUp size={20} />
              <span>Tổng lộc: {totalMoney.toLocaleString('vi-VN')}đ</span>
            </div>
            <button 
              onClick={() => setShowHistory(true)}
              className="bg-red-800 hover:bg-red-900 px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all"
            >
              <HistoryIcon size={20} />
              <span>Lịch sử</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-red-600 border border-white/20 hover:bg-red-500 px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all"
            >
              <Settings size={20} />
              <span>Cài đặt</span>
            </button>
            <button 
              onClick={resetGame}
              className="bg-white text-red-700 hover:bg-red-50 px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all"
            >
              <RotateCcw size={20} />
              <span>Làm mới</span>
            </button>
          </div>

          <div className="mt-4 text-red-200 text-sm">
            Hạn mức: {minAmount.toLocaleString()}đ - {maxAmount.toLocaleString()}đ
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {bags.map((bag) => (
            <button
              key={bag.id}
              onClick={() => openBag(bag.id)}
              disabled={bag.isOpened || isOpening}
              className={`
                relative aspect-[3/4] rounded-2xl transition-all duration-500 transform
                ${bag.isOpened 
                  ? 'bg-white border-2 border-red-100 shadow-sm cursor-default' 
                  : 'bg-red-600 hover:scale-105 shadow-xl hover:shadow-2xl cursor-pointer active:scale-95 group'
                }
              `}
            >
              {bag.isOpened ? (
                <div className="h-full flex flex-col items-center justify-center p-4">
                   <div className="text-red-500 opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150">
                    <Coins size={80} />
                   </div>
                   <span className="text-2xl sm:text-3xl font-bold text-red-700 relative z-10">
                    {bag.content?.amount.toLocaleString('vi-VN')}đ
                   </span>
                   <span className="text-xs text-slate-400 mt-2">Đã nhận lộc</span>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white overflow-hidden p-4">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200 via-transparent to-transparent"></div>
                  
                  <Gift size={48} className="mb-4 animate-float group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-bold tracking-widest uppercase opacity-80">Lì Xì</span>
                  <div className="mt-4 w-12 h-1 bg-amber-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                  
                  {isOpening && !bag.isOpened && (
                    <div className="absolute inset-0 bg-red-600/50 flex items-center justify-center backdrop-blur-[1px] rounded-2xl">
                       <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* Reveal Modal */}
      {currentReveal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl relative overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
            <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Coins className="text-amber-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bạn đã nhận được</h2>
            <p className="text-slate-500 text-sm mb-8 italic">Phát tài phát lộc!</p>
            <div className="bg-red-600 text-white rounded-2xl py-8 mb-10 shadow-lg transform -rotate-1">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {currentReveal.amount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <button 
              onClick={() => setCurrentReveal(null)}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="text-red-600" />
                Cài đặt mệnh giá
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Số tiền nhỏ nhất (VNĐ)</label>
                <input 
                  type="number" 
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Số tiền lớn nhất (VNĐ)</label>
                <input 
                  type="number" 
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  step="1000"
                />
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                 <p className="text-xs text-amber-800 leading-relaxed">
                   <strong>Lưu ý:</strong> Hệ thống sẽ tự động làm tròn đến hàng ngàn gần nhất để tạo cảm giác thực tế.
                 </p>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg active:scale-95"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Slide-over */}
      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex items-center justify-between bg-red-700 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <HistoryIcon />
                Nhật Ký Nhận Lộc
              </h3>
              <button onClick={() => setShowHistory(false)} className="hover:bg-red-800 p-2 rounded-full transition-colors">
                <X />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {history.length === 0 ? (
                <div className="text-center py-20 opacity-30 flex flex-col items-center">
                   <Coins size={64} className="mb-4" />
                   <p>Chưa có lịch sử mở túi nào</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-50 p-3 rounded-xl text-red-600 shrink-0">
                        <Gift size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-slate-800">
                          +{item.amount.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 bg-white border-t">
               <div className="flex justify-between items-center text-xl font-bold text-red-700">
                 <span>Tổng cộng:</span>
                 <span>{totalMoney.toLocaleString('vi-VN')}đ</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="mt-12 text-center text-slate-400 text-sm px-4">
        <p>© 2025 - Chúc mừng năm mới, phát tài phát lộc!</p>
      </footer>
    </div>
  );
};

export default App;
