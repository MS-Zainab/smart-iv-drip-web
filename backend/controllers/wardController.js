const Ward = require("../models/Ward");

/**
 * =========================================
 * GET ALL WARDS
 * GET /api/wards
 * =========================================
 */
const getAllWards = async (req, res) => {
  try {
    const wards = await Ward.find({})
      .select("_id wardName wardCode floor capacity status")
      .sort({ wardName: 1 });

    return res.status(200).json({
      success: true,
      count: wards.length,
      data: wards,
    });
  } catch (error) {
    console.error("Get All Wards Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * GET SINGLE WARD
 * GET /api/wards/:id
 * =========================================
 */
const getWardById = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: ward,
    });
  } catch (error) {
    console.error("Get Ward By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * CREATE WARD
 * POST /api/wards
 * =========================================
 */
const createWard = async (req, res) => {
  try {
    const { wardName, wardCode, floor, capacity, status } = req.body;

    if (!wardName || !wardCode) {
      return res.status(400).json({
        success: false,
        message: "wardName and wardCode are required.",
      });
    }

    const existingWard = await Ward.findOne({
      $or: [{ wardName }, { wardCode }],
    });

    if (existingWard) {
      return res.status(400).json({
        success: false,
        message: "Ward with same name/code already exists.",
      });
    }

    const ward = await Ward.create({
      wardName,
      wardCode,
      floor: floor || "",
      capacity: capacity || 0,
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Ward created successfully.",
      data: ward,
    });
  } catch (error) {
    console.error("Create Ward Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * UPDATE WARD
 * PUT /api/wards/:id
 * =========================================
 */
const updateWard = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    const { wardName, wardCode, floor, capacity, status } = req.body;

    if (wardCode && wardCode !== ward.wardCode) {
      const existingCode = await Ward.findOne({ wardCode });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: "Ward code already exists.",
        });
      }
    }

    if (wardName && wardName !== ward.wardName) {
      const existingName = await Ward.findOne({ wardName });
      if (existingName) {
        return res.status(400).json({
          success: false,
          message: "Ward name already exists.",
        });
      }
    }

    ward.wardName = wardName ?? ward.wardName;
    ward.wardCode = wardCode ?? ward.wardCode;
    ward.floor = floor ?? ward.floor;
    ward.capacity = capacity ?? ward.capacity;
    ward.status = status ?? ward.status;

    await ward.save();

    return res.status(200).json({
      success: true,
      message: "Ward updated successfully.",
      data: ward,
    });
  } catch (error) {
    console.error("Update Ward Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * =========================================
 * DELETE WARD
 * DELETE /api/wards/:id
 * =========================================
 */
const deleteWard = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found.",
      });
    }

    await Ward.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Ward deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Ward Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllWards,
  getWardById,
  createWard,
  updateWard,
  deleteWard,
};