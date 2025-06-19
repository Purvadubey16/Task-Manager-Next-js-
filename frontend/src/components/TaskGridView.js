"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, IconButton, Divider, DialogContent, DialogTitle, Dialog } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CloseIcon from '@mui/icons-material/Close';

const TaskGridView = ({ tasks, onEdit, onDelete }) => {
 const [openDesc, setOpenDesc] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);

  const statusColorMap = {
    Pending: "border-l-[#FFC107]",
    Progress: "border-l-[#2198F3]",
    Completed: "border-l-[#388E3C]",
  };

const priorityBoxClasses = (index, priority) => {
  const colors = {
    Low: ["bg-[#CAE7CB]", "bg-white border border-black", "bg-white border border-black"],
    Medium: ["bg-[#CAE7CB]", "bg-[#FFED85]", "bg-white border border-black"],
    High: ["bg-[#CAE7CB]", "bg-[#FFED85]", "bg-[#FCC7C3]"],
  };

  return `w-3 h-2  ${colors[priority][index] || "bg-white border border-black"}`;
};


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];

    return `${day} ${month}`;
  };

  if (!tasks.length) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center py-20 px-6 
    backdrop-blur-md  rounded-2xl  space-y-4  max-w-xl mx-auto mt-12"
      >
        <p className="text-3xl font-bold text-gray-300"></p>
        <p className="text-base ">No Task available.</p>
        {/* <p className="text-base text-gray-100">Click the <span className="font-semibold">“Add”</span> button to get started.</p> */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
      {tasks.map((task) => ( 
         

        <div
          key={task.id}
          className={`bg-white/10 rounded-3xl p-2  border-l-8 
            ${statusColorMap[task.status] || "border-l-gray-300"} 
            flex flex-col justify-between text-sm`}
            style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}

        >
          <div className="pb-2">

            <div className="flex items-center justify-between mt-2">
            <h3 className="font-semibold mb-1 text-[12px] max-w-xs truncate">{task.title}</h3>

 

  {/* Priority Progress Boxes */}
  <div className="flex gap-1">
    {[0, 1, 2].map((i) => (
      <div key={i} className={priorityBoxClasses(i, task.priority)} />
    ))}
  </div>
</div>


           <div className="text-[10px] italic text-gray-500 truncate w-full min-h-[1.5rem]">
  {task.description.length > 50
    ? (
        <>
          {task.description.slice(0, 45)}&nbsp;
          <Tooltip title="Click to see full description" arrow>
            <button
              onClick={() => {
                setSelectedTask(task);
                setOpenDesc(true);
              }}
              className="text-blue-500 hover:underline inline"
            >
              ...
            </button>
          </Tooltip>
        </>
      )
    : task.description}
</div>



            <div className="flex justify-between ">
              <div className="mb-2 py-2 px-1 border border-gray-300 rounded-xl w-20 h-12">
                <h6 className="text-[#5045E5] text-[7px]">Created Date</h6>
                <div className="flex justify-start items-center">
                  {/* <p className="text-xl font-bold"></p> */}
                  <strong>
                     <CalendarMonthIcon style={{fontSize:"16px",marginTop:'-8px'}}/>
                  </strong>{" "}
                  {/* {new Date(task.created).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} */}
                    <div className="text-[11px] font-bold text-right ">
                    {formatDate(task.created)}
                  </div>
                </div>
              </div>


                       <div className="mb-2 py-2 px-1 border border-gray-300 rounded-xl w-20 h-12">
                <h6 className="text-[#5045E5] text-right text-[7px]">Due Date</h6>
                <div className="flex justify-end items-center">
                  <strong>
                    <CalendarMonthIcon style={{fontSize:"16",marginTop:'-8px'}}/>
                  </strong>{" "}
                  {/* {new Date(task.deadline).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} */}
                  <div className="text-[11px] font-bold text-right ">
                    {formatDate(task.deadline)}
                  </div>
                </div>
              </div>{" "}
            </div>
{/* gap-2 lg:gap-6 sm:gap-20 md:gap-14 */}
            <div className="flex justify-between">
              <div className=" p-2 border border-gray-300 rounded-xl w-20 h-12">
                <h6 className="text-[#5045E5] text-[7px]">Priority</h6>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium ${
                    task.priority === "Low"
                      ? "bg-[#CAE7CB] text-[#4CAF50]"
                      : task.priority === "Medium"
                      ? "bg-[#FFED85] text-[#FFC107]"
                      : "bg-[#FCC7C3] text-[#754B3E]"
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <div className=" p-2 border border-gray-300 rounded-xl w-20 h-12">
                <h6 className="text-[#5045E5] text-right text-[7px]">Status</h6>
                <p className="text-[10px]  mb-1 text-right font-bold">{task.status}</p>
              </div>
            </div>
          </div>

          <Divider></Divider>

          <div className="flex justify-between mt-2">
            <div className="mt-2">
              <h6>
                {" "}
                <span className="text-[#5045E5] text-[11px]">Assign By </span>{" "}
                <span className="text-[11px]">
                {task.assign}
                </span>
              </h6>
            </div>
            <div className="flex justify-end gap-2">
              <div className="border rounded-xl border-gray-300">
              <Tooltip title="Edit task" arrow>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="edit task"
                  onClick={() => onEdit(task)} // call onEdit with the whole task
                >
                  <EditSquareIcon fontSize="16px" />
                </IconButton>
              </Tooltip>
             </div>

             <div className="border rounded-xl border-gray-300">
              <Tooltip title="Delete task" arrow>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="delete task"
                  onClick={() => onDelete(task.id)}
                >
                  <DeleteIcon  style={{fontSize:'16px'}} />
                </IconButton>
              </Tooltip>
              </div>
            </div>
          </div>

        </div>

        
      ))}
      
    
   {selectedTask && (
  <Dialog
    open={openDesc}
    onClose={() => {
      setOpenDesc(false);
      setSelectedTask(null);
    }}
    maxWidth="xs"
    fullWidth
    scroll="body"
    BackdropProps={{ invisible: true }}
    PaperProps={{
      sx: {
        maxHeight: 'none',
        overflow: 'visible',
      },
    }}
  >
    <DialogTitle className="flex justify-between items-center">
      <span className="text-sm font-semibold">Task Description</span>
      <IconButton
        onClick={() => {
          setOpenDesc(false);
          setSelectedTask(null);
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent
      className="overflow-visible "
      sx={{
        overflow: 'visible !important',
        maxHeight: 'none',
      }}
    >
      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words"  style={{ wordBreak: "break-word" }}>
        {selectedTask.description}
      </p>
    </DialogContent>
  </Dialog>
)}

    </div>
  );
};

export default React.memo(TaskGridView);

