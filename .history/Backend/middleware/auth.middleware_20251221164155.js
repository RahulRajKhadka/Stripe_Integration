import jwt from "jsonwebtoken";
import User from "../models/user.model";



export const protectRoute=(req, res, next )=>{
    try{
        const acessToken =req.cookies.acessToken;

        if(!acessToken ){

            return res.status(401).json ({message:"Unauthorized "})
        }


        try{


        }
        

    return 
}



    }
    catch(err)
}