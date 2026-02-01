"use client"
import React from 'react';
import { Search, Edit2, Check, X as CloseIcon } from 'lucide-react';
import UserOrdersConfig from '@/components/payment/UserOrdersConfig';
import { useMainStore } from '@/hooks/useMainStore';
import useCustomStore from '@/hooks/useCustomStore';

export const CustomerSidebar = () => {
    const uniqOrder = useCustomStore(useMainStore, (state: any) => state.uniqOrder)
    const filterKeyword = useCustomStore(useMainStore, (state: any) => state.filterKeyword)
    const changeKeyword = useMainStore((state) => state.changeKeyword)
    const updateCustomerName = useMainStore((state) => state.updateCustomerName);

    const [editingName, setEditingName] = React.useState<string | null>(null);
    const [newNameValue, setNewNameValue] = React.useState("");

    const startEditing = (id: string, name: string) => {
        setEditingName(id);
        setNewNameValue(name);
    }

    const handleSaveName = (oldName: string, color?: string) => {
        updateCustomerName(oldName, newNameValue, color);
        setEditingName(null);
    }

    return (
        <aside className="space-y-8 lg:sticky lg:top-12">
            <div className="glass-card p-6 border-zinc-800/50">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Search size={16} /> การแสดงผล
                </h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 ml-1">กรองตามรายชื่อ</label>
                        <select
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer text-white"
                            value={filterKeyword}
                            onChange={(ev) => changeKeyword(ev.target.value)}
                        >
                            <option value="ทั้งหมด">ทั้งหมดทุกรายชื่อ</option>
                            {uniqOrder?.map((el: any) => (
                                <option key={el.name} value={el.name}>{el.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">รายชื่อลูกค้า</h2>
                <div className="space-y-2">
                    {uniqOrder?.map((el: any) => {
                        const customerColor = el.color;
                        const uniqueKey = `${el.name}-${el.color}`;
                        const isEditing = editingName === uniqueKey;

                        return (
                            <div key={uniqueKey} className="glass-card p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300">
                                <div className="flex items-center gap-3 overflow-hidden flex-1">
                                    <div
                                        className="w-3 h-3 rounded-full shadow-lg shadow-blue-500/20 shrink-0"
                                        style={{ backgroundColor: customerColor }}
                                    />
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                autoFocus
                                                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none focus:border-blue-500 w-full"
                                                value={newNameValue}
                                                onChange={(e) => setNewNameValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveName(el.name, el.color);
                                                    if (e.key === 'Escape') setEditingName(null);
                                                }}
                                            />
                                            <button onClick={() => handleSaveName(el.name, el.color)} className="text-emerald-500 hover:text-emerald-400 p-1">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => setEditingName(null)} className="text-zinc-500 hover:text-zinc-400 p-1">
                                                <CloseIcon size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span
                                                className="font-bold text-zinc-100 truncate cursor-pointer hover:underline"
                                                style={{ color: customerColor }}
                                                onClick={() => changeKeyword(el.name)}
                                            >
                                                {el.name}
                                            </span>
                                            <button
                                                onClick={() => startEditing(uniqueKey, el.name)}
                                                className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserOrdersConfig username={el.name} hColor={customerColor} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};
