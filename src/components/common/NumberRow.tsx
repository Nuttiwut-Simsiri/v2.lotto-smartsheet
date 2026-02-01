"use client"
import React from 'react';
import { stringToColor } from '@/utils/colors';

import { Trash2, Edit2, Check, X as CloseIcon } from 'lucide-react';
import { useMainStore } from '@/hooks/useMainStore';

const NRow = React.memo(({ rowData }: any) => {
    const removeOrder = useMainStore(state => state.removeOrder);
    const editOrder = useMainStore(state => state.editOrder);

    const [isEditing, setIsEditing] = React.useState(false);
    const [editValues, setEditValues] = React.useState({
        number: "",
        top: 0,
        tod: 0,
        bot: 0
    });

    if (!rowData) return null;

    const topValue = rowData.top ?? 0;
    const todValue = rowData.tod ?? 0;
    const botValue = rowData.bot ?? 0;
    const sumValue = rowData.sum ?? 0;

    const customerColor = rowData.color || stringToColor(rowData.name || "Default");

    const startEditing = () => {
        setEditValues({
            number: rowData.number || "",
            top: rowData.top || 0,
            tod: rowData.tod || 0,
            bot: rowData.bot || 0
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        editOrder(editValues, rowData.id);
        setIsEditing(false);
    };

    return (
        <div className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center p-3 transition-colors group relative overflow-hidden ${isEditing ? "bg-blue-500/10" : "hover:bg-zinc-800/30"
            }`}>
            {/* Subtle color highlight on the far left */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity ${isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                style={{ backgroundColor: customerColor }}
            />

            <div className="text-sm font-bold px-2 truncate" style={{ color: customerColor }}>
                {rowData.name || "-"}
            </div>

            {/* Column: Number */}
            <div className="text-center px-1">
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full bg-zinc-900 border border-blue-500/50 rounded px-1 py-1 text-center font-mono font-bold text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={editValues.number}
                        onChange={(e) => setEditValues({ ...editValues, number: e.target.value })}
                        autoFocus
                    />
                ) : (
                    <div className="text-base font-mono font-semibold text-blue-400">
                        {rowData.number || "-"}
                    </div>
                )}
            </div>

            {/* Column: Top */}
            <div className="text-center px-1">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-1 py-1 text-center text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                        value={editValues.top}
                        onChange={(e) => setEditValues({ ...editValues, top: parseInt(e.target.value) || 0 })}
                    />
                ) : (
                    <div className="text-sm text-zinc-400">
                        {topValue === 0 ? "-" : topValue.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Column: Tod */}
            <div className="text-center px-1">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-1 py-1 text-center text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                        value={editValues.tod}
                        onChange={(e) => setEditValues({ ...editValues, tod: parseInt(e.target.value) || 0 })}
                    />
                ) : (
                    <div className="text-sm text-zinc-400">
                        {todValue === 0 ? "-" : todValue.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Column: Bot */}
            <div className="text-center px-1">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-1 py-1 text-center text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                        value={editValues.bot}
                        onChange={(e) => setEditValues({ ...editValues, bot: parseInt(e.target.value) || 0 })}
                    />
                ) : (
                    <div className="text-sm text-zinc-400">
                        {botValue === 0 ? "-" : botValue.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Column: Sum (Calculated) */}
            <div className="text-base font-bold text-center text-emerald-400">
                {isEditing ? (
                    (editValues.top + editValues.tod + editValues.bot).toLocaleString()
                ) : (
                    sumValue === 0 ? "-" : sumValue.toLocaleString()
                )}
            </div>

            {/* Quick Actions */}
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 transition-opacity flex items-center gap-1 ${isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                            title="บันทึก"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 rounded-lg transition-all"
                            title="ยกเลิก"
                        >
                            <CloseIcon size={14} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={startEditing}
                            className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                            title="แก้ไข"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => removeOrder(rowData.id)}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                            title="ลบ"
                        >
                            <Trash2 size={14} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
});

export default NRow;

