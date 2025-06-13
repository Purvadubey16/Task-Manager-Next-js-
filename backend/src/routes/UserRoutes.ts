 
import { Request, Response, Router } from "express";
import AppDataSource from "../config/db";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { authenticate, AuthenticatedRequest } from "../middleware/AuthMiddleware";
import cloudinary from "../utils/cloudinary";
import { upload } from "../middleware/upload";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = Router();


// GET /users
router.get('/all',async(req,res)=>{
const userRepo = AppDataSource.getRepository(User);
//find all users
const users = await userRepo.find();
   res.json(users)
});


//Register user with name , email, password
router.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
      // Hash the password before saving
     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    //create new user
    const userRepo = AppDataSource.getRepository(User);

//check if user already exists
const existingUser = await userRepo.findOne({where:{email}});
if(existingUser){
    return res.status(400).json({message:"User already exists"});
}

    const newUser = userRepo.create({name,email,  password: hashedPassword,});
    //save user to database
    const savedUser = await userRepo.save(newUser);
    //generate token
     const token = generateToken({id:savedUser.id,email:savedUser.email})
//return user without password
const {password:_,...userWithoutPassword} = savedUser


    res.status(201).json({user:userWithoutPassword,token});

});

// me route
router.get("/me",authenticate,async(req:AuthenticatedRequest,res:Response)=>{
  //get user repo
    const userRepo = AppDataSource.getRepository(User);
    //find user by id
    const user = await userRepo.findOne({where:{id:req.user.id}});
  if(!user){
    return res.status(404).json({message:"User not found"});
  }
//return user with all details
    res.json(user);
})



// get user details by id
router.get('/:id',async(req: Request, res: Response)=>{
    const id = parseInt(req.params.id);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({where:{id}});
     res.json(user);
});


//login user with email and password
router.post("/login",async(req,res)=>{
    const {name,email,password} = req.body;
    const userRepo = AppDataSource.getRepository(User);
    //check wheather user with email exists
    const user = await userRepo.findOne({where:{email}});
    if(!user){
        return res.status(401).json({message:"Invalid email or password"});
    }
    //if yes compare password
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const token = generateToken({id:user.id,email:user.email})
   return res.status(200).json({name,email,token})
})

//delete user by id
router.delete('/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    const userRepo = AppDataSource.getRepository(User);

     const user = await userRepo.delete({id});
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"user deleted"});
});




// PUT /users/:id
router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, password, oldPassword } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // If user is trying to update password, validate oldPassword first
  if (password) {
    if (!oldPassword) {
      return res.status(400).json({ message: "Old password is required" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(password, 10);
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;

  const updatedUser = await userRepo.save(user);

  return res.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    profileImageUrl: updatedUser.profileImageUrl,
  });
});





router.post(
  "/upload-profile",
  authenticate,
  upload.single("profileImage"),
  async (req: AuthenticatedRequest, res: Response) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Upload image using stream and handle callback for response
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "task-manager/profiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file?.buffer);
      });
    };

    try {
      const result: any = await streamUpload();

      user.profileImageUrl = result.secure_url;
      await userRepo.save(user);

      return res.status(200).json({ message: "Profile image uploaded", url: result.secure_url });
    } catch (error) {
       // Narrow error to Error type if possible
  if (error instanceof Error) {
    console.error("Cloudinary upload error:", error.message);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  } else {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: String(error) });
  }
    }
  }
);

router.delete("/:id/profile-image", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.profileImageUrl = null;
  await userRepo.save(user);
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    profileImageUrl: null,
  });
});




//forgot password
router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await userRepo.save(user);

  const resetUrl = `http://localhost:3001/reset-password/${token}`; // frontend link

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       
    pass: process.env.EMAIL_PASS,  
  },
});
  try {
    await transporter.sendMail({
      to: email,
      subject: "Password Reset - Task Manager",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click below:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
});


router.post("/reset-password/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { resetToken: token } });

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await userRepo.save(user);

  return res.json({ message: "Password reset successful" });
});



export default router;