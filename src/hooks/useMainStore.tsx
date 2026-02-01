import { create } from 'zustand'
import { persist } from "zustand/middleware";
import { Order, SummaryOrder, NewOrder } from '../model/order';
import { nanoid } from 'nanoid'
import { stringToColor } from '@/utils/colors';


const groupBy = (items: any, key: string) => items.reduce(
    (result: any, item: any) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);



interface OrderState {
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
    changeKeyword: (newKeyword: string) => void;
    setDefaultOrders: () => void;
    setSummaryOrders: (newObj: SummaryOrder[]) => void;
    addOrder: () => void;
    addOrderForUser: () => void;
    removeOrder: (id: string) => void;
    removeAllOrder: () => void;
    editOrder: (newData: object, id: number) => void;
    changeColor: (newData: object, name: string) => void;
    editNewOrder: (newData: object) => void;
    onPaidOrder: (checked: boolean, id: string) => void;
    makePreviewOrder: (OrderType: string, timestmap: number, defaultColor: string) => void;
    makePreviewOrderForUser: (OrderType: string, timestmap: number, defaultColor: string) => void;
    updateCustomerName: (oldName: string, newName: string, color?: string) => void;
    refreshColor: () => void;
    summarize: () => void;
    clearPreviewOrder: () => void;
}

