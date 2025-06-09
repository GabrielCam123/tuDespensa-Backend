import { Router } from "express";
import { generarReporteEjecutivo } from "../controllers/reportes.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
// Si tienes middleware isAdmin, puedes proteger aún más la ruta ejecutiva:
// import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

// Ruta protegida para obtener el reporte ejecutivo
router.get("/ejecutivo", authRequired, generarReporteEjecutivo);
// Si decides usar control de rol:
// router.get("/ejecutivo", authRequired, isAdmin, generarReporteEjecutivo);

export default router;
