'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, BarChart3, Trophy, CreditCard } from 'lucide-react'

export function BottomNavBar() {
    const pathname = usePathname()
    const router = useRouter()

    // Hide navbar on auth pages
    if (pathname?.startsWith('/auth')) return null;

    const navItems = [
        { href: "/", icon: Home, label: "หน้าแรก" },
        { href: "/summary", icon: BarChart3, label: "สรุปยอด" },
        { href: "/rewards", icon: Trophy, label: "รางวัล" },
        { href: "/payment", icon: CreditCard, label: "จ่ายเงิน" }
    ]

    return (
        <div className='fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50'>
            <div className="flex justify-around items-center glass-card py-3 px-6 shadow-2xl shadow-blue-500/10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.replace(item.href)}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive
                                ? "text-blue-500 scale-110"
                                : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                            {isActive && (
                                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-500" data-testid="active-indicator" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
