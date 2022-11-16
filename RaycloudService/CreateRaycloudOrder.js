const RaycloudService = require("./RaycloudService");

class CreateRaycloudOrder extends RaycloudService {
  constructor() {
    super();
  }
  static async run(order, variantId) {
    // extract order data sent from webhook
    const {price,quantity,sku,total_discount: itemDiscount} = order.line_items.filter((item) => item.variant_id == variantId)[0];
    const discountTotal = Math.round(order.total_discounts_set.shop_money.amount);
    const currency = order.currency;
    const shippingFeeTotal = order.total_shipping_price_set.presentment_money.amount;

    try {
      // construct shape of data to be sent to raycloud
      const body = {
        importType: "1",
        orderTime: `${super.getCurrentTime("HH:MM:SS")}`,
        salePriceTotal: order.total_price,
        skus: [
          {
            shippingFee: "0",
            salePrice: price,
            qty: `${quantity}`,
            skuNo: sku,
            discount: `${Math.round(itemDiscount)}`,
            currency: currency,
            tax: `${(order.total_price - price).toFixed(2)}`,
          },
        ],
        discountTotal: discountTotal,
        channelNo: process.env.RAYCLOUD_CHANNEL_NUMBER,
        receiverInfo: {
          country: order.shipping_address.country,
          addressDetail: process.env.OXLUXE_ADDRESS,
          districtName: order.shipping_address.country,
          city: order.shipping_address.country,
          receiverName: "Sean Lim",
          postalCode: process.env.OXLUXE_POSTAL_CODE,
          receiverMobile: "+65 9675 1008",
          provinceName: order.shipping_address.country,
        },
        currency: currency,
        shippingFeeTotal: shippingFeeTotal,
        merchantOrderNo: "J99999999930",
      };

      console.log("======= Order Details sent to Raycloud =======");
      console.log("body:" + JSON.stringify(body));
      const signatureComposition = `channelNo=${process.env.RAYCLOUD_CHANNEL_NUMBER}&currency=${currency}&discountTotal=${discountTotal}&importType=1&merchantOrderNo=J99999999930&orderTime=${super.getCurrentTime(
        "HH:MM:SS"
      )}&receiverInfo={addressDetail=${process.env.OXLUXE_ADDRESS}&city=${order.shipping_address.country}&country=${order.shipping_address.country}&districtName=${order.shipping_address.country}&postalCode=${process.env.OXLUXE_POSTAL_CODE}&provinceName=${order.shipping_address.country}&receiverMobile=+65 9675 1008&receiverName=Sean Lim}&salePriceTotal=${order.total_price}&shippingFeeTotal=${shippingFeeTotal}&skus=[{currency=${currency}&discount=${Math.round(itemDiscount)}&qty=${quantity}&salePrice=${price}&shippingFee=0&skuNo=${sku}&tax=${(order.total_price - price).toFixed(2)}}]:${super.getCurrentTime(
        "HH:MM"
      )}:${process.env.RAYCLOUD_APP_SECRET}`;
      
      const hash = super.createMD5Hash(signatureComposition);
    
      const response = super.fetchFromRaycloud("/raycloud-openapi-business/order/add", hash, body);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}


module.exports = CreateRaycloudOrder;
