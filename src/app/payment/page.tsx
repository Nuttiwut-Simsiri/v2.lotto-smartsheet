"use client"
import useCustomStore from "@/hooks/useCustomStore";
import { useRewardnHPStore } from "@/hooks/useRewardStore";
import { useMainStore } from "@/hooks/useMainStore";
import { Rewards, HPNumbersProps } from "@/model/rewards";
import { useEffect, useState } from "react";
import { CreditCard, Trophy, CheckCircle2, AlertTriangle, Hash } from "lucide-react";

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
        <aside className="glass-card p-6 border-zinc-800/50 space-y-6 sticky top-12">
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
            <div className="grid grid-cols-[1.2fr_1fr_1.5fr_0.8fr_1.2fr] bg-zinc-900/50 p-4 border-b border-zinc-800">
              {["ชื่อลูกค้า", "หมายเลข", "ข้อมูลการซื้อ", "เลขอั้น", "ยอดที่ถูก"].map((h, i) => (
                <div key={i} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center first:text-left first:px-2">
                  {h}
                </div>
              ))}
            </div>

            <div className="divide-y divide-zinc-800/50">
              {winOrders && winOrders.length > 0 ? (
                winOrders.map((el: any) => (
                  <div key={el.id} className="grid grid-cols-[1.2fr_1fr_1.5fr_0.8fr_1.2fr] items-center p-4 hover:bg-zinc-800/20 transition-colors">
                    <div className="text-sm font-semibold text-white px-2 truncate">{el.name}</div>
                    <div className="text-lg font-mono font-bold text-center text-blue-400 bg-blue-500/5 py-1 rounded-lg mx-4">
                      {el.number}
                    </div>
                    <div className="text-xs text-zinc-400 text-center italic">{el.buyAmountLabel}</div>
                    <div className="flex justify-center">
                      {el.halfPayRate ? (
                        <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                          <AlertTriangle size={10} /> อั้น
                        </span>
                      ) : (
                        <span className="text-zinc-700 text-xs">-</span>
                      )}
                    </div>
                    <div className="text-base font-bold text-center text-emerald-400">
                      {el.rewardPrice?.toLocaleString('th-TH')}
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
        </section>
      </div>
    </main>
  )
}