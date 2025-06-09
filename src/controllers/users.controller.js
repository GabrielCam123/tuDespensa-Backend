import { User } from "../models/user.model.js";
import { information } from "../models/information.model.js";
import bcrypt from "bcryptjs";
export const getUsers = async (req, res) => {
  const users = await User.find();
  //}).populate('user') remplaza en la linea 8
  // esto nos dara toda la inf del usuario si es que lo necesitamos
  res.json(users);
};

export const createUsers = async (req, res) => {
  //para crear y guardar una nueva tarea "esto se puede usar para la lista de la despena?"
  const { username, email, password, role } = req.body;

  const newUser = new User({
    username,
    email,
    password,
    role,
    //para agarrar el id del usuario logeado usamos
    // user: req.user.id,
  });
  //guardamos
  const savedUser = await newUser.save();
  res.json(savedUser);
};

export const getTask = async (req, res) => {
  //buscar una tarea en especifico mediante el id
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const deleteUser = async (req, res) => {
  //buscar una tarea en especifico mediante el id y lo elimina usando 'findByIdAndDelete'
  const user = await User.findByIdAndUpdate(req.params.id, { status: false });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.sendStatus(204); //el 204 es un mensaje de que todo salio bien pero no retornara nada
};

export const updateUser = async (req, res) => {
  try {
    console.log("ID recibido:", req.params.id);
    console.log("Datos recibidos:", req.body);

    const { password, ...rest } = req.body; // Separamos la contraseña del resto

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Actualiza los campos normales
    Object.assign(user, rest);

    // Si se envió una nueva contraseña, la encriptamos
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Guardamos el usuario actualizado
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};
/////////////////////////////////////WEB/////////////////////////////////////
// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      profilephoto: user.profilePhoto || "imgsUsr/default.jpg",
      plan: user.plan,
    });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};
// controllers/users.controller.js

// export const createUsersWeb = async (req, res) => {
//   try {
//     console.log("req.body:", req.body);
//     console.log("req.file:", req.file);

//     const { username, email, password, role, status } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "Faltan datos obligatorios" });
//     }

//     const userExists = await User.findOne({ $or: [{ username }, { email }] });
//     if (userExists) {
//       return res
//         .status(409)
//         .json({ message: "Usuario o email ya registrados" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     let profilePhotoPath = "imgsUsr/default.jpg";
//     if (req.file) {
//       profilePhotoPath = `imgsUsr/${req.file.filename}`;
//     }

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: role || "Usuario",
//       status: status === "true" || status === true, // <-- corregido
//       profilePhoto: profilePhotoPath,
//     });

//     await newUser.save();

//     res
//       .status(201)
//       .json({ message: "Usuario creado correctamente", user: newUser });
//   } catch (error) {
//     console.error("Error creando usuario:", error);
//     res.status(500).json({ message: "Error en el servidor" });
//   }
// };
export const createUsersWeb = async (req, res) => {
  try {
    // Obtener campos del body
    const {
      username,
      email,
      password,
      role,
      status,
      Nombre,
      Apellidos,
      Estatura,
      Peso,
      Edad,
      Genero,
    } = req.body;

    // Crear usuario (foto viene en req.file.filename si multer lo capturó)
    const newUser = new User({
      username,
      email,
      password, // Asegúrate de hashear en el modelo o antes de guardar
      role,
      status,
      profilephoto: req.file ? req.file.filename : null,
    });

    // Guardar usuario en DB
    await newUser.save();

    // Crear info personal asociada
    const newInformation = new information({
      Nombre,
      Apellidos,
      Estatura,
      Peso,
      Edad,
      Genero,
      user: newUser._id, // Relación con usuario creado
    });

    // Guardar info personal
    await newInformation.save();

    // Responder OK con los datos creados
    res.status(201).json({
      message: "Usuario e información creados correctamente",
      user: newUser,
      information: newInformation,
    });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({
      message: "Error creando usuario e información",
      error: error.message,
    });
  }
};

export const updateUserWeb = async (req, res) => {
  const { id } = req.params;

  const { username, email, role, status, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Verificamos si hay archivo
    let profilePhotoPath = user.profilePhoto;

    if (req.file) {
      // Borrar imagen anterior si no es la por defecto
      if (user.profilePhoto && user.profilePhoto !== "imgsUsr/default.jpg") {
        const previousImagePath = path.join("public", user.profilePhoto);
        if (fs.existsSync(previousImagePath)) {
          fs.unlinkSync(previousImagePath);
        }
      }

      profilePhotoPath = `imgsUsr/${req.file.filename}`;
    }

    // Actualizar los campos
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status === "true" || status === true;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.profilePhoto = profilePhotoPath;

    await user.save();

    res.json({
      message: "Usuario actualizado correctamente",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        profilephoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const subirFotoPerfil = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ninguna imagen" });
    }

    const imagePath = `imgsUsr/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Foto de perfil actualizada",
      profilePhoto: imagePath,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
