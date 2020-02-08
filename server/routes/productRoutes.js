const express = require("express");
const controller = require("../controllers/productController");
const router = express.Router();

router.param("id", controller.checkId); //will execute whenever a param 'id' is in the request

router
  .route("/")
  .get(controller.getProducts)
  .post(controller.insertProducts)
  .delete(controller.deleteProducts);

router
  .route("/:id")
  .post(controller.checkBody, controller.addProduct) //first checkBody is executed then addProduct
  .delete(controller.deleteProduct);

module.exports = router;
