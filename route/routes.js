const express = require("express");


const controller = require("../controller/controller");

const route = express.Router();

route.get("/books", controller.getBooks);
route.get("/user/:id", controller.getUser);
route.get("/issues/:id", controller.getIssues);
route.post("/issue", controller.postIssue);
route.post("/return", controller.postReturn);
route.get("/login", controller.loginCheck);
route.post("/add", controller.postAdd);
route.get("/wishlist/:id", controller.getWishlist);
route.post("/addWishlist", controller.postAddToWishlist);
route.post("/removeWishlist", controller.postRemoveWishlist);

module.exports = route;
