"use server"

import { Redis } from '@upstash/redis'
import { auth } from "@/auth"
import { Order } from "@/types/order"

const redis = Redis.fromEnv()

/**
 * Gets the storage key for the current user
 */
async function getUserKey() {
    const session = await auth()
    if (!session?.user?.email) return null
    return `user_orders:${session.user.email}`
}

/**
 * Save orders to KV storage
 */
export async function saveOrdersToCloud(orders: Order[]) {
    const key = await getUserKey()
    if (!key) return { success: false, error: "Not authenticated" }

    try {
        await redis.set(key, JSON.stringify(orders))
        return { success: true }
    } catch (error) {
        console.error("KV Save Error:", error)
        return { success: false, error: "Failed to save to cloud" }
    }
}

/**
 * Fetch orders from KV storage
 */
export async function fetchOrdersFromCloud() {
    const key = await getUserKey()
    if (!key) return { success: false, error: "Not authenticated" }

    try {
        const data = await redis.get<string>(key)
        if (!data) return { success: true, data: [] as Order[] }

        // Upstash Redis SDK might return the object directly if it detects it's JSON
        const orders = typeof data === 'string' ? JSON.parse(data) : data
        return { success: true, data: orders as Order[] }
    } catch (error) {
        console.error("KV Fetch Error:", error)
        return { success: false, error: "Failed to fetch from cloud" }
    }
}

/**
 * Delete all user orders from KV storage
 */
export async function deleteOrdersFromCloud() {
    const key = await getUserKey()
    if (!key) return { success: false, error: "Not authenticated" }

    try {
        await redis.del(key)
        return { success: true }
    } catch (error) {
        console.error("KV Delete Error:", error)
        return { success: false, error: "Failed to delete from cloud" }
    }
}
