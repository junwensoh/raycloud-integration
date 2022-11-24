const UpdateProductVariantQuantity = require("../services/ShopifyService/UpdateProductVariantQuantity");

exports.updateProductInfo = async (req, res, next) => {
  try {
    console.log("=====Product inventory/price update received from Raycloud webhook=====");

    const productUpdates = req.body.data[0];

    if ("quantity" in productUpdates) {
      const { skuNo, quantity } = productUpdates;

      UpdateProductVariantQuantity.run(skuNo, quantity);
      
      res.json({ code: "0", message: "成功", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
