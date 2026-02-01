"use client"
import React from 'react';
import { stringToColor } from '@/utils/colors';

export default function NRow({ rowData }: any) {
    if (!rowData) return null;

    const topValue = rowData.top ?? 0;
    const todValue = rowData.tod ?? 0;
    const botValue = rowData.bot ?? 0;
    const sumValue = rowData.sum ?? 0;

    const customerColor = stringToColor(rowData.name || "Default");

    return (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center p-3 hover:bg-zinc-800/30 transition-colors group relative overflow-hidden">
            {/* Subtle color highlight on the far left */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: customerColor }}
            />

            <div className="text-sm font-bold px-2 truncate" style={{ color: customerColor }}>
                {rowData.name || "-"}
            </div>

            <div className="text-base font-mono font-semibold text-center text-blue-400">
                {rowData.number || "-"}
            </div>

            <div className="text-sm text-center text-zinc-400">
                {topValue === 0 ? "-" : topValue.toLocaleString()}
            </div>

            <div className="text-sm text-center text-zinc-400">
                {todValue === 0 ? "-" : todValue.toLocaleString()}
            </div>

            <div className="text-sm text-center text-zinc-400">
                {botValue === 0 ? "-" : botValue.toLocaleString()}
            </div>

            <div className="text-base font-bold text-center text-emerald-400">
                {sumValue === 0 ? "-" : sumValue.toLocaleString()}
            </div>
        </div>
    );
}

