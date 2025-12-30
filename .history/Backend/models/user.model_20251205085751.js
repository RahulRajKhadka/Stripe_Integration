import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],   
    minlength: [6, 'Password must be at least 6 characters long'],
    trim: true,
  },
  cartItems:[
    {
        quantity:{
            type:Number,
            required:true,
        },
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Product',
        }
    }
  ],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
},
 {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try{


  }
});

export default User;