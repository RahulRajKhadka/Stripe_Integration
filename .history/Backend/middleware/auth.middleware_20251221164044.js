import jwt from "jsonwebtoken";
import User from "../models/user.model";



export const protectRoute=(req, res, next )=>{
    try{
        const acessToken =req.cookies.acessToken;

        if(!acessToken ){

            return res.status(401).json ({message:"Unauthorized "})
        }

        const decoded=jwt.verify(acessToken, process.env.REFERESH_TOKEN_SECRECT);
        const user =await User.findById(decoded.userId).select


    }
    catch(err)
}