import { Request,Response,Router } from "express";
import AppDataSource from "../config/db";
import { Task } from "../entities/Task";
import { authenticate, AuthenticatedRequest } from "../middleware/AuthMiddleware";
import { User } from "../entities/User";
const router = Router();    


router.post("/",authenticate,async(req:AuthenticatedRequest,res:Response)=>{
 const {title,description,status,priority,assign,deadline} = req.body;
  const taskRepo = AppDataSource.getRepository(Task);
 const userRepo = AppDataSource.getRepository(User);
 try{
const userId = req.user.id;

const user = await userRepo.findOneBy({id:userId});
if(!user) return res.status(404).json({message:"User not found"});


 const task = taskRepo.create({title,description,status,priority,assign,deadline,user});
  const savedTask = await taskRepo.save(task);

    return res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
 }catch(error){
    res.status(500).json({message:"Server Error"});
 }
})



// get all tasks , creteated by the user
router.get("/all",authenticate,async(req:AuthenticatedRequest,res)=>{
    const taskRepo = AppDataSource.getRepository(Task);
    const userRepo = AppDataSource.getRepository(User);
   try{
     const userId = req.user.id;
    const user = await userRepo.findOneBy({id:userId});
    if(!user) return res.status(404).json({message:"User not found"});

    const task =await taskRepo.find({where:{user:{id:userId}}});
      console.log("Fetching tasks for user:", req.user.id);
     return res.status(200).json({ task });
   

   }catch(error){
    res.status(500).json({message:"Server Error"});
   }
})


router.delete("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const taskRepo = AppDataSource.getRepository(Task);
  const userId = req.user.id;
  const taskId = parseInt(req.params.id);

  try {
    const task = await taskRepo.findOne({
      where: { id: taskId },
      relations: ["user"],
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this task" });
    }

    await taskRepo.remove(task);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});




router.put("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, status, priority,assign, deadline } = req.body;
  const taskRepo = AppDataSource.getRepository(Task);
  const userId = req.user.id;
  const taskId = parseInt(req.params.id);

  try {
    const task = await taskRepo.findOne({
      where: { id: taskId },
      relations: ["user"],
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this task" });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.assign = assign ?? task.assign;
    task.deadline = deadline ?? task.deadline;

    const updatedTask = await taskRepo.save(task);

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;