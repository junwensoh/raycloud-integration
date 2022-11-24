const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers");

module.exports = () => {
  router.route("/")
  .post(orderControllers.createNewOrder)

  return router;
};
