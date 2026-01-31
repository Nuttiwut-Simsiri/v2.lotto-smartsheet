"use client"
import { useMainStore } from "@/hooks/useMainStore";
import useCustomStore from "@/hooks/useCustomStore";
import { useRef } from "react";
import { PlusCircle, X, User, Hash, Coins, Settings2, Eye } from "lucide-react";

const AddSetNumbers = () => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const newOrders = useCustomStore(useMainStore, (state: any) => state.newOrders)
    const previewOrder = useCustomStore(useMainStore, (state: any) => state.previewOrder)

    const editNewOrder = useMainStore((state) => state.editNewOrder)
    const makePreviewOrder = useMainStore((state) => state.makePreviewOrder)
    const addOrder = useMainStore((state) => state.addOrder)

    const onOpenModal = () => {
        makePreviewOrder(newOrders?.setType || "บน", Date.now(), "#fefefe")
        modalRef.current?.showModal()
    }

    const setTypes = [
        "บน", "โต๊ด", "ล่าง", "บน+ล่าง", "บน+โต๊ด", "บน+ล่าง+โต๊ด",
        "ชุด (บน)", "ชุด (ล่าง)", "ชุด (โต๊ด)", "ชุด (บน+ล่าง)", "ชุด (บน+โต๊ด)", "ชุด (บน+ล่าง+โต๊ด)"
    ]

    return (
        <>
            <button
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/20 font-bold"
                onClick={() => onOpenModal()}
            >
                <PlusCircle size={20} />
                <span>เพิ่มชุดซื้อขาย</span>
            </button>

            <dialog id="set_number_modal" className="modal modal-middle md:modal-bottom" ref={modalRef}>
                <div className="modal-box glass-card border-zinc-800/50 p-0 max-w-4xl w-11/12 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/50">
                        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                            <PlusCircle className="text-blue-500" size={24} />
                            เพิ่มรายการแบบชุด
                        </h3>
                        <form method="dialog">
                            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
                                <X size={20} />
                            </button>
                        </form>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Form Section */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <User size={14} /> ชื่อลูกค้า
                                </label>
                                <input
                                    type="text"
                                    placeholder="ชื่อ..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-zinc-700"
                                    defaultValue={newOrders?.name}
                                    onChange={(ev) => editNewOrder({ name: ev.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Hash size={14} /> ตัวเลข
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="00"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-zinc-700"
                                        minLength={2}
                                        maxLength={3}
                                        defaultValue={newOrders?.number}
                                        onChange={(ev) => editNewOrder({ number: ev.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Coins size={14} /> จำนวนเงิน
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-zinc-700"
                                        defaultValue={newOrders?.price}
                                        step={5}
                                        min={0}
                                        onChange={(ev) => editNewOrder({ price: parseInt(ev.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Settings2 size={14} /> ประเภทเลขชุด
                                </label>
                                <select
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                    defaultValue={newOrders?.setType}
                                    onChange={(ev) => editNewOrder({ setType: ev.target.value })}
                                >
                                    <option disabled>เลือกชุด...</option>
                                    {setTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Eye size={14} /> ตัวอย่างรายการ
                            </label>
                            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden min-h-[400px] shadow-inner">
                                <div className="grid grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr] bg-zinc-900/80 p-3 border-b border-zinc-800">
                                    {["ชื่อ", "เลข", "บน", "โต๊ด", "ล่าง", "รวม"].map(h => (
                                        <div key={h} className="text-[10px] font-bold text-zinc-600 uppercase text-center">{h}</div>
                                    ))}
                                </div>
                                <div className="divide-y divide-zinc-900">
                                    {previewOrder && previewOrder.length > 0 ? (
                                        previewOrder.map((el: any) => (
                                            <div key={el.id} className="grid grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr] p-3 text-center items-center">
                                                <div className="text-[11px] text-zinc-400 truncate">{el.name}</div>
                                                <div className="font-mono text-blue-400 font-bold">{el.number}</div>
                                                <div className="text-[11px] text-zinc-500">{el.top || 0}</div>
                                                <div className="text-[11px] text-zinc-500">{el.tod || 0}</div>
                                                <div className="text-[11px] text-zinc-500">{el.bot || 0}</div>
                                                <div className="text-xs font-bold text-white">{el.sum || 0}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center h-48 text-zinc-700 text-xs italic">
                                            รอกรอกข้อมูลเพื่อดูตัวอย่าง...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-900/50 border-t border-zinc-800/50 flex justify-end">
                        <form method="dialog">
                            <button
                                className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/20 font-bold text-lg active:scale-95"
                                onClick={() => addOrder()}
                            >
                                เพิ่มรายการ
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default AddSetNumbers