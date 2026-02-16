import { nanoid } from 'nanoid';
import { Order, NewOrder } from '../types/order';

/**
 * Group an array of objects by a specific key
 */
export const groupBy = (items: any[], key: string) =>
    items.reduce(
        (result: any, item: any) => ({
            ...result,
            [item[key]]: [
                ...(result[item[key]] || []),
                item,
            ],
        }),
        {},
    );

/**
 * Generate all permutations of an array of strings
 */
export const nPermute = (arr: string[]): string[] => {
    const result: string[] = [];

    function permutation(arr: string[], currentSize: number) {
        if (currentSize === 1) {
            result.push(arr.join(""));
            return;
        }

        for (let i = 0; i < currentSize; i++) {
            permutation(arr, currentSize - 1);
            if (currentSize % 2 === 1) {
                let temp = arr[0];
                arr[0] = arr[currentSize - 1];
                arr[currentSize - 1] = temp;
            } else {
                let temp = arr[i];
                arr[i] = arr[currentSize - 1];
                arr[currentSize - 1] = temp;
            }
        }
    }

    permutation(arr, arr.length);
    return [...new Set(result)];
};

/**
 * Calculate the collection of orders based on order type and price
 */
export const calculatePreviewOrders = (
    newOrder: NewOrder,
    timestamp: number,
    defaultColor: string = "#fefefe"
): Order[] => {
    const { number, price, name, setType } = newOrder;
    const setNumbers = nPermute(number.split(""));

    const baseOrder = {
        name,
        tm: timestamp,
        color: defaultColor,
        sum: 0,
    };

    // Helper to create a single order
    const createOrder = (num: string, top: number, tod: number, bot: number): Order => ({
        ...baseOrder,
        id: nanoid(),
        number: num,
        top,
        tod,
        bot,
        sum: 0
    });

    // Handle Set (Permutation) Types
    if (setType.startsWith("ชุด")) {
        const isTop = setType.includes("บน");
        const isTod = setType.includes("โต๊ด");
        const isBot = setType.includes("ล่าง");

        return setNumbers.map(n => createOrder(
            n,
            isTop ? price : 0,
            isTod ? price : 0,
            isBot ? price : 0
        ));
    }

    // Handle Standard Types
    switch (setType) {
        case "บน":
            return [createOrder(number, price, 0, 0)];
        case "บน+โต๊ด":
            return [createOrder(number, price, price, 0)];
        case "บน+ล่าง":
            return [createOrder(number, price, 0, price)];
        case "บน+ล่าง+โต๊ด":
            return [createOrder(number, price, price, price)];
        case "ล่าง":
            return [createOrder(number, 0, 0, price)];
        case "โต๊ด":
            return [createOrder(number, 0, price, 0)];
        default:
            // Default to 'Top' if type is unknown
            return [createOrder(number, price, 0, 0)];
    }
};

/**
 * Consolidate duplicate numbers for the same user (preserving entry order)
 */
export const consolidateOrders = (orders: Order[]): Order[] => {
    const consolidatedMap = new Map<string, Order>();

    for (const order of orders) {
        // Use a composite key of name, number, and color to identify unique entries
        const key = `${order.name || 'Unknown'}-${order.number}-${order.color || 'default'}`;
        const existing = consolidatedMap.get(key);

        if (existing) {
            // Sum values for duplicates
            existing.top = (existing.top || 0) + (order.top || 0);
            existing.tod = (existing.tod || 0) + (order.tod || 0);
            existing.bot = (existing.bot || 0) + (order.bot || 0);
            // We keep the original timestamp (tm) and id to preserve entry identity
        } else {
            // Add new unique entry, cloning to avoid side effects
            consolidatedMap.set(key, { ...order });
        }
    }

    return Array.from(consolidatedMap.values());
};
