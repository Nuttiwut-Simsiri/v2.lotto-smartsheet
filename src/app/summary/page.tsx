"use client"

import AdminSummaryTable from "@/components/admin/AdminSummaryTable";
import SummaryTable from "@/components/summary/SummaryTable";
import { BarChart3, PieChart, Wallet } from 'lucide-react';

export default function SummaryPage() {
  const sumHeaders = ["ชื่อ", "หมายเลข", "บน", "โต๊ด", "ล่าง", "รวม", "จ่ายเงิน"]

  return (
    <main className="animate-fade-in max-w-7xl mx-auto w-full px-4 pt-12 pb-32">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
            <BarChart3 size={24} />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            สรุปยอดการซื้อขาย
          </h1>
        </div>
        <p className="text-zinc-500 text-lg ml-11">วิเคราะห์ข้อมูลรายรับ-รายจ่าย และสถานะการชำระเงิน</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Summary Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-zinc-800/50">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-6">
              <Wallet size={16} /> สรุปการเงิน
            </div>
            <AdminSummaryTable />
          </div>

          <div className="glass-card p-6 border-zinc-800/50 bg-blue-500/5">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider mb-4">
              <PieChart size={16} /> ข้อมูลเพิ่มเติม
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              ระบบคำนวณกำไรโดยหักเปอร์เซ็นต์ (20%) และคำนวณยอดที่ต้องโอนระหว่างตัวแทนโดยอัตโนมัติ
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="lg:col-span-2">
          <div className="glass-card border-zinc-800/50 overflow-hidden">
            <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
              <h3 className="font-semibold text-white">รายละเอียดรายบุคคล</h3>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">อัปเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')}</span>
            </div>
            <SummaryTable headers={sumHeaders} />
          </div>
        </div>
      </div>
    </main>
  )
}

