"use client"
import { useState, useEffect } from "react";
import useCustomStore from "@/hooks/useCustomStore";
import { useRewardnHPStore } from "@/hooks/useRewardStore";
import { Calendar, AlertCircle } from 'lucide-react';

export default function HalfPayTable() {
    const storeHPData = useCustomStore(useRewardnHPStore, (state: any) => state.HPNumbers)
    const setHPN = useRewardnHPStore((state) => state.setHPN)

    // Local state to handle inputs smoothly
    const [localHPData, setLocalHPData] = useState<any>(null);

    useEffect(() => {
        if (storeHPData && !localHPData) {
            setLocalHPData(storeHPData);
        }
    }, [storeHPData, localHPData]);

    const handleChange = (value: string, key: string, categoryIndex: number) => {
        if (!localHPData) return;

        // Deep clone to update local state
        const updated = JSON.parse(JSON.stringify(localHPData));
        if (categoryIndex === 0) {
            updated.threeDigit[1] = value;
        } else {
            updated.twoDigit[1] = value;
        }

        setLocalHPData(updated);
        setHPN(value, key);
    };

    if (!localHPData) return <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-zinc-800/50 rounded-2xl" />
        <div className="h-40 bg-zinc-800/50 rounded-2xl" />
    </div>;

    const today = new Date();
    const today_formatted = today.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const categories = [
        { label: "เลข 3 ตัว", data: localHPData.threeDigit, index: 0 },
        { label: "เลข 2 ตัว", data: localHPData.twoDigit, index: 1 }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-zinc-300">
                    <Calendar size={18} className="text-blue-500" />
                    <span className="font-semibold">{today_formatted}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full text-xs font-bold">
                    <AlertCircle size={14} /> จ่ายครึ่งราคา
                </div>
            </div>

            <div className="space-y-6">
                {categories.map((cat) => (
                    <div key={cat.label} className="space-y-3">
                        <label className="text-sm font-medium text-zinc-400 ml-1">{cat.label}</label>
                        <textarea
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 min-h-[150px] text-red-500 font-mono text-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all resize-none shadow-inner"
                            placeholder="ระบุตัวเลข คั่นด้วยพื้นว่าง..."
                            value={cat.data ? cat.data[1] : ""}
                            onChange={(ev) => handleChange(ev.target.value, cat.data[0], cat.index)}
                        />
                    </div>
                ))}
            </div>

            <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-800/50">
                <p className="text-xs text-zinc-500 leading-relaxed italic">
                    * ตัวเลขที่ระบุในหน้านี้จะถูกนำไปคำนวณราคาจ่ายครึ่งหนึ่งโดยอัตโนมัติในหน้าสรุปยอด
                </p>
            </div>
        </div>
    )
}