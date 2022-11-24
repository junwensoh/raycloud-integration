const RaycloudService = require("./RaycloudService");

class FindProduct extends RaycloudService {
  constructor() {
    super();
  }
  static async run(skuNumber) {
    try {
      const body = {
        channelNo: process.env.RAYCLOUD_CHANNEL_NUMBER,
        skuNo: `${skuNumber}`
      };
      const signatureComposition = `channelNo=${process.env.RAYCLOUD_CHANNEL_NUMBER}&skuNo=${skuNumber}:${super.getCurrentTime("HH:MM")}:${process.env.RAYCLOUD_APP_SECRET}`;
      const hash = super.createMD5Hash(signatureComposition);
      const response = super.fetchFromRaycloud("/raycloud-openapi-business/stock/single", hash, body);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = FindProduct;
