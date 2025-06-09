import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// imagen para profile
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import userRoutes from "./routes/user.routes.js";
import usersRoutes from "./routes/users.routes.js";

//Segales -- Aplicacion
import goalRoutes from "./routes/goal.routes.js";
import informationRoutes from "./routes/information.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import shoppingListRoutes from "./routes/shoppingList.routes.js";
import despensaRoutes from "./routes/despensa.routes.js";
import shoppingHistoryRoutes from "./routes/shoppingHistory.routes.js";
import dietRoutes from "./routes/diet.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
//Veizan --Calorias Aplicación
import caloriesRoutes from "./routes/calories.routes.js";

//Reports
import reportsRoutes from "./routes/reports.routes.js";
import shoppingReportsRoutes from "./routes/shoppingReports.routes.js";

import reportesRoutes from "./routes/reportes.route.js";
const app = express();

app.use(morgan("dev"));
console.log("frontend URL:", process.env.IP_LOCAL_FRONTEND);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.IP_LOCAL_FRONTEND,
    //origin: "https://frontend-production-29e6.up.railway.app",
    credentials: true,
  })
);
// Rutas de autenticación y usuarios
app.use("/api", authRoutes);
app.use("/api/tasks", tasksRoutes);

// Segales -- Aplicacion
app.use("/api", goalRoutes);
app.use("/api", informationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", shoppingListRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api", despensaRoutes);
app.use("/api/shopping-history", shoppingHistoryRoutes);
app.use("/api", dietRoutes);
app.use("/api", recipeRoutes);

// ⬇️ Aquí agregamos la carpeta imgsUsr como carpeta estática
app.use("/imgsUsr", express.static(path.join(__dirname, "imgsUsr")));

//Cameo -- Web
app.use("/api", caloriesRoutes);
app.use("/api/shopping/reports", shoppingReportsRoutes);

app.use("/api", userRoutes);
app.use("/api", usersRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/reportes", reportesRoutes);

export default app;
