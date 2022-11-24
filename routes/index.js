const express = require("express");

const ordersRoute = require("./orders");
const productsRoute = require("./products");

const router = express.Router();

module.exports = () => {
  router.get("/", (req, res) => {
    res.send({ message: `This is the Ox Luxe's ${process.env.NODE_ENV} server.  Please visit us at: ${process.env.OXLUXE_ADDRESS} for consignment or selling of your luxury goods!` }); 
  });
  router.use("/api/raycloud/product", productsRoute());
  router.use("/api/oxluxe/order", ordersRoute());
  return router;
};
