const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("========== LOGIN REQUEST ==========");
    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Debug: show ALL users with this email
    const matchedUsers = await User.find({ email: normalizedEmail }).select(
      "+password fullName email role isActive"
    );

    console.log("MATCHED USERS COUNT:", matchedUsers.length);
    console.log(
      "MATCHED USERS:",
      matchedUsers.map((u) => ({
        id: u._id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
      }))
    );

    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    console.log(
      "FOUND USER:",
      user
        ? {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          }
        : null
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Force true if field missing/undefined, but false should still block
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @desc    Verify Logged-in User
 * @route   GET /api/auth/verify
 * @access  Private
 */
const verifyToken = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * @desc    TEMP Reset Admin Password + activate admin
 * @route   POST /api/auth/reset-admin-password
 * @access  Public (temporary)
 */
const resetAdminPassword = async (req, res) => {
  try {
    const admin = await User.findOne({
      email: "admin@smartiv.com",
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found.",
      });
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    admin.password = hashedPassword;
    admin.isActive = true;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin password reset successfully to Admin@123",
      admin: {
        id: admin._id,
        email: admin.email,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error("Reset Admin Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  login,
  verifyToken,
  resetAdminPassword,
};