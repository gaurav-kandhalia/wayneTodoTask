import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  registerUserSchema,
  loginUserSchema,
} from "../validation/auth.validator.js";



// REGISTER USER

export const registerUser = asyncHandler(async (req, res) => {

  const validatedData = registerUserSchema.parse(req.body);

  const { name, email, password } = validatedData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

 

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");
   const accessToken = user.generateAccessToken();

  return res.status(201).json(
    new ApiResponse(
      201,
     { createdUser,accessToken},

      "User registered successfully"
    )
  );

});


// LOGIN USER

export const loginUser = asyncHandler(async (req, res) => {

  const validatedData = loginUserSchema.parse(req.body);

  const { email, password } = validatedData;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "User logged in successfully"
    )
  );

});


// GET CURRENT USER

export const getCurrentUser = asyncHandler(async (req, res) => {

  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  );

});