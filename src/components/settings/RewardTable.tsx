"use client"
import { useState, useEffect } from "react";
import useCustomStore from "@/hooks/useCustomStore";
import { useRewardnHPStore } from "@/hooks/useRewardStore";
import { Rewards } from "@/types/rewards";
import { Hash } from 'lucide-react';

export default function RewardsTable() {
    const storeRewards: Rewards = useCustomStore(useRewardnHPStore, (state: any) => state.rewards)
    const setRewards = useRewardnHPStore((state) => state.setRewards)

    // Local state to handle inputs smoothly without losing focus
    const [localRewards, setLocalRewards] = useState<any>(null);

    // Sync store data to local state once it's loaded
    useEffect(() => {
        if (storeRewards && !localRewards) {
            setLocalRewards(storeRewards);
        }
    }, [storeRewards, localRewards]);

    const handleChange = (key: string, value: string) => {
        const updated = { ...localRewards, [key]: value };
        setLocalRewards(updated);
        setRewards({ [key]: value });
    };

    if (!localRewards) return <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-zinc-800/50 rounded-2xl" />)}
    </div>;

    const formattedTable = [
        { label: "3 บน", value: localRewards.topThreeDigit, key: "topThreeDigit" },
        { label: "3 โต๊ด", value: localRewards.todThreeDigit, key: "todThreeDigit" },
        { label: "3 ล่าง", value: localRewards.botThreeDigit, key: "botThreeDigit" },
        { label: "2 บน,ล่าง", value: localRewards.top2Digit, key: "top2Digit" }
    ]

    return (
        <div className="space-y-4">
            {formattedTable?.map((row) => (
                <div key={row.key} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Hash size={20} />
                        </div>
                        <span className="text-base font-semibold text-zinc-300">{row.label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-zinc-500">จ่าย</span>
                        <input
                            type="text"
                            className="w-24 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-right font-mono font-bold text-emerald-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={row.value || ""}
                            onChange={(ev) => handleChange(row.key, ev.target.value)}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}