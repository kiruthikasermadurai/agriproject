import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Automatically generated
    },
    name:{
        type: String,
        required : true
    },
    email:{
        type:String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["farmer", "customer", "supplier"], // Restricts values
        required: true,
    },
    lastLogin:{
        type: Date,
        default: Date.now
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
},{timestamps: true}); //createat and updateatfields will be automatically added into the document


export const User = mongoose.model('User', userSchema);