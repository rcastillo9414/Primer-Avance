const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "Todos los campos son requeridos" });
    }

    // Validar rol permitido
    const validRoles = ["Administrativo", "Programador", "Dept IT", "ATH"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Rol inválido" });
    }

    // Evitar usuarios repetidos
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role   
    });

    res.json({
      msg: "Usuario creado correctamente",
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (err) {
    console.error("Error creando usuario:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
