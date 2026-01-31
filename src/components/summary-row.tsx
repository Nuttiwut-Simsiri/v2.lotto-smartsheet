import { Eye, Check } from 'lucide-react';

interface SummaryRowProps {
    el: any;
    onViewDetails: (userSummary: any) => void;
    onPaidOrder: (isPaid: boolean, id: string) => void;
}

export const SummaryRow = ({ el, onViewDetails, onPaidOrder }: SummaryRowProps) => {
    return (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr_0.5fr] items-center p-4 hover:bg-zinc-800/20 transition-colors group">
            <div className="text-sm font-semibold text-white px-2 truncate">
                {el.name}
            </div>

            <div
                className="px-2 cursor-pointer group/num"
                onClick={() => onViewDetails(el)}
            >
                <div className="text-xs font-mono text-center text-zinc-500 bg-zinc-900/50 group-hover/num:bg-blue-500/10 group-hover/num:text-blue-400 py-1.5 rounded-lg border border-zinc-800/50 group-hover/num:border-blue-500/30 transition-all flex items-center justify-center gap-2">
                    •••
                    <Eye size={12} className="opacity-0 group-hover/num:opacity-100 transition-opacity" />
                </div>
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
    );
};
