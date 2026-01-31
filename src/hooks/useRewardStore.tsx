import { create } from 'zustand'
import { persist } from "zustand/middleware";
import { HPNumbersProps, Rewards } from '@/model/rewards';

interface RewardnHPNumbersState {
    rewards: Rewards;
    HPNumbers: HPNumbersProps;
    topTwoDigit: string;
    botTwoDigit: string;
    topThreeDigit: string;
    botThreeDigit1: string;
    botThreeDigit2: string;
    allWinOrders: number;
    setRewards: (newPrice: Partial<Rewards>) => void;
    setAllWinOrders: (num: number) => void;
    setHPN: (newNumbers: string, key: string) => void;
    setRewardDigit: (num: string, key: string) => void;
}



export const useRewardnHPStore = create<RewardnHPNumbersState>()(
    persist(
        (set, get) => ({
            rewards: {
                topThreeDigit: "900",
                todThreeDigit: "150",
                botThreeDigit: "450",
                top2Digit: "90"
            },
            HPNumbers: {
                threeDigit: ["3 บน เต็ง โต๊ด", "", "/"],
                twoDigit: ["2 บน-ล่าง", "", "/"],
            },
            topTwoDigit: "",
            botTwoDigit: "",
            topThreeDigit: "",
            botThreeDigit1: "",
            botThreeDigit2: "",
            allWinOrders: 0,
            setAllWinOrders: (num: number) => {
                set((state) => ({
                    allWinOrders: num,
                }))
            },
            setRewardDigit: (num: string, key: string) => {
                switch (key) {
                    case "top2digit":
                        set((state) => ({
                            topTwoDigit: num,
                        }));
                        break;

                    case "bot2digit":
                        set((state) => ({
                            botTwoDigit: num,
                        }));
                        break;

                    case "top3digit":
                        set((state) => ({
                            topThreeDigit: num,
                        }));
                        break;

                    case "bot3digit1":
                        set((state) => ({
                            botThreeDigit1: num,
                        }));
                        break;

                    case "bot3digit2":
                        set((state) => ({
                            botThreeDigit2: num,
                        }));
                        break;

                    default:
                        console.log("key ", key, num)
                        break;
                }
            },
            setRewards: (newPrice: any) => {
                set((state) => ({
                    rewards: { ...state.rewards, ...newPrice },
                }));
            },
            setHPN: (newNumbers: string, key: string) => {
                var temp = get().HPNumbers
                const formattedNUmbers = newNumbers.split("\n").join(" ")
                if (key == "3 บน เต็ง โต๊ด") {
                    temp.threeDigit[1] = formattedNUmbers
                } else {
                    temp.twoDigit[1] = formattedNUmbers
                }
                set((state) => ({
                    HPNumbers: { ...state.HPNumbers, ...temp },
                }));
            },

        }), {
        name: "Reward&HPNumbers"
    }
    )
);