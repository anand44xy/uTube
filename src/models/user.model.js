import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String
        },
        watchHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }],
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Hash only if password is modified

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
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, // Uses environment variable for security
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Refresh token expiry time
    );
};

// Create the User model from the schema
export const User = mongoose.model('User', userSchema);
