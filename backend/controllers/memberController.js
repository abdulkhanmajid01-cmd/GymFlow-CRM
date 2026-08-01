// Import Member Model
const Member = require("../models/Member");

// Import Helper
const checkEmailExists = require("../utils/checkEmailExists");


// ==========================
// Create Member
// ==========================
const createMember = async (req, res) => {
  try {
    // Get email from request body
    const { email } = req.body;

    // Check if email already exists in the entire system
    const emailExists = await checkEmailExists({
      email,
    });

    // Stop if email already exists
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists in the system",
      });
    }

    // Create new member
    const member = await Member.create(req.body);

    // Success Response
    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member,
    });

  } catch (error) {
    // Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// Get All Members
// ==========================
const getAllMembers = async (req, res) => {
  try {
    // Fetch all members
    const members = await Member.find();

    // Success Response
    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });

  } catch (error) {
    // Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// Get Single Member
// ==========================
const getSingleMember = async (req, res) => {
  try {
    // Find member by ID
    const member = await Member.findById(req.params.id);

    // Member not found
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Success Response
    res.status(200).json({
      success: true,
      data: member,
    });

  } catch (error) {
    // Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// Update Member
// ==========================
const updateMember = async (req, res) => {
  try {

    // Find current member
    const currentMember = await Member.findById(req.params.id);

    // Member not found
    if (!currentMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Check email only if it is changed
    if (req.body.email && req.body.email !== currentMember.email) {

      // Check if the new email already exists
      const emailExists = await checkEmailExists({
        email: req.body.email,
        excludeMemberId: req.params.id,
      });

      // Stop update if email already exists
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists in the system",
        });
      }
    }

    // Update member
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Success Response
    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });

  } catch (error) {
    // Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// Delete Member
// ==========================
const deleteMember = async (req, res) => {
  try {

    // Delete member
    const member = await Member.findByIdAndDelete(req.params.id);

    // Member not found
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Success Response
    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });

  } catch (error) {
    // Internal Server Error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Export Controllers
module.exports = {
  createMember,
  getAllMembers,
  getSingleMember,
  updateMember,
  deleteMember,
};