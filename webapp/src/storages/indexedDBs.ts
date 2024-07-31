import { BinanceIDB } from "@workspace/indexeddb-binance"
import { ErrorsIDB } from "@workspace/indexeddb-errors"
import { OrdersIDB } from "@workspace/indexeddb-orders"

export const binanceIDB = new BinanceIDB()
export const errorsIDB = new ErrorsIDB()
export const ordersIDB = new OrdersIDB()
