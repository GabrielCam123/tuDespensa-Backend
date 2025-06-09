import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  deleteUser,
  getUsers,
  updateUser,
  getUserById,
  createUsersWeb,
  updateUserWeb,
  subirFotoPerfil,
} from "../controllers/users.controller.js";
import upload from "../middlewares/uploads.js";
import { getUserProfileApp } from "../controllers/user.controller.js";

const router = Router();

//aqui llamamos a authRequired antes para ver que el usuario este logeado
//router.get('/tasks', authRequired, (req, res) => res.send('tasks'))

//este es un ejemplo para hacer el crud
router.get("/users", authRequired, getUsers);

// router.get("/tasks/:id", authRequired, getTask);

// router.post("/tasks", authRequired, createTasks);

router.delete("/user/:id", authRequired, deleteUser);

//router.put("/user/:id", authRequired, updateUser);

// Ruta para la web
router.get("/users/profile", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
});

// Ruta para la app móvil
router.get("/profileApp", authRequired, getUserProfileApp);

router.get("/users/:id", authRequired, getUserById);

//////////////////////////////////WEB///////////////////////////////////

router.post(
  "/users",
  (req, res, next) => {
    upload.single("profilephoto")(req, res, (err) => {
      if (err) {
        console.error("Error en multer:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createUsersWeb
);

router.put("/user/:id", upload.single("image"), updateUserWeb);
router.put("/user/:id/upload-photo", upload.single("image"), subirFotoPerfil);
export default router;
