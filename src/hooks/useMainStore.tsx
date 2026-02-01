import { create } from 'zustand'
import { persist } from "zustand/middleware";
import { Order, SummaryOrder, NewOrder } from '../types/order';
import { nanoid } from 'nanoid'
import { stringToColor } from '@/utils/colors';
import {
    calculatePreviewOrders,
    consolidateOrders
} from '@/utils/lotteryUtils';

interface OrderState {
    // State
    orders: Order[];
    newOrders: NewOrder;
    previewOrder: Order[];
    previewOrderForUser: Order[];
    uniqOrder: Order[];
    isloaded: boolean;
    filterKeyword: string;
    summaryOrders: SummaryOrder[];
    total: number;
    currentAmount: number;

    // Actions: Configuration & General

    changeKeyword: (newKeyword: string) => void;
    setSummaryOrders: (newObj: SummaryOrder[]) => void;

    // Actions: Order Management
    addOrder: () => void;
    addOrderForUser: () => void;
    removeOrder: (id: string) => void;
    removeAllOrder: () => void;
    editOrder: (newData: Partial<Order>, id: string) => void;
    editNewOrder: (newData: Partial<NewOrder>) => void;

    // Actions: Customer Management
    updateCustomerName: (oldName: string, newName: string, color?: string) => void;
    changeColor: (newData: Partial<Order>, name: string) => void;
    refreshColor: () => void;

    // Actions: Payment & Summary
    onPaidOrder: (checked: boolean, id: string) => void;
    summarize: () => void;

    // Actions: Preview
    makePreviewOrder: (OrderType: string, timestamp: number, defaultColor: string) => void;
    makePreviewOrderForUser: (OrderType: string, timestamp: number, defaultColor: string) => void;
    clearPreviewOrder: () => void;

    // Staging Actions for Keypad
    stagedOrders: Order[];
    stageCurrentOrder: () => void;
    removeStagedOrder: (id: string) => void;
    clearStagedOrders: () => void;
    commitStagedOrders: () => void;
}

