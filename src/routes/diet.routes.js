// Codigo realizado por el equipo
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createDiet,
  getDiet,
  getDietByUserId,
  createOrUpdateDietByUserId,
} from "../controllers/diet.controller.js";

const router = Router();

// Ruta para crear la dieta del usuario
router.post("/diet", authRequired, createDiet);

// Ruta para actualizar la dieta del usuario
router.put("/diet", authRequired, createDiet);

// Ruta para obtener la dieta del usuario
router.get("/diet", authRequired, getDiet);

/////////////////////////////////////WEB/////////////////////////////////////
router.get("/diet/user/:id", getDietByUserId);
export default router;

// Crear o actualizar dieta por usuario
router.put("/diet/user/:id", createOrUpdateDietByUserId);
