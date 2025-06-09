import { User } from "../models/user.model.js";
import ShoppingListHistory from "../models/shoppinglisthistory.model.js";

export const generarReporteEjecutivo = async (req, res) => {
  try {
    const { desde, hasta, tipo } = req.query;

    // Construir filtro de fechas
    const filtroFecha = {};
    if (desde) filtroFecha.$gte = new Date(desde);
    if (hasta) filtroFecha.$lte = new Date(hasta);

    // Filtro para usuarios por tipo de plan
    const filtroTipo = {};
    if (tipo === "premium") filtroTipo.plan = "Premium";
    if (tipo === "gratuito") filtroTipo.plan = { $ne: "Premium" };

    // Combinar filtros
    const filtroUsuarios = {
      ...filtroTipo,
      ...(Object.keys(filtroFecha).length > 0 && { createdAt: filtroFecha }),
    };

    // Total de usuarios según filtro
    const totalUsuarios = await User.countDocuments(filtroUsuarios);

    // Total de usuarios con plan Premium y Gratuito (sin filtro de fecha para tener dato general)
    const usuariosPremium = await User.countDocuments({ plan: "Premium" });
    const usuariosGratuitos = await User.countDocuments({
      plan: { $ne: "Premium" },
    });

    // Obtener lista de usuarios que cumplen con el filtro
    const usuariosRegistrados = await User.find(filtroUsuarios)
      .select("username email plan createdAt")
      .sort({ createdAt: -1 });

    // Agrupar por mes para registros mensuales
    const registrosMensuales = await User.aggregate([
      { $match: filtroUsuarios },
      {
        $group: {
          _id: { $month: "$createdAt" },
          cantidad: { $sum: 1 },
        },
      },
      {
        $project: {
          mes: {
            $let: {
              vars: {
                meses: [
                  "",
                  "Enero",
                  "Febrero",
                  "Marzo",
                  "Abril",
                  "Mayo",
                  "Junio",
                  "Julio",
                  "Agosto",
                  "Septiembre",
                  "Octubre",
                  "Noviembre",
                  "Diciembre",
                ],
              },
              in: { $arrayElemAt: ["$$meses", "$_id"] },
            },
          },
          cantidad: 1,
          _id: 0,
        },
      },
      { $sort: { mes: 1 } },
    ]);

    // Top 5 usuarios más activos
    const topUsuariosActivos = await ShoppingListHistory.aggregate([
      {
        $group: {
          _id: "$user",
          totalListas: { $sum: 1 },
        },
      },
      { $sort: { totalListas: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "usuario",
        },
      },
      { $unwind: "$usuario" },
      {
        $project: {
          _id: 0,
          userId: "$usuario._id",
          username: "$usuario.username",
          email: "$usuario.email",
          totalListas: 1,
        },
      },
    ]);

    res.json({
      totalUsuarios,
      usuariosPremium,
      usuariosGratuitos,
      registrosMensuales,
      topUsuariosActivos,
      usuariosRegistrados,
    });
  } catch (error) {
    console.error("Error al generar el reporte ejecutivo:", error);
    res.status(500).json({
      message: "Error al generar el reporte ejecutivo",
      error,
    });
  }
};
