"use client"
import { useMainStore } from "@/hooks/useMainStore";
import useCustomStore from "@/hooks/useCustomStore";
import { useRef } from "react";
import { PlusCircle, X, User, Hash, Coins, Settings2, Eye, RefreshCcw } from "lucide-react";
import { stringToColor } from "@/utils/colors";

const AddSetNumbers = () => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const newOrders = useCustomStore(useMainStore, (state: any) => state.newOrders)
    const previewOrder = useCustomStore(useMainStore, (state: any) => state.previewOrder)

    const editNewOrder = useMainStore((state) => state.editNewOrder)
    const makePreviewOrder = useMainStore((state) => state.makePreviewOrder)
    const addOrder = useMainStore((state) => state.addOrder)
    const refreshColor = useMainStore((state) => state.refreshColor)

    const onOpenModal = () => {
        const tm = Date.now();
        const initialColor = stringToColor(newOrders?.name || "Luffy", tm);
        editNewOrder({ color: initialColor, tm });
        makePreviewOrder(newOrders?.setType || "บน", tm, initialColor)
        modalRef.current?.showModal()
    }

    const setTypes = [
        "บน", "โต๊ด", "ล่าง", "บน+ล่าง", "บน+โต๊ด", "บน+ล่าง+โต๊ด",
        "ชุด (บน)", "ชุด (ล่าง)", "ชุด (โต๊ด)", "ชุด (บน+ล่าง)", "ชุด (บน+โต๊ด)", "ชุด (บน+ล่าง+โต๊ด)"
    ]

    return (
        <>
            <button
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/20 font-bold active:scale-95"
                onClick={() => onOpenModal()}
            >
                <PlusCircle size={20} />
                <span>เพิ่ม</span>
            </button>

            <dialog id="set_number_modal" className="modal modal-middle md:modal-bottom" ref={modalRef}>
                <div className="modal-box p-0 bg-zinc-950 border border-zinc-900 rounded-t-[2.5rem] sm:rounded-3xl max-w-4xl w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                    {/* Header with Handle for Mobile */}
                    <div className="pt-3 pb-1 flex flex-col items-center sm:hidden">
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-4 opacity-50" />
                    </div>

                    <div className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <PlusCircle className="text-blue-500" size={20} />
                            </div>
                            <h3 className="text-lg font-display font-bold text-white">เพิ่มรายการแบบชุด</h3>
                        </div>
                        <form method="dialog">
                            <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500">
                                <X size={20} />
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Form Section */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <User size={14} className="text-blue-500/50" /> ชื่อลูกค้า
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => refreshColor()}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800"
                                        >
                                            <RefreshCcw size={10} /> สลับสี
                                        </button>
                                    </div>
                                    <div className="relative group/name">
                                        <input
                                            type="text"
                                            placeholder="ระบุชื่อลูกค้า..."
                                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl px-5 py-4 pl-14 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-zinc-700 text-lg"
                                            defaultValue={newOrders?.name}
                                            onChange={(ev) => editNewOrder({ name: ev.target.value })}
                                        />
                                        <div
                                            className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-lg shadow-black/20 border border-white/10 transition-transform group-hover/name:scale-110"
                                            style={{ backgroundColor: newOrders?.color }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Hash size={14} className="text-blue-500/50" /> ตัวเลข
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="00"
                                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl px-5 py-4 text-white font-mono font-bold text-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-zinc-700 text-center"
                                            minLength={2}
                                            maxLength={3}
                                            value={newOrders?.number || ""}
                                            onChange={(ev) => editNewOrder({ number: ev.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Coins size={14} className="text-blue-500/50" /> จำนวนเงิน
                                        </label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            placeholder="0"
                                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl px-5 py-4 text-white font-mono font-bold text-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-zinc-700 text-center"
                                            value={newOrders?.price || ""}
                                            step={5}
                                            min={0}
                                            onChange={(ev) => editNewOrder({ price: parseInt(ev.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Settings2 size={14} className="text-blue-500/50" /> ประเภทเลขชุด
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {setTypes.map(type => {
                                            const isSelected = newOrders?.setType === type;
                                            return (
                                                <button
                                                    key={type}
                                                    onClick={() => editNewOrder({ setType: type })}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${isSelected
                                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Eye size={14} className="text-blue-500/50" /> ตัวอย่างรายการ
                                </label>
                                <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col h-full min-h-[300px]">
                                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] bg-zinc-900/50 p-4 border-b border-zinc-800/50">
                                        {["ชื่อ", "เลข", "บน", "โต๊ด", "ล่าง", "รวม"].map(h => (
                                            <div key={h} className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase text-center">{h}</div>
                                        ))}
                                    </div>
                                    <div className="divide-y divide-zinc-900/50 overflow-y-auto max-h-[400px]">
                                        {previewOrder && previewOrder.length > 0 ? (
                                            previewOrder.map((el: any) => (
                                                <div key={el.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] p-4 text-center items-center hover:bg-white/[0.02] transition-colors">
                                                    <div className="text-xs text-zinc-300 font-medium truncate px-1 text-left">{el.name}</div>
                                                    <div className="font-mono text-blue-400 font-bold text-base">{el.number}</div>
                                                    <div className="text-xs text-zinc-500">{el.top || 0}</div>
                                                    <div className="text-xs text-zinc-500">{el.tod || 0}</div>
                                                    <div className="text-xs text-zinc-500">{el.bot || 0}</div>
                                                    <div className="text-xs font-bold text-emerald-400">{el.sum || 0}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-zinc-700 gap-3">
                                                <div className="p-4 bg-zinc-900/50 rounded-full">
                                                    <Eye size={32} className="opacity-20" />
                                                </div>
                                                <p className="text-sm font-medium italic">รอกรอกข้อมูลเพื่อดูตัวอย่าง...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-950 border-t border-zinc-900 sticky bottom-0 z-10 sm:relative sm:z-auto">
                        <form method="dialog" className="flex flex-col gap-3">
                            <button
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white rounded-2xl transition-all shadow-xl shadow-blue-600/25 font-bold text-xl flex items-center justify-center gap-3 group"
                                onClick={() => addOrder()}
                            >
                                <span>เพิ่มรายการ</span>
                                <PlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                            <button className="sm:hidden text-zinc-500 font-medium py-2 text-sm text-center">
                                ยกเลิกและปิด
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default AddSetNumbers