function nPermute(arr: string[]) {
    var result: string[] = []
    // currentSize should be invoked with the array size
    function permutation(arr: string[], currentSize: number) {
        if (currentSize == 1) { // recursion base-case (end)
            result.push(arr.join(""));
            return;
        }

        for (let i = 0; i < currentSize; i++) {
            permutation(arr, currentSize - 1);
            if (currentSize % 2 == 1) {
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
    permutation(arr, arr.length)
    return [...new Set(result)]

}

export const useMainStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            uniqOrder: [],
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
            setDefaultOrders: async () => {
                var res = await fetch('http://localhost:3000/api/prefetch')
                var historyData = await res.json()
                set((state) => ({
                    orders: historyData.orders,
                }));
                const orders = get().orders;
                set({
                    uniqOrder: [...new Map(orders.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[]
                });
                get().summarize()
                set({ isloaded: true })
            },

            changeKeyword: (newKeyword: string) => {
                set((state) => ({
                    filterKeyword: newKeyword,
                }));
            },
            setSummaryOrders: (newObj: SummaryOrder[]) => {
                set((state) => ({
                    summaryOrders: newObj,
                }));
            },

            onPaidOrder: (checked: boolean, id: string) => {
                const temp = get().summaryOrders.map(order =>
                    order.id === id ? { ...order, isPaid: checked } : order
                );

                const total = temp?.reduce((accumulator: any, object: any) => {
                    return accumulator + object.sum;
                }, 0)
                const currentAmount = temp?.filter((el: any) => el.isPaid).reduce((accumulator: any, object: any) => {
                    return accumulator + object.sum;
                }, 0)

                set((state) => ({
                    summaryOrders: temp,
                    total,
                    currentAmount
                }));
            },
            addOrder: () => {
                let temp = [...get().orders, ...get().previewOrder]

                // group same number into one order
                const orderByName: any = groupBy(temp, "name");
                const final_result: any = Object.keys(orderByName).map((user_name) => {
                    const groupedNumber: any = groupBy(orderByName[user_name], "number")
                    const f_result = Object.keys(groupedNumber).map((n) => {
                        return {
                            ...groupedNumber[n][0],
                            ...{
                                top: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + (object.top || 0), 0),
                                bot: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + (object.bot || 0), 0),
                                tod: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + (object.tod || 0), 0)
                            }
                        }
                    })

                    return f_result

                }).flat()

                set((state) => ({
                    orders: final_result,
                }));

                set({
                    uniqOrder: [...new Map(final_result.map((item: any) => [`${item.name}-${item.color}`, item])).values()].filter((el: any) => el.name) as Order[]
                });

                // sort order by timestamp
                set((state) => ({
                    orders: state.orders.sort((a: any, b: any) => b?.tm - a?.tm),
                }));

                // sort order by name
                const uo = get().uniqOrder
                set((state) => ({
                    orders: state.orders.sort((a: any, b: any) => (uo.findIndex((el: any) => el?.name == a?.name) - uo.findIndex((el: any) => el?.name == b?.name))),
                }));

                get().summarize()

            },
            addOrderForUser: () => {
                let temp = [...get().orders, ...get().previewOrderForUser]

                // group same number into one order
                const orderByName: any = groupBy(temp, "name");
                const final_result: any = Object.keys(orderByName).map((user_name) => {

                    const groupedNumber: any = groupBy(orderByName[user_name], "number")

                    const f_result = Object.keys(groupedNumber).map((n) => {
                        return {
                            ...groupedNumber[n][0],
                            ...{
                                top: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + (object.top || 0), 0),
                                bot: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + (object.bot || 0), 0),
                                tod: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + (object.tod || 0), 0)
                            }
                        }
                    })

                    return f_result

                }).flat()

                set((state) => ({
                    orders: final_result,
                }));

                // get unique user
                set({
                    uniqOrder: [...new Map(final_result.map((item: any) => [`${item.name}-${item.color}`, item])).values()].filter((el: any) => el.name) as Order[]
                });

                // sort order by timestamp
                set((state) => ({
                    orders: state.orders.sort((a: any, b: any) => a?.tm - b?.tm),
                }));

                // sort order by name
                const uo = get().uniqOrder
                set((state) => ({
                    orders: state.orders.sort((a: any, b: any) => (uo.findIndex((el: any) => el?.name == a?.name) - uo.findIndex((el: any) => el?.name == b?.name))),
                }));

                get().summarize()

            },
            removeOrder: (id: string) => {
                const removedData = get().orders.filter((el) => el.id != id)
                set({
                    orders: removedData,
                    uniqOrder: [...new Map(removedData?.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[]
                });
                get().summarize()
            },
            removeAllOrder: () => {
                set((state) => ({
                    orders: [],
                    uniqOrder: []
                }));
                get().summarize()
            },
            editOrder: (newData: object, index: number) => {
                var temp = [...get().orders]
                temp[index] = { ...temp[index], ...newData }
                set({
                    orders: temp,
                    uniqOrder: [...new Map(temp.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[]
                });
                get().summarize()
            },
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
                    return (matchesName && matchesColor) ? { ...summary, name: newName } : summary
                });

                set({
                    orders: updatedOrders,
                    summaryOrders: updatedSummary,
                    uniqOrder: [...new Map(updatedOrders.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[],
                    filterKeyword: get().filterKeyword === oldName ? newName : get().filterKeyword
                });

                get().summarize();
            },

            changeColor: (newData: object, name: string) => {
                var temp = get().orders.map((el, index) => {
                    return el.name == name ? { ...get().orders[index], ...newData } : get().orders[index]
                })
                set({
                    orders: temp,
                    uniqOrder: [...new Map(temp.map(item => [`${item.name}-${item.color}`, item])).values()].filter(el => el.name) as Order[]
                });
                get().summarize()
            },
            refreshColor: () => {
                const name = get().newOrders.name;
                const tm = Date.now();
                const newColor = stringToColor(name, tm);
                get().editNewOrder({ color: newColor, tm });
            },

            editNewOrder: (newData: any) => {
                let tm = Date.now()
                set((state) => ({
                    newOrders: { ...state.newOrders, ...newData, ...{ tm } },
                }));
                const newOrder = get().newOrders

                try {
                    get().makePreviewOrder(newOrder?.setType, tm, newOrder?.color)
                } catch (error) {
                    console.log(error)
                }
                try {
                    get().makePreviewOrderForUser(newOrder?.setType, tm, newOrder?.color)
                } catch (error) {
                    console.log(error)
                }

            },

            makePreviewOrder: (OrderType: string, timestamp: number, defaultColor: string = "#fefefe") => {
                const nOrder = get().newOrders
                const setNumber: string[] = nPermute(nOrder?.number.split(""))
                switch (OrderType) {
                    case "บน":
                        set((state) => ({
                            previewOrder: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: nOrder?.price,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "บน+โต๊ด":
                        set((state) => ({
                            previewOrder: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: nOrder?.price,
                                top: nOrder?.price,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "บน+ล่าง":
                        set((state) => ({
                            previewOrder: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: nOrder?.price,
                                bot: nOrder?.price,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "บน+ล่าง+โต๊ด":
                        set((state) => ({
                            previewOrder: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: nOrder?.price,
                                top: nOrder?.price,
                                bot: nOrder?.price,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "ล่าง":
                        set((state) => ({
                            previewOrder: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: 0,
                                bot: nOrder?.price,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "โต๊ด":
                        set((state) => ({
                            previewOrder: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: nOrder?.price,
                                top: 0,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "ชุด (บน)":

                        set((state) => ({
                            previewOrder: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: 0,
                                    top: nOrder?.price,
                                    bot: 0,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (บน+โต๊ด)":

                        set((state) => ({
                            previewOrder: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: nOrder?.price,
                                    top: nOrder?.price,
                                    bot: 0,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (บน+ล่าง)":

                        set((state) => ({
                            previewOrder: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: 0,
                                    top: nOrder?.price,
                                    bot: nOrder?.price,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (บน+ล่าง+โต๊ด)":

                        set((state) => ({
                            previewOrder: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: nOrder?.price,
                                    top: nOrder?.price,
                                    bot: nOrder?.price,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (ล่าง)":
                        set((state) => ({
                            previewOrder: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: 0,
                                    top: 0,
                                    bot: nOrder?.price,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (โต๊ด)":
                        set((state) => ({
                            previewOrder: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: nOrder?.price,
                                    top: 0,
                                    bot: 0,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;
                    default:
                        set((state) => ({
                            previewOrder: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: nOrder?.price,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            }
                            ]
                        }));
                        break;
                }
            },
            makePreviewOrderForUser: (OrderType: string, timestamp: number, defaultColor: string = "#fefefe") => {
                const nOrder = get().newOrders
                const setNumber: string[] = nPermute(nOrder?.number.split(""))
                switch (OrderType) {
                    case "บน":
                        set((state) => ({
                            previewOrderForUser: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: nOrder?.price,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "บน+โต๊ด":
                        set((state) => ({
                            previewOrderForUser: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: nOrder?.price,
                                top: nOrder?.price,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "บน+ล่าง":
                        set((state) => ({
                            previewOrderForUser: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: nOrder?.price,
                                bot: nOrder?.price,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "ล่าง":
                        set((state) => ({
                            previewOrderForUser: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: 0,
                                bot: nOrder?.price,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "โต๊ด":
                        set((state) => ({
                            previewOrderForUser: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: nOrder?.price,
                                top: 0,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            },]
                        }));
                        break;

                    case "ชุด (บน)":

                        set((state) => ({
                            previewOrderForUser: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: 0,
                                    top: nOrder?.price,
                                    bot: 0,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (บน+โต๊ด)":

                        set((state) => ({
                            previewOrderForUser: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: nOrder?.price,
                                    top: nOrder?.price,
                                    bot: 0,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (บน+ล่าง)":

                        set((state) => ({
                            previewOrderForUser: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: 0,
                                    top: nOrder?.price,
                                    bot: nOrder?.price,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (ล่าง)":
                        set((state) => ({
                            previewOrderForUser: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: 0,
                                    top: 0,
                                    bot: nOrder?.price,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;

                    case "ชุด (โต๊ด)":
                        set((state) => ({
                            previewOrderForUser: [...setNumber.map(nEl => {
                                return {
                                    id: nanoid(),
                                    tm: timestamp,
                                    name: nOrder?.name,
                                    number: nEl,
                                    tod: nOrder?.price,
                                    top: 0,
                                    bot: 0,
                                    sum: 0,
                                    color: defaultColor
                                }
                            })]
                        }));
                        break;
                    default:
                        set((state) => ({
                            previewOrderForUser: [{
                                id: nanoid(),
                                tm: timestamp,
                                name: nOrder?.name,
                                number: nOrder?.number,
                                tod: 0,
                                top: nOrder?.price,
                                bot: 0,
                                sum: 0,
                                color: defaultColor
                            }
                            ]
                        }));
                        break;
                }
            },
            summarize: () => {
                const tempOrders: Order[] = [...get().orders]
                const groupedByComposite: any = {}
                tempOrders.forEach(order => {
                    const key = `${order.name}-${order.color}`
                    if (!groupedByComposite[key]) groupedByComposite[key] = []
                    groupedByComposite[key].push(order)
                })

                const prevSummaryOrders = get().summaryOrders;
                var tempSummmaryOrder: any = []

                Object.keys(groupedByComposite).forEach((key: string) => {
                    const currentGroup = groupedByComposite[key]
                    const firstOrder = currentGroup[0]
                    const name = firstOrder.name
                    const color = firstOrder.color

                    if (name) {
                        const allTop = currentGroup.reduce((acc: any, obj: any) => acc + (obj.top || 0), 0)
                        const allTod = currentGroup.reduce((acc: any, obj: any) => acc + (obj.tod || 0), 0)
                        const allBot = currentGroup.reduce((acc: any, obj: any) => acc + (obj.bot || 0), 0)
                        const allNum: string[] = currentGroup.map((el: any) => el.number)

                        const existingSummary = prevSummaryOrders.find(s => s.name === name && (s as any).color === color);
                        const isPaid = existingSummary ? existingSummary.isPaid : false;

                        var temp: any = {
                            id: existingSummary ? existingSummary.id : nanoid(),
                            name: name,
                            color: color,
                            number: allNum.join(" "),
                            top: allTop,
                            tod: allTod,
                            bot: allBot,
                            sum: allTop + allTod + allBot,
                            isPaid: isPaid
                        }
                        tempSummmaryOrder.push(temp)
                    }
                })

                const total = tempSummmaryOrder?.reduce((accumulator: any, object: any) => {
                    return accumulator + object.sum;
                }, 0)

                const currentAmount = tempSummmaryOrder?.filter((el: any) => el.isPaid).reduce((accumulator: any, object: any) => {
                    return accumulator + object.sum;
                }, 0)

                var orderCnt = 0
                const addedSumOrder = tempOrders.map((order: Order, index: number) => {
                    const prevKey = index - 1 >= 0 ? `${tempOrders[index - 1]?.name}-${tempOrders[index - 1]?.color}` : `${tempOrders[0]?.name}-${tempOrders[0]?.color}`
                    const currentKey = `${order.name}-${order.color}`

                    orderCnt = currentKey === prevKey ? orderCnt + 1 : 1
                    const resultSum = tempSummmaryOrder?.filter((elSum: any) => currentKey === `${elSum?.name}-${elSum?.color}`)

                    return resultSum.length > 0 && orderCnt === (groupedByComposite[currentKey]?.length || 0) ? { ...order, ...{ sum: resultSum[0]?.sum } } : { ...order, ...{ sum: 0 } }
                })

                set((state) => ({
                    orders: addedSumOrder,
                    summaryOrders: tempSummmaryOrder,
                    total,
                    currentAmount
                }));
            },
            clearPreviewOrder: () => {
                set((state) => ({
                    previewOrderForUser: []
                }));
            }
        }),
        {
            name: "mainStore",
        }

    )
);
