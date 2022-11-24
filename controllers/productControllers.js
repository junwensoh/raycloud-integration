const UpdateProductVariantQuantity = require("../services/ShopifyService/UpdateProductVariantQuantity");

exports.updateProductInfo = async (req, res) => {
  try {
    console.log("=====Product inventory/price update received from Raycloud webhook=====");
    console.log(request.body);
    const productUpdates = req.body.data;
    console.log(productUpdates);

    res.json({ code: "0", message: "成功", success: true });

    if ("quantity" in productUpdates) {
      const { skuNo, quantity } = productUpdates;

      UpdateProductVariantQuantity.run(skuNo, quantity);
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
