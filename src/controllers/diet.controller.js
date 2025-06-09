// Codigo realizado por el equipo
import Diet from "../models/diet.model.js";

// Crear y guardar la información de la dieta del usuario
export const createDiet = async (req, res) => {
  const { type_diet } = req.body;
  console.log("Tipo de dieta recibido:", type_diet);
  console.log("Usuario logueado:", req.user);

  const userId = req.user.userId;

  try {
    // Verificar si el usuario ya tiene una dieta registrada
    const existingDiet = await Diet.findOne({ user: userId });
    if (existingDiet) {
      // Actualizar la dieta existente
      existingDiet.type_diet = type_diet;
      const updatedDiet = await existingDiet.save();
      return res.status(200).json({
        message: "Tipo de dieta actualizado exitosamente",
        data: updatedDiet,
      });
    }

    // Crear nueva dieta si no existe
    const newDiet = new Diet({
      type_diet,
      user: userId,
    });

    const savedDiet = await newDiet.save();
    console.log("Tipo de dieta guardado:", savedDiet);

    res.status(201).json({
      message: "Tipo de dieta guardado exitosamente",
      data: savedDiet,
    });
  } catch (error) {
    console.error("Error al guardar el tipo de dieta:", error);
    res.status(500).json({
      message: "Error al guardar el tipo de dieta",
      error,
    });
  }
};

// Obtener la dieta del usuario
export const getDiet = async (req, res) => {
  const userId = req.user.userId;

  try {
    const diet = await Diet.findOne({ user: userId });
    if (!diet) {
      return res.status(404).json({
        message: "No se encontró información de dieta para este usuario",
      });
    }

    res.json(diet);
  } catch (error) {
    console.error("Error al obtener el tipo de dieta:", error);
    res.status(500).json({
      message: "Error al obtener el tipo de dieta",
      error,
    });
  }
};

/////////////////////////////////////WEB/////////////////////////////////////
// Obtener dieta por ID de usuario (usado por administradores o para mostrar perfil completo)
export const getDietByUserId = async (req, res) => {
  const { id } = req.params; // ID del usuario

  try {
    const diet = await Diet.findOne({ user: id });
    if (!diet) {
      return res.status(404).json({
        message: "No se encontró información de dieta para este usuario",
      });
    }

    res.json(diet);
  } catch (error) {
    console.error("Error al obtener la dieta por ID:", error);
    res.status(500).json({
      message: "Error al obtener la dieta",
      error,
    });
  }
};
export const createOrUpdateDietByUserId = async (req, res) => {
  const { id } = req.params; // ID del usuario
  const { type_diet } = req.body;

  try {
    // Buscar si ya existe una dieta para el usuario
    let diet = await Diet.findOne({ user: id });

    if (!diet) {
      // Si no existe, crear nueva
      diet = new Diet({
        user: id,
        type_diet,
      });
      await diet.save();
      return res.status(201).json({
        message: "Dieta creada exitosamente",
        diet,
      });
    } else {
      // Si existe, actualizar
      diet.type_diet = type_diet || diet.type_diet;
      await diet.save();
      return res.json({
        message: "Dieta actualizada exitosamente",
        diet,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear o actualizar la dieta",
      error: error.message,
    });
  }
};
