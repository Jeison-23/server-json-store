import saleModel from "../models/saleModel.js"

export const productReport = async (_, { filter = {} }) => {
  try {
    const { _id, producId, customerId, cardNumber, hour, dayMonth, month, year } = filter
    const query = {}
    if (_id) query._id = _id
    if (customerId) query.customerId = customerId
    if (cardNumber) query.cardNumber = cardNumber
    if (month) query["createAt.month"] = month
    if (year) query["createAt.year"] = year
    if (dayMonth) query["createAt.dayMonth"] = dayMonth

    const sales = await saleModel.find(query)

    const saleOfTheDay = await saleModel.aggregate([])
      .match(query)
      .group({
        _id: 'Suma',
        totalSales: { $sum: "$totalSale" }
      })

    const topSellers = []
    sales.map(p => p.purchasedItems.map(r => topSellers.push(r)))

    const result = []

    const verification = (assess) => result.findIndex((ele) => ele._id === assess)

    const x = topSellers.map((ele, i) => {
      if (result.length) {
        if (verification(ele._id) >= 0) {
          const original = result[verification(ele._id)]
          const update = { ...original, quantity: ele.quantity + original.quantity }
          result[verification(ele._id)] = update

        } else {
          result.push(ele)

        }
      } else {
        result.push(ele)
      }
    })

    const top = result.sort((a, b) => b.quantity - a.quantity)

    const topResult = []

    for (let i = 0; i < top.length; i++) {
      if (top[0].quantity === top[i].quantity) {
        topResult.push(top[i])
      }
    }

    const data = sales.map(p => (
      {
        _id: p?._id,
        customerId: p?.customerId,
        productsSold: p?.purchasedItems?.length,
        purchasedItems: p?.purchasedItems,
        totalSale: p?.totalSale,
        createAt: p?.createAt
      }
    ))

    return {
      data,
      topProducts: topResult,
      sales: saleOfTheDay[0],
    }

  } catch (e) {
    return e
  }
}
