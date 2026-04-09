import jwt from 'jsonwebtoken';
const isAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message: "token not found"});
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({message: "invalid token"});
        }
        req.userId = decodedToken.userId;
        next();
    }catch(error){
        return res.status(500).json({message: "is auth error"});
    }
}

export default isAuth;