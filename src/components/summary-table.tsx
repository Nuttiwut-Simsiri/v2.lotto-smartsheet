import useCustomStore from "@/hooks/useCustomStore";
import { useMainStore } from "@/hooks/useMainStore";
import { useRewardnHPStore } from "@/hooks/useRewardStore";
import { ArrowUpRight, ArrowDownRight, CircleDollarSign } from 'lucide-react';

export default function SummaryTable() {
    const allWinOrders = useCustomStore(useRewardnHPStore, (state: any) => state.allWinOrders)
    const total = useCustomStore(useMainStore, (state: any) => state.total)
    const currentAmount = useCustomStore(useMainStore, (state: any) => state.currentAmount)

    const nidProfitPercent = 0.20
    const paiProfitPercent = 1 - 0.20
    const nidProfit = total * nidProfitPercent
    const paiProfit = (allWinOrders || 0) - (total * paiProfitPercent)
    const remainAmount = total - currentAmount

    const metrics = [
        { label: "ยอดรวมทั้งหมด", value: total, color: "text-white", icon: CircleDollarSign },
        { label: "รายได้ (20%)", value: nidProfit, color: "text-emerald-400", icon: ArrowUpRight },
        {
            label: paiProfit < 0 ? "โอนให้เจ้า" : "เจ้าโอนให้",
            value: Math.abs(paiProfit),
            color: paiProfit < 0 ? "text-purple-400" : "text-blue-400",
            icon: paiProfit < 0 ? ArrowDownRight : ArrowUpRight,
            bg: "bg-purple-500/5"
        },
        { label: "ยอดรับปัจจุบัน", value: currentAmount, color: "text-blue-400", icon: CircleDollarSign, bg: "bg-blue-500/10" },
        { label: "ค้างชำระ", value: remainAmount, color: "text-red-400", icon: ArrowDownRight },
        { label: "ยอดถูกหวย", value: allWinOrders || 0, color: "text-yellow-400", icon: CircleDollarSign },
    ]

    return (
        <div className="space-y-1">
            {metrics.map((item, idx) => (
                <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${item.bg || "hover:bg-zinc-800/30"}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${item.color.replace('text', 'bg')}/10 ${item.color}`}>
                            <item.icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-zinc-400">{item.label}</span>
                    </div>
                    <span className={`text-base font-bold font-mono ${item.color}`}>
                        {item.value?.toLocaleString('th-TH')}
                    </span>
                </div>
            ))}
        </div>
    )
}