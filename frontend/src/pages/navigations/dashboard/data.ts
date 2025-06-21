type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}
type DailySales = {
  id: string
  productName: string
  discount: "discount" |  "cashback"
  discountamount: string
  qty:number
  price: string
}
type Inventory = {
    id: string
    productName: string
    qty:number
    price: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]
export const dailySales: DailySales[] = [
  {
    id: "728ed52f",
    productName: "projector",
    qty: 10,
    discount: "discount",
    discountamount: "100",
    price: "1000",
  },
  {
    id: "728sed52f",
    productName: "earphone",
    qty:100,
    discount: "discount",
    discountamount: "10",
    price: "100",
  },
  // ...
]

export const inventory: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]