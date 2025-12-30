import jwt from "jsonwebtoken";



export const protectRoute=(req, res, next )=>{
    try{
        const acessToken =req.cookies.acessToken;

        if(!acessToken ){

            return 
        }


    }
    catch(err)
}