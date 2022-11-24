const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");

module.exports = () => {
  router.route("/")
  .post(productControllers.updateProductInfo)

  return router;
};
