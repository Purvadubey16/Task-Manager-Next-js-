import { Request,Response,NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({message: 'Unauthorized'});
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = await verifyToken(token);
    (req as any).user = decoded;
    next();
  }catch(error){
    return res.status(401).json({message: 'Invalid token'});
  }
}
 