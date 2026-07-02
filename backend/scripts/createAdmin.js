require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    // Connect Database
    await connectDB();

    // Check if Admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@smartiv.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Super Admin already exists.");
      process.exit();
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create Admin
    const admin = await User.create({
      fullName: "Super Admin",
      email: "admin@smartiv.com",
      password: hashedPassword,

      role: "Admin",

      department: "Administration",

      employeeId: "EMP001",

      phone: "",

      profileImage: "",

      isActive: true,
    });

    console.log("✅ Super Admin Created Successfully");
    console.log(admin.email);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();