"use client"

import { useEffect } from "react"
import { useMainStore } from "@/hooks/useMainStore"

export function CloudHydration({ session }: { session: any }) {
    const hydrateCloud = useMainStore((state) => state.hydrateCloud)
    const forceSyncToCloud = useMainStore((state) => state.forceSyncToCloud)

    useEffect(() => {
        if (session?.user?.email) {
            hydrateCloud()
        }

        // Force sync on tab close or hide
        const handleBeforeUnload = () => {
            forceSyncToCloud()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [session?.user?.email, hydrateCloud, forceSyncToCloud])

    return null // This is a logic-only component
}
