import RewardsTable from "@/components/settings/RewardTable";
import HalfPayTable from "@/components/settings/HalfPayTable";
import { Trophy, ShieldAlert } from 'lucide-react';

export default async function RewardsPage() {
  return (
    <main className="animate-fade-in max-w-7xl mx-auto w-full px-4 pt-12 pb-32">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
            <Trophy size={24} />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            อัตราจ่ายและเลขอั้น
          </h1>
        </div>
        <p className="text-zinc-500 text-lg ml-11">กำหนดอัตราการจ่ายรางวัลและจัดการเลขที่ไม่เต็มเต็ง</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider ml-1">
            <Trophy size={16} /> อัตราการจ่ายรางวัล
          </div>
          <div className="glass-card p-6 border-zinc-800/50">
            <RewardsTable />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold uppercase tracking-wider ml-1">
            <ShieldAlert size={16} /> เลขอั้น / จ่ายครึ่ง
          </div>
          <div className="glass-card p-6 border-zinc-800/50 shadow-red-900/5 shadow-2xl">
            <HalfPayTable />
          </div>
        </div>
      </div>
    </main>
  )
}

