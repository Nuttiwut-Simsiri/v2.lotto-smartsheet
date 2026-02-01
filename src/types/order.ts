export type Order =  {
    id: string,
    tm: number,
    name: string,
    number: string,
    tod: number,
    top: number,
    bot: number,
    sum: number,
    color: string
}

export type NewOrder =  {
    id: string,
    tm: number,
    name: string,
    number: string,
    price: number,
    setType: string
    color: string
}

export type SummaryOrder =  {
    id: string,
    name: string,
    number: string,
    tod: number,
    top: number,
    bot: number,
    sum: number,
    isPaid: boolean
}


export type ColorProfile =  {
    name: string,
    color: string
}
