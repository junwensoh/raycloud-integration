const express = require("express");
const bodyParser = require("body-parser");
const CreateRaycloudOrder = require("./RaycloudService/CreateRaycloudOrder");
const FindProduct = require("./RaycloudService/FindProduct");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ message: `This is the Ox Luxe's ${process.env.NODE_ENV} server.  Please visit us at: ${process.env.OXLUXE_ADDRESS} for consignment or selling of your luxury goods!` }); 
});

app.post("/api/oxluxe/order", (req, res) => {
  console.log("=====Order data received from Shopify webhook=====");
  const orderData = req.body;

  const { line_items } = orderData;

  const variantIds = line_items.map((item) => item.variant_id);

  res.json({ success: true });

  // Process variants on order
  variantIds.forEach(async (variantId) => {
    const skuNumber = line_items.filter(lineItem => lineItem.variant_id === variantId)[0].sku;

    const {success: isRaycloudProduct} = await FindProduct.run(skuNumber);

    if (isRaycloudProduct) {
      console.log("Initiate order creation for raycloud product. sku: " + skuNumber);
      CreateRaycloudOrder.run(orderData, variantId);
    } else {
      console.log("Product sku: " + skuNumber + " not sent for raycloud order creation.")
    }
  });
});

app.post("/api/raycloud/product", (req, res) => {
  console.log("=====Product inventory/price update received from Raycloud webhook=====");
  const body = req.body;
  console.log(body);
  res.json({ code: "0", message: "成功", success: true });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("App running on port 8080...");
});
