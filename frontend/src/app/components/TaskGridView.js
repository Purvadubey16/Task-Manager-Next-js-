'use client';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, IconButton, Divider } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditSquareIcon from '@mui/icons-material/EditSquare';

const TaskGridView = ({ tasks,onEdit,onDelete }) => {

  const statusColorMap = {
  Pending: 'border-l-[#FFC107]',
  Progress: 'border-l-[#2198F3]',
  Completed: 'border-l-[#388E3C]',
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  
  return `${day} ${month}`;
};


  if (!tasks.length) {
    return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 
    backdrop-blur-md  rounded-2xl  space-y-4  max-w-xl mx-auto mt-12">
  <p className="text-3xl font-bold text-gray-300"></p>
  <p className="text-base ">No Task available.</p>
  {/* <p className="text-base text-gray-100">Click the <span className="font-semibold">“Add”</span> button to get started.</p> */}
</div>


    );
  }
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {tasks.map((task) => (
       <div
  key={task.id}
   className={`bg-white/10 rounded-lg p-2 shadow-sm border border-gray-400/20 border-l-8 
            ${statusColorMap[task.status] || 'border-l-gray-300'} 
            flex flex-col justify-between text-sm`}


        >
          <div className='pb-5'>
            <h3 className="text-md font-semibold mb-1">{task.title}</h3>
           <p className="mb-2 text-gray-300 min-h-[48px] max-h-[72px] overflow-hidden text-ellipsis line-clamp-3">
            {task.description}
  {/* {task.description || <span className="italic text-gray-400">No description</span>} */}
</p>








            <div className='flex gap-20'>
            <div className="mb-2 p-2 border border-gray-400 rounded-xl w-28">
                <h6 className='text-[#5045E5]'>Created Date</h6>
                <div className='flex justify-start items-center'>
           {/* <p className="text-xl font-bold"></p> */}
  <strong ><CalendarMonthIcon/></strong>{' '}
  {/* {new Date(task.created).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} */}
 <div className='text-xl font-bold'>
  {formatDate(task.created)}
</div>

</div>
</div>

<div className="mb-2 p-2 border border-gray-400 rounded-xl w-28">
  <h6 className='text-[#5045E5] text-right'>Due Date</h6>
  <div className='flex justify-start items-center'>

  <strong><CalendarMonthIcon  /></strong>{' '}
  {/* {new Date(task.deadline).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} */}
  <div className='text-xl font-bold'>
  {formatDate(task.deadline)}
  </div>
  </div>
</div> </div>

<div className='flex gap-20'>

        <div className="mb-2 p-2 border border-gray-400 rounded-xl w-28">
              <h6 className='text-[#5045E5]'>Priority</h6>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'Low'
                    ? 'bg-[#CAE7CB] text-[#4CAF50]'
                    : task.priority === 'Medium'
                    ? 'bg-[#FFED85] text-[#FFC107]'
                    : 'bg-[#FCC7C3] text-[#754B3E]'
                }`}
              >
                {task.priority}
              </span>
            </div>

   <div className="mb-2 p-2 border border-gray-400 rounded-xl w-28">
      <h6 className='text-[#5045E5] text-right'>Status</h6>
            <p className="text-sm  mb-1 text-right">
             {task.status}
            </p>

</div>

</div>



          </div>


          <Divider></Divider>


<div className='flex justify-between'>
  <div className='mt-4'> 
    <h6 > <span className='text-[#5045E5]'>Assign By :- </span> {task.assign}</h6>
    
  </div>
          <div className="flex justify-end gap-2 mt-4">
            <Tooltip title="Edit task" arrow>
              <IconButton
                size="small"
                color="inherit"
                aria-label="edit task"
              
                onClick={() => onEdit(task)}  // call onEdit with the whole task
              >
                <EditSquareIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete task" arrow>
              <IconButton
                size="small"
                color="inherit"
                aria-label="delete task"
                onClick={() => onDelete(task.id)} 
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>



</div>


        </div>
      ))}
    </div>
  );
};

export default TaskGridView;
