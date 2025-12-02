const Worklog = require('../models/Worklog');
const mongoose = require('mongoose');

// Horas por proyecto
exports.hoursPerProject = async (req, res) => {
  try {
    const match = {};

    if (req.query.project)
      match.project = new mongoose.Types.ObjectId(req.query.project);

    if (req.query.from || req.query.to) {
      match.date = {};
      if (req.query.from) match.date.$gte = new Date(req.query.from);
      if (req.query.to) match.date.$lte = new Date(req.query.to);
    }

    const agg = await Worklog.aggregate([
      { $match: match },
      { $group: { _id: "$project", totalHours: { $sum: "$totalHours" } } },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          project: "$project.name",
          projectCode: "$project.code",
          totalHours: 1
        }
      }
    ]);

    res.json(agg);

  } catch (err) {
    console.error("hoursPerProject", err);
    res.status(500).json({ msg: err.message });
  }
};

// Productividad por usuario (RENOMBRADO)
exports.productivityPerUser = async (req, res) => {
  try {
    const match = {};

    if (req.query.from || req.query.to) {
      match.date = {};
      if (req.query.from) match.date.$gte = new Date(req.query.from);
      if (req.query.to) match.date.$lte = new Date(req.query.to);
    }

    const agg = await Worklog.aggregate([
      { $match: match },
      { $group: { _id: "$user", totalHours: { $sum: "$totalHours" } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          user: "$user.name",
          email: "$user.email",
          totalHours: 1
        }
      }
    ]);

    res.json(agg);

  } catch (err) {
    console.error("productivityPerUser", err);
    res.status(500).json({ msg: err.message });
  }
};
