const User = require("../models/User");

/**
 * =========================================
 * CREATE USER
 * POST /api/users
 * =========================================
 */
const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      employeeId,
      phone,
      role,
      department,
      status,
    } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, password and role are required.",
      });
    }

    const allowedRoles = ["Admin", "Doctor", "Nurse"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed roles are Admin, Doctor, Nurse.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      employeeId: employeeId || "",
      phone: phone || "",
      role,
      department: department || "",
      status: status || "Active",
    });

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: `${role} created successfully.`,
      data: safeUser,
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * GET ALL USERS
 * GET /api/users
 * =========================================
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, search, status } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * GET SINGLE USER
 * GET /api/users/:id
 * =========================================
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * UPDATE USER
 * PUT /api/users/:id
 * =========================================
 */
const updateUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      employeeId,
      phone,
      role,
      department,
      status,
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: user._id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Another user already uses this email.",
        });
      }
    }

    if (role) {
      const allowedRoles = ["Admin", "Doctor", "Nurse"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role.",
        });
      }
    }

    user.fullName = fullName ?? user.fullName;
    user.email = email ? email.toLowerCase().trim() : user.email;
    user.employeeId = employeeId ?? user.employeeId;
    user.phone = phone ?? user.phone;
    user.role = role ?? user.role;
    user.department = department ?? user.department;
    user.status = status ?? user.status;

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: safeUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * DELETE USER
 * DELETE /api/users/:id
 * =========================================
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * GET DOCTORS
 * GET /api/users/doctors
 * =========================================
 */
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "Doctor",
      status: "Active",
    })
      .select("_id fullName email role employeeId")
      .sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors.",
    });
  }
};

/**
 * =========================================
 * GET NURSES
 * GET /api/users/nurses
 * =========================================
 */
const getNurses = async (req, res) => {
  try {
    const nurses = await User.find({
      role: "Nurse",
      status: "Active",
    })
      .select("_id fullName email role employeeId")
      .sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      count: nurses.length,
      data: nurses,
    });
  } catch (error) {
    console.error("Get Nurses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch nurses.",
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDoctors,
  getNurses,
};