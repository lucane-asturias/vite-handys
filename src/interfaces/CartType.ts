export type Cart = { id: number, cnt: number }

export interface CartToken {
    cart:       Cart[] | null
    token:      string
    needUpdate: boolean
}