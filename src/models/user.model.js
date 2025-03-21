import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [20, "Username cannot exceed 20 characters"],
            match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            index: true,
            minlength: [3, "Full name must be at least 3 characters"],
            maxlength: [50, "Full name cannot exceed 50 characters"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false
        },
        avatar: {
            type: String,
            required: [true, "Avatar URL is required"],
            match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format for avatar"]
        },
        coverImage: {
            type: String,
            match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format for cover image"],
            default: null
        },
        watchHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            unique: true // Ensures a video is not stored multiple times
        }],
        refreshToken: {
            type: String,
            select: false // Prevent exposure in API responses
        }
    },
    { timestamps: true }
);


// Hash password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Hash only if password is modified
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
    next();
});

// Compare entered password with stored hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate an Access Token (short-lived, used for authentication)
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET, // Uses environment variable for security
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Token expiry time
    );
};

// Generate a Refresh Token (long-lived, used for renewing access token)
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET, // Uses environment variable for security
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Refresh token expiry time
    );
};

// Create the User model from the schema
export const User = mongoose.model("User", userSchema);
