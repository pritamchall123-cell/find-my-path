const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        educationLevel: {
            type: String,
            enum: ['class 10', 'class 12', 'college', 'graduate'],
            default: null,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);