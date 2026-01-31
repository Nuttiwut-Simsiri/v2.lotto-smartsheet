import { create } from 'zustand'
import { persist } from "zustand/middleware";
import { Order, SummaryOrder, NewOrder } from '../model/order';
import { nanoid } from 'nanoid'


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
                set((state) => ({
                    uniqOrder: [...new Map(state.orders.map(item => [item["name"], item])).values()].filter(el => el.name)
                }));
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
                                top: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + object.top, 0),
                                bot: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + object.bot, 0),
                                tod: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + object.tod, 0)
                            }
                        }
                    })

                    return f_result

                }).flat()

                set((state) => ({
                    orders: final_result,
                }));

                set((state) => ({
                    uniqOrder: [...new Map(state.orders.map(item => [item["name"], item])).values()].filter(el => el.name)
                }));

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
                                top: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + object.top, 0),
                                bot: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + object.bot, 0),
                                tod: groupedNumber[n].reduce((accumulator: any, object: any) => accumulator + object.tod, 0)
                            }
                        }
                    })

                    return f_result

                }).flat()

                console.log(final_result)

                set((state) => ({
                    orders: final_result,
                }));

                // get unique user
                set((state) => ({
                    uniqOrder: [...new Map(state.orders.map(item => [item["name"], item])).values()].filter(el => el.name)
                }));

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
                set((state) => ({
                    orders: removedData,
                    uniqOrder: [...new Map(removedData?.map(item => [item["name"], item])).values()].filter(el => el.name)
                }));
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
                var temp = get().orders
                temp[index] = { ...temp[index], ...newData }
                set((state) => ({
                    orders: temp,
                    uniqOrder: [...new Map(temp.map(item => [item["name"], item])).values()].filter(el => el.name)
                }));
                get().summarize()
            },
            changeColor: (newData: object, name: string) => {
                var temp = get().orders.map((el, index) => {
                    return el.name == name ? { ...get().orders[index], ...newData } : get().orders[index]
                })
                set((state) => ({
                    orders: temp,
                    uniqOrder: [...new Map(temp.map(item => [item["name"], item])).values()].filter(el => el.name)
                }));
                get().summarize()
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
                console.log("setNumber :: ", setNumber)
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
                console.log("ForUser : setNumber :: ", setNumber)
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

                const groupedOrders: any = groupBy(tempOrders, "name")

                const prevSummaryOrders = get().summaryOrders;
                var tempSummmaryOrder: any = []

                Object.keys(groupedOrders).forEach((key: string) => {
                    if (key) {
                        const allTop = groupedOrders[key].reduce((accumulator: any, object: any) => {
                            return accumulator + object.top;
                        }, 0)
                        const allTod = groupedOrders[key].reduce((accumulator: any, object: any) => {
                            return accumulator + object.tod;
                        }, 0)
                        const allBot = groupedOrders[key].reduce((accumulator: any, object: any) => {
                            return accumulator + object.bot;
                        }, 0)

                        const allNUm: string[] = groupedOrders[key].map((el: any) => el.number)

                        // Look for existing paid status for this customer
                        const existingSummary = prevSummaryOrders.find(s => s.name === key);
                        const isPaid = existingSummary ? existingSummary.isPaid : false;

                        var temp: SummaryOrder = {
                            id: existingSummary ? existingSummary.id : nanoid(),
                            name: key,
                            number: allNUm.join(" "),
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
                    const prevName = index - 1 > 0 ? tempOrders[index - 1]?.name : tempOrders[0]?.name
                    orderCnt = order?.name === prevName ? orderCnt + 1 : 1
                    const resultSum: SummaryOrder[] = tempSummmaryOrder?.filter((elSum: SummaryOrder) => order?.name === elSum?.name)
                    return resultSum.length > 0 && orderCnt === groupedOrders[order?.name].length ? { ...order, ...{ sum: resultSum[0]?.sum } } : { ...order, ...{ sum: 0 } }
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