export const useMainStore = create<OrderState>()(
    persist(
        (set, get) => ({
            // --- Initial State ---
            orders: [],
            uniqOrder: [],
            stagedOrders: [],
            newOrders: {
                id: nanoid(),
                tm: Date.now(),
                name: "Luffy",
                number: "123",
                price: 10,
                setType: "",
                color: "#fefefe"
            },
            filterKeyword: "ทั้งหมด",
            previewOrder: [],
            previewOrderForUser: [],
            summaryOrders: [],
            total: 0,
            currentAmount: 0,
            isloaded: false,

            // --- Configuration Actions ---

            changeKeyword: (newKeyword: string) => set({ filterKeyword: newKeyword }),

            setSummaryOrders: (newObj: SummaryOrder[]) => set({ summaryOrders: newObj }),

            // --- Order Management Actions ---
            addOrder: () => {
                const combined = [...get().orders, ...get().previewOrder];
                const consolidated = consolidateOrders(combined);

                // Update unique users list
                const uniqUsers = [...new Map(consolidated.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name);

                set({
                    orders: consolidated
                        .sort((a, b) => b.tm - a.tm) // Sort by timestamp
                        .sort((a, b) => { // Sort by name appearance in unique list
                            const indexA = uniqUsers.findIndex(el => el.name === a.name);
                            const indexB = uniqUsers.findIndex(el => el.name === b.name);
                            return indexA - indexB;
                        }),
                    uniqOrder: uniqUsers as Order[]
                });

                get().summarize();
            },

            addOrderForUser: () => {
                const combined = [...get().orders, ...get().previewOrderForUser];
                const consolidated = consolidateOrders(combined);
                const uniqUsers = [...new Map(consolidated.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name);

                set({
                    orders: consolidated
                        .sort((a, b) => a.tm - b.tm)
                        .sort((a, b) => {
                            const indexA = uniqUsers.findIndex(el => el.name === a.name);
                            const indexB = uniqUsers.findIndex(el => el.name === b.name);
                            return indexA - indexB;
                        }),
                    uniqOrder: uniqUsers as Order[]
                });

                get().summarize();
                set({
                    previewOrderForUser: [],
                    newOrders: { ...get().newOrders, number: "" }
                });
            },

            removeOrder: (id: string) => {
                const filtered = get().orders.filter(el => el.id !== id);
                set({
                    orders: filtered,
                    uniqOrder: [...new Map(filtered.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[]
                });
                get().summarize();
            },

            removeAllOrder: () => {
                set({ orders: [], uniqOrder: [] });
                get().summarize();
            },

            editOrder: (newData: Partial<Order>, id: string) => {
                const temp = get().orders.map(order =>
                    order.id === id ? { ...order, ...newData } : order
                );
                set({
                    orders: temp,
                    uniqOrder: [...new Map(temp.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[]
                });
                get().summarize();
            },

            editNewOrder: (newData: Partial<NewOrder>) => {
                const tm = Date.now();
                set((state) => ({
                    newOrders: { ...state.newOrders, ...newData, tm },
                }));

                const updated = get().newOrders;
                // Automatically update previews
                get().makePreviewOrder(updated.setType, tm, updated.color);
                get().makePreviewOrderForUser(updated.setType, tm, updated.color);
            },

            // --- Customer Management Actions ---
            updateCustomerName: (oldName: string, newName: string, color?: string) => {
                if (!newName || oldName === newName) return;

                const updatedOrders = get().orders.map(order => {
                    const matchesName = order.name === oldName;
                    const matchesColor = color ? order.color === color : true;
                    return (matchesName && matchesColor) ? { ...order, name: newName } : order;
                });

                const updatedSummary = get().summaryOrders.map(summary => {
                    const matchesName = summary.name === oldName;
                    const matchesColor = color ? (summary as any).color === color : true;
                    return (matchesName && matchesColor) ? { ...summary, name: newName } : summary;
                });

                set({
                    orders: updatedOrders,
                    summaryOrders: updatedSummary,
                    uniqOrder: [...new Map(updatedOrders.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[],
                    filterKeyword: get().filterKeyword === oldName ? newName : get().filterKeyword
                });

                get().summarize();
            },

            changeColor: (newData: Partial<Order>, name: string) => {
                const updated = get().orders.map(order =>
                    order.name === name ? { ...order, ...newData } : order
                );
                set({
                    orders: updated,
                    uniqOrder: [...new Map(updated.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[]
                });
                get().summarize();
            },

            refreshColor: () => {
                const name = get().newOrders.name;
                const tm = Date.now();
                const newColor = stringToColor(name, tm);
                get().editNewOrder({ color: newColor, tm });
            },

            // --- Payment & Summary Actions ---
            onPaidOrder: (checked: boolean, id: string) => {
                const updatedSummary = get().summaryOrders.map(order =>
                    order.id === id ? { ...order, isPaid: checked } : order
                );

                const total = updatedSummary.reduce((acc, obj) => acc + obj.sum, 0);
                const currentAmount = updatedSummary.filter(el => el.isPaid).reduce((acc, obj) => acc + obj.sum, 0);

                set({
                    summaryOrders: updatedSummary,
                    total,
                    currentAmount
                });
            },

            summarize: () => {
                const currentOrders = get().orders;
                if (currentOrders.length === 0) {
                    set({ summaryOrders: [], total: 0, currentAmount: 0 });
                    return;
                }

                const prevSummary = get().summaryOrders;
                const groups = new Map<string, Order[]>();

                // One pass to group
                for (const order of currentOrders) {
                    const key = `${order.name}-${order.color}`;
                    let group = groups.get(key);
                    if (!group) {
                        group = [];
                        groups.set(key, group);
                    }
                    group.push(order);
                }

                let total = 0;
                let currentAmount = 0;
                const newSummary: SummaryOrder[] = [];

                // Calculate summary in one pass over groups
                groups.forEach((group, key) => {
                    const first = group[0];
                    if (!first.name) return;

                    const existing = prevSummary.find(s => s.name === first.name && (s as any).color === first.color);

                    let top = 0, tod = 0, bot = 0;
                    for (const o of group) {
                        top += (o.top || 0);
                        tod += (o.tod || 0);
                        bot += (o.bot || 0);
                    }

                    const sum = top + tod + bot;
                    const isPaid = existing ? existing.isPaid : false;

                    total += sum;
                    if (isPaid) currentAmount += sum;

                    newSummary.push({
                        id: existing ? existing.id : nanoid(),
                        name: first.name,
                        color: first.color,
                        number: group.map(o => o.number).join(" "),
                        top,
                        tod,
                        bot,
                        sum,
                        isPaid
                    } as any);
                });

                // Update orders to include sums only for the last item in each group
                // This is O(N) but clean
                const finalOrders = currentOrders.map((order, index) => {
                    const key = `${order.name}-${order.color}`;
                    const group = groups.get(key)!;
                    const isLastInGroup = group[group.length - 1] === order;

                    if (isLastInGroup) {
                        const summary = newSummary.find(s => s.name === order.name && (s as any).color === order.color);
                        return { ...order, sum: summary?.sum || 0 };
                    }
                    return order.sum === 0 ? order : { ...order, sum: 0 };
                });

                set({
                    orders: finalOrders,
                    summaryOrders: newSummary,
                    total,
                    currentAmount
                });
            },

            // --- Preview Actions ---
            makePreviewOrder: (OrderType: string, timestamp: number, defaultColor: string = "#fefefe") => {
                const previews = calculatePreviewOrders(get().newOrders, timestamp, defaultColor);
                set({ previewOrder: previews });
            },

            makePreviewOrderForUser: (OrderType: string, timestamp: number, defaultColor: string = "#fefefe") => {
                const previews = calculatePreviewOrders(get().newOrders, timestamp, defaultColor);
                set({ previewOrderForUser: previews });
            },

            clearPreviewOrder: () => set({ previewOrderForUser: [] }),

            // --- Staging Actions ---
            stageCurrentOrder: () => {
                const currentPreview = get().previewOrder;
                if (currentPreview.length === 0) return;

                set(state => ({
                    stagedOrders: [...state.stagedOrders, ...currentPreview],
                    previewOrder: [],
                    newOrders: { ...state.newOrders, number: "" } // Clear number for next input
                }));
            },

            removeStagedOrder: (id: string) => {
                set(state => ({
                    stagedOrders: state.stagedOrders.filter(o => o.id !== id)
                }));
            },

            clearStagedOrders: () => set({ stagedOrders: [] }),

            commitStagedOrders: () => {
                const staged = get().stagedOrders;
                if (staged.length === 0) return;

                const combined = [...get().orders, ...staged];
                const consolidated = consolidateOrders(combined);
                const uniqUsers = [...new Map(consolidated.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name);

                set({
                    orders: consolidated
                        .sort((a, b) => b.tm - a.tm)
                        .sort((a, b) => {
                            const indexA = uniqUsers.findIndex(el => el.name === a.name);
                            const indexB = uniqUsers.findIndex(el => el.name === b.name);
                            return indexA - indexB;
                        }),
                    uniqOrder: uniqUsers as Order[],
                    stagedOrders: [], // Clear staging after commit
                });

                get().summarize();
            }
        }),
        {
            name: "mainStore",
        }
    )
);
