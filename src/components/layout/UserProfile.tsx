"use client"
import { handleSignOut } from "@/actions/auth"
import { LogOut, User, Cloud, CloudOff, RefreshCw } from "lucide-react"
import { useMainStore } from "@/hooks/useMainStore"

interface UserProfileProps {
    session: any
}

export function UserProfile({ session }: UserProfileProps) {
    const isSyncing = useMainStore((state) => state.isSyncing)
    const lastSynced = useMainStore((state) => state.lastSynced)

    if (!session?.user) return null

    return (
        <div className="flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 mr-2">
                {isSyncing ? (
                    <RefreshCw size={14} className="text-blue-500 animate-spin" />
                ) : lastSynced ? (
                    <Cloud size={14} className="text-emerald-500" />
                ) : (
                    <CloudOff size={14} className="text-zinc-600" />
                )}
            </div>

            <div className="flex items-center gap-3">
                {session.user.image ? (
                    <img src={session.user.image} className="w-8 h-8 rounded-full border border-zinc-700" alt="avatar" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <User size={16} className="text-blue-500" />
                    </div>
                )}
                <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-white leading-none">{session.user.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{session.user.email}</p>
                </div>
            </div>

            <button
                onClick={() => handleSignOut()}
                className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-all"
            >
                <LogOut size={16} />
            </button>
        </div>
    )
}
