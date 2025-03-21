import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErros } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  /*     🪜Algorithm to register a user
  ➡️Get user details from forntend 
  ➡️Validation: Make sure fields are not empty and other validations
  ➡️Check if user already exist: username, email 
  ➡️Check for images and avatar
  ➡️Upload them to cloudinary, avatar
  ➡️Create user object: Create entry in DB
  ➡️Remove passwod and refresh token field from response
  ➡️Check for user creation and send response
  ➡️Return res       
  */

  //➡️Step 1: Get user details
  const { fullName, email, password, username } = req.body
  console.log('email:', email)


  // ➡️Step 2: Validations(further validation are covered in the user model schema)
  if (
    [fullName, email, password, username].some((field) => field?.trim() === '')
  ) {
    throw new ApiErros(400, 'All fields are required');
  }


  // ➡️Step 3: Check if user already exist: username, email 
  const existedUser = User.findOne({ $or: [{ email }, { username }] })
  if (existedUser) {
    throw new ApiErros(409, 'User with this email or username already exists!');
  }


  // ➡️Step 4: Check for images and avatar
  // Safely extract the local file path of the uploaded avatar or coverImage (if it exists)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLoacalPath = req.files.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiErros(400, 'Avatar file is required!');
  }

  // Now upload the local files on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLoacalPath);

  if (!avatar) {
    throw new ApiErros(400, 'Avatar file is required!');
  }


  // ➡️Step 5: Create user object then, create entry in DB
  const user = User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase
  })


  // ➡️Step 6: Remove passwod and refresh token field from response
  const createdUser = await User.findById(user._id).select("-password -refreshToken")


  // ➡️Step 7: Check for user creation and send response
  if (!createdUser) {
    throw new ApiErros(400, 'Something went wrong while registering the user!');
  }


  // ➡️Step 8: Return res
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully✅")
  )



})

export { registerUser }