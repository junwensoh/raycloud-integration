const CreateRaycloudOrder = require("../services/RaycloudService/CreateRaycloudOrder");
const FindProduct = require("../services/RaycloudService/FindProduct");

exports.createNewOrder = async (req, res) => {
  console.log("=====Order data received from Shopify webhook=====");
  const orderData = req.body;
  
  const { line_items } = orderData;

  const variantIds = line_items.map((item) => item.variant_id);

  res.json({ success: true });

  // Process variants on order
  variantIds.forEach(async (variantId) => {
    const skuNumber = line_items.filter((lineItem) => lineItem.variant_id === variantId)[0].sku;

    const { success: isRaycloudProduct } = await FindProduct.run(skuNumber);

    if (isRaycloudProduct) {
      console.log("Initiate order creation for raycloud product. sku: " + skuNumber);
      CreateRaycloudOrder.run(orderData, variantId);
    } else {
      console.log("Product sku: " + skuNumber + " not sent for raycloud order creation.");
    }
  });
};
