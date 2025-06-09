// routes/despensa.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createOrUpdateDespensaList,
  getDespensaList,
  getDespensaByUserId,
} from "../controllers/despensa.controller.js";

const router = Router();

router.post("/despensa-list", authRequired, createOrUpdateDespensaList);
router.get("/despensa-list", authRequired, getDespensaList);

/////////////////////////////////////WEB/////////////////////////////////////
router.get("/despensa/user/:id", authRequired, getDespensaByUserId);

export default router;
