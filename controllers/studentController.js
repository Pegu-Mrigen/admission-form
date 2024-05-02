import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Student } from "../models/studentSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import bcrypt from "bcrypt-nodejs";

export const studentRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, confirmPassword, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await Student.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("student already Registered!", 400));
  }
  if (confirmPassword !== password) {
    return next(
      new ErrorHandler("Password is not same with Confirm password !", 400)
    );
  }

  const student = await Student.create({
    firstName,
    lastName,
    email,
    phone,
    confirmPassword,
    password,
    role: "Student",
  });
  generateToken(student, "Student Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   return next(new ErrorHandler("Please Fill Full Form!", 400));
  // }

  const student = await Student.find({email}).select("+password");


  if (student) {
    res.json(student);
  } else {
    res.status(400).json("User or password incorrect!");
  }
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await Student.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await Student.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const getAllStudents = catchAsyncErrors(async (req, res, next) => {
  const courseNames = await Student.find({ role: "Student" });
  res.status(200).json({
    success: true,
    courseNames,
  });
});

export const getStudentDetails = catchAsyncErrors(async (req, res, next) => {
  const student = req.student;
  res.status(200).json({
    success: true,
    student,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

export const logoutStudent = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("studentToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Student Logged Out Successfully.",
    });
});
