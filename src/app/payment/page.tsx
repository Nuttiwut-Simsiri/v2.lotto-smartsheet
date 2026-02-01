"use client"
import useCustomStore from "@/hooks/useCustomStore";
import { useRewardnHPStore } from "@/hooks/useRewardStore";
import { useMainStore } from "@/hooks/useMainStore";
import { Rewards, HPNumbersProps } from "@/types/rewards";
import { useEffect, useState } from "react";
import { CreditCard, Trophy, CheckCircle2, AlertTriangle, Hash, Share2, Printer, Eye } from "lucide-react";
import { CongratulationModal } from "@/components/payment/CongratulationModal";
import { toPng } from 'html-to-image';
import { useRef } from "react";

const WinningInput = ({ label, value, onChange, maxLength }: any) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when external value changes (e.g., initial load)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    onChange(newVal);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={localValue}
          placeholder="00"
          maxLength={maxLength}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-zinc-700"
          onChange={handleChange}
        />
        <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const top2digit = useCustomStore(useRewardnHPStore, (state: any) => state.topTwoDigit)
  const bot2digit = useCustomStore(useRewardnHPStore, (state: any) => state.botTwoDigit)
  const top3digit = useCustomStore(useRewardnHPStore, (state: any) => state.topThreeDigit)
  const bot3digit1 = useCustomStore(useRewardnHPStore, (state: any) => state.botThreeDigit1)
  const bot3digit2 = useCustomStore(useRewardnHPStore, (state: any) => state.botThreeDigit2)
  const orders = useCustomStore(useMainStore, (state: any) => state.orders)
  const rewards: Rewards = useCustomStore(useRewardnHPStore, (state: any) => state.rewards)
  const HPNumbers: HPNumbersProps = useCustomStore(useRewardnHPStore, (state: any) => state.HPNumbers)

  const setRewardDigit = useRewardnHPStore((state) => state.setRewardDigit)
  const setAllWinOrders = useRewardnHPStore((state) => state.setAllWinOrders)

  // ... (nPermute remains the same) ...
  function nPermute(arr: string[]) {
    var result: string[] = []
    function permutation(arr: string[], currentSize: number) {
      if (currentSize == 1) {
        result.push(arr.join(""));
        return;
      }

      for (let i = 0; i < currentSize; i++) {
        permutation(arr, currentSize - 1);
        if (currentSize % 2 == 1) {
          let temp = arr[0];
          arr[0] = arr[currentSize - 1];
          arr[currentSize - 1] = temp;
        } else {
          let temp = arr[i];
          arr[i] = arr[currentSize - 1];
          arr[currentSize - 1] = temp;
        }
      }
    }
    permutation(arr, arr.length)
    return [...new Set(result)]
  }

  const winOrders = orders?.map((el: any) => {
    // ... winOrders logic remains the same ...
    var winInfo = { win: false, buyAmountLabel: ``, rewardPrice: 0, halfPayRate: false }
    var check_result = { ...el }
    const setNumbers = nPermute([...el?.number])

    var temp_hpNumbers = [...(HPNumbers?.threeDigit?.[1]?.split(" ") || []), ...(HPNumbers?.twoDigit?.[1]?.split(" ") || [])]
    const hpNumbers = temp_hpNumbers.map(hp_n => nPermute([...hp_n])).flat()
    const payRate = hpNumbers.includes(el?.number) ? 0.5 : 1

    if (el?.top > 0 && el?.number == top2digit) {
      winInfo = {
        win: true, buyAmountLabel: `${winInfo?.buyAmountLabel} (บน) ${el?.top}`,
        rewardPrice: el?.top * (payRate * parseInt(rewards?.top2Digit)) + winInfo?.rewardPrice,
        halfPayRate: payRate == 0.5
      }
    }
    if (el?.bot > 0 && el?.number == bot2digit) {
      winInfo = {
        win: true, buyAmountLabel: `${winInfo?.buyAmountLabel} (ล่าง) ${el?.bot}`,
        rewardPrice: el?.bot * (payRate * parseInt(rewards?.top2Digit)) + winInfo?.rewardPrice,
        halfPayRate: payRate == 0.5
      }
    }
    if (el?.top > 0 && el?.number == top3digit) {
      winInfo = {
        win: true, buyAmountLabel: `${winInfo?.buyAmountLabel} (บน) ${el?.top}`,
        rewardPrice: el?.top * (payRate * parseInt(rewards?.topThreeDigit)) + winInfo?.rewardPrice,
        halfPayRate: payRate == 0.5
      }
    }
    if (el?.bot > 0 && (el?.number == bot3digit1 || el?.number == bot3digit2)) {
      winInfo = {
        win: true, buyAmountLabel: `${winInfo?.buyAmountLabel} (ล่าง) ${el?.bot}`,
        rewardPrice: el?.bot * (payRate * parseInt(rewards?.botThreeDigit)) + winInfo?.rewardPrice,
        halfPayRate: payRate == 0.5
      }
    }
    if (el?.tod > 0 && setNumbers.includes(top3digit)) {
      const payRateTod = setNumbers.filter(num => hpNumbers.includes(num)).length > 0 ? 0.5 : 1
      winInfo = {
        win: true, buyAmountLabel: `${winInfo?.buyAmountLabel} (โต๊ด) ${el?.tod}`,
        rewardPrice: el?.tod * (payRateTod * parseInt(rewards?.todThreeDigit)) + winInfo?.rewardPrice,
        halfPayRate: payRateTod == 0.5
      }
    }
    return { ...check_result, ...winInfo }
  }).filter((el: any) => el?.win)

  const totalReward = winOrders?.reduce((acc: number, obj: any) => acc + (obj.rewardPrice || 0), 0) || 0

  useEffect(() => {
    setAllWinOrders(totalReward)
  }, [totalReward, setAllWinOrders])

  // Group winOrders by customer for the new table design
  const groupedWinners = winOrders?.reduce((acc: any[], current: any) => {
    const existing = acc.find(item => item.name === current.name);
    if (existing) {
      existing.rewardPrice += current.rewardPrice;
      // Unique winning numbers
      const nums = existing.number.split(" ");
      if (!nums.includes(current.number)) {
        existing.number += ` ${current.number}`;
      }
      existing.details.push(current);
    } else {
      acc.push({
        name: current.name,
        number: current.number,
        rewardPrice: current.rewardPrice,
        sum: current.rewardPrice, // For congrats slip
        details: [current]
      });
    }
    return acc;
  }, []);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSharingReward, setIsSharingReward] = useState(false);
  const rewardModalRef = useRef<HTMLDialogElement>(null);
  const rewardShareRef = useRef<HTMLDivElement>(null);

  const openReward = (user: any) => {
    setSelectedUser(user);
    rewardModalRef.current?.showModal();
  }

  const handleShareReward = async () => {
    if (!rewardShareRef.current || isSharingReward) return;
    setIsSharingReward(true);
    try {
      const dataUrl = await toPng(rewardShareRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        canvasWidth: 800,
        style: { margin: '0', width: '800px' }
      });

      const blob = await (await fetch(dataUrl)).blob();
      const fileName = `reward-congrats-${selectedUser?.name}-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `ยินดีกับคุณ ${selectedUser?.name}!`,
          text: `ขอแสดงความยินดีกับคุณ ${selectedUser?.name} ที่ถูกรางวัลค่ะ!`
        });
      } else {
        const link = document.createElement('a');
        link.download = fileName; link.href = dataUrl; link.click();
      }
    } catch (err) {
      console.error('Reward sharing failed', err);
    } finally {
      setIsSharingReward(false);
    }
  }

  return (
    <main className="animate-fade-in max-w-7xl mx-auto w-full px-4 pt-12 pb-32">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            ตรวจสอบและคำนวณผลรางวัล
          </h1>
        </div>
        <p className="text-zinc-500 text-lg ml-11">กรอกผลรางวัลเพื่อคำนวณยอดเงินที่ต้องจ่ายให้ลูกค้า</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10 items-start">
        {/* Left: Input Form */}
        <aside className="glass-card p-6 border-zinc-800/50 space-y-6 lg:sticky lg:top-12">
          <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">
            <Trophy size={16} /> ผลรางวัลประจำงวด
          </div>

          <div className="grid grid-cols-2 gap-4">
            <WinningInput label="2 ตัว บน" value={top2digit} onChange={(val: string) => setRewardDigit(val, "top2digit")} maxLength={2} />
            <WinningInput label="2 ตัว ล่าง" value={bot2digit} onChange={(val: string) => setRewardDigit(val, "bot2digit")} maxLength={2} />
          </div>

          <WinningInput label="3 ตัว บน" value={top3digit} onChange={(val: string) => setRewardDigit(val, "top3digit")} maxLength={3} />

          <div className="grid grid-cols-2 gap-4">
            <WinningInput label="3 ตัว ล่าง (1)" value={bot3digit1} onChange={(val: string) => setRewardDigit(val, "bot3digit1")} maxLength={3} />
            <WinningInput label="3 ตัว ล่าง (2)" value={bot3digit2} onChange={(val: string) => setRewardDigit(val, "bot3digit2")} maxLength={3} />
          </div>

          <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 mt-4">
            <p className="text-xs text-blue-400 leading-relaxed">
              * ระบบจะคำนวณหาผู้โชคดีจากตารางการซื้อขายโดยอัตโนมัติ พร้อมหักส่วนลดเลขอั้น (ถ้ามี)
            </p>
          </div>
        </aside>

        {/* Right: Results Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-display font-semibold text-white">
              รายชื่อผู้ถูกรางวัล <span className="text-zinc-500 text-base font-normal ml-2">({winOrders?.length || 0})</span>
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">ยอดจ่ายรวม</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{totalReward.toLocaleString('th-TH')}</span>
            </div>
          </div>

          <div className="glass-card border-zinc-800/50 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto min-w-full">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[1.5fr_2fr_1.2fr_0.8fr] bg-zinc-900/50 p-4 border-b border-zinc-800">
                  {["ชื่อลูกค้า", "หมายเลขที่ถูก", "ยอดจ่ายรางวัล", ""].map((h, i) => (
                    <div key={i} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center first:text-left first:px-2">
                      {h}
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-zinc-800/50">
                  {groupedWinners && groupedWinners.length > 0 ? (
                    groupedWinners.map((el: any) => (
                      <div key={el.name} className="grid grid-cols-[1.5fr_2fr_1.2fr_0.8fr] items-center p-5 hover:bg-zinc-800/20 transition-all border-l-4 border-transparent hover:border-emerald-500/30 group">
                        <div className="px-2">
                          <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase">{el.name}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-tighter">
                            ถูกทั้งหมด {el.details.length} รายการ
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-1.5 px-4">
                          {el.number.split(" ").map((num: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-mono font-bold rounded-lg border border-blue-500/20 shadow-sm">
                              {num}
                            </span>
                          ))}
                        </div>

                        <div className="text-lg font-black text-center text-emerald-400 drop-shadow-sm">
                          {el.rewardPrice?.toLocaleString('th-TH')}
                        </div>

                        <div className="flex justify-end pr-4">
                          <button
                            onClick={() => openReward(el)}
                            className="p-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-2xl transition-all active:scale-90 shadow-lg shadow-amber-500/5 group/btn"
                            title="แชร์ความยินดี"
                          >
                            <Trophy size={18} className="group-hover/btn:rotate-12 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-zinc-500 gap-4 opacity-40">
                      <Trophy size={60} />
                      <p className="text-lg font-medium">ยังไม่มีข้อมูลผู้ถูกรางวัลในขณะนี้</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <CongratulationModal
        modalRef={rewardModalRef}
        shareRef={rewardShareRef}
        selectedUser={selectedUser}
        isSharing={isSharingReward}
        onShare={handleShareReward}
      />
    </main>
  )
}