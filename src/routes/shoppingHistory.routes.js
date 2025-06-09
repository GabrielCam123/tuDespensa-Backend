import { Router } from "express";
import {
  generateShoppingHistoryReport,
  completeShoppingList,
  getHistoryByUserId,
} from "../controllers/shoppingHistory.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/report", authRequired, generateShoppingHistoryReport);
router.post("/complete/:listId", authRequired, completeShoppingList);

/////////////////////////////////////WEB/////////////////////////////////////
router.get("/user/:id", authRequired, getHistoryByUserId);

export default router;
