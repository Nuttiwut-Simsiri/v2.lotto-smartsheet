
import useCustomStore from "@/hooks/useCustomStore";
import { useMainStore } from "@/hooks/useMainStore";
import { Check } from 'lucide-react';

export default function NewCSTable({ headers }: { headers: string[] }) {
    const summaryOrders = useCustomStore(useMainStore, (state: any) => state.summaryOrders)
    const onPaidOrder = useMainStore((state) => state.onPaidOrder)

    return (
        <div className="w-full">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr_0.5fr] bg-zinc-900/50 p-4 border-b border-zinc-800">
                {headers.map((h, i) => (
                    <div key={i} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center first:text-left first:px-2">
                        {h}
                    </div>
                ))}
            </div>

            <div className="divide-y divide-zinc-800/50">
                {summaryOrders?.filter((el: any) => el.name).map((el: any, index: number) => (
                    <div key={el.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr_0.5fr] items-center p-4 hover:bg-zinc-800/20 transition-colors group">
                        <div className="text-sm font-semibold text-white px-2 truncate">
                            {el.name}
                        </div>

                        <div className="text-xs font-mono text-center text-zinc-500 bg-zinc-800/50 py-1 rounded-md mx-2">
                            ••••
                        </div>

                        <div className="text-sm text-center text-blue-400 font-medium">
                            {el.top || "-"}
                        </div>

                        <div className="text-sm text-center text-emerald-400 font-medium">
                            {el.tod || "-"}
                        </div>

                        <div className="text-sm text-center text-amber-400 font-medium">
                            {el.bot || "-"}
                        </div>

                        <div className="text-sm font-bold text-center text-red-500">
                            {el.sum?.toLocaleString('th-TH') || 0}
                        </div>

                        <div className="flex justify-center">
                            <label className="relative flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={el.isPaid ?? false}
                                    className="sr-only peer"
                                    onChange={(ev) => onPaidOrder(ev.target.checked, el.id)}
                                />
                                <div className="w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-lg peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                                    <Check size={14} className={`text-white transition-opacity ${el.isPaid ? 'opacity-100' : 'opacity-0'}`} />
                                </div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}