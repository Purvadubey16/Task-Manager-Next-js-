'use client';
import React, { useEffect, useRef, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';



const priorities = ['Low', 'Medium', 'High'];
const statuss = ['Completed', 'Progress', 'Pending'];
const assignes = ['John', 'Jane', 'Bob','larry','hoe'];

const TaskForm = ({ open, handleClose, onSubmit, initialData }) => {
  const [title, settitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setstatus] = useState('Pending');
  const [priority, setPriority] = useState('');
  const[assign,setAssign]=useState('')
  const [deadline, setdeadline] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    if (initialData) {
      settitle(initialData.title || '');
      setDescription(initialData.description || '');
      // Normalize priority and status to match exact option casing
    setPriority(
      priorities.find(
        (p) => p.toLowerCase() === (initialData.priority || '').toLowerCase()
      ) || ''
    );
    setstatus(
      initialData.status
        ? statuss.find(
            (s) => s.toLowerCase() === initialData.status.toLowerCase()
          ) || 'Pending'
        : 'Pending'
    );
setdeadline(initialData.deadline ? new Date(initialData.deadline).toLocaleDateString('en-CA') : '');


setAssign (
  assignes.find(
    (a) =>a.toLowerCase()===(initialData.assign ||"").toLowerCase()
  )||''
)   
    } else {
      // Reset form when no initialData (new task)
      settitle('');
      setDescription('');
      setPriority('');
      setstatus('Pending');
      setAssign('');
      setdeadline('');
     
      
    }
  }, [initialData]);

const handleSubmit = async (e) => {
   e?.preventDefault(); 

 // ✅ block immediate multiple submissions
    if (isSubmitting) return;
setIsSubmitting(true);

// If editing, get from initialData, else today:
const stripTime = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
  return d;
};

const createdDate = initialData?.created
  ? stripTime(new Date(initialData.created))
  : stripTime(new Date());

const deadlineDate = stripTime(new Date(deadline));

if (deadlineDate < createdDate) {
  alert("Due Date must be the same as or later than the created date.");
  setIsSubmitting(false);
  return;
}






  const taskData = {
    id: initialData?.id,
    title,
    description,
    status,
    priority,
    assign,
    deadline,
  };

 try {
    await onSubmit(taskData); // pass to parent
    handleClose();
    settitle('');
    setDescription('');
    setstatus('Pending');
    setPriority('');
    setdeadline('');
    setAssign('');
  } catch (error) {
    console.error("Error submitting task:", error);
    alert("Failed to submit task. Please try again.");
  } finally {
    setIsSubmitting(false);// always reset flag here
  }
};
useEffect(() => {
  if (!open && !initialData) {
    settitle('');
    setDescription('');
    setPriority('');
    setstatus('Pending');
    setAssign('');
    setdeadline('');
  }
}, [open, initialData]);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: '#f9fafb',
          color: '#111827',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #d1fae5',
        },
      }}
    >

      <form onSubmit={handleSubmit}>
      <div
        style={{
        //  backgroundColor: '#f0fdf4', // light emerald-tinted header
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >



        <DialogTitle sx={{ p: 0, fontWeight: 'bold', fontSize: '1.5rem', color: '#064e3b' }}>
         
          {initialData ? 'Edit Task' : 'Add Task'}
         <Tooltip title="save the task" arrow>
  <span>
    <IconButton
      size="small"
      type='submit'
      // onClick={handleSubmit}
      disabled={isSubmitting} // disable while submitting
    >
      {isSubmitting ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <SaveIcon />
      )}
    </IconButton>
  </span>
</Tooltip>

        </DialogTitle>
       <Tooltip title="close the form" arrow>
         <IconButton onClick={handleClose} size="small" sx={{ color: '#064e3b' }}>
          <CloseIcon />
        </IconButton>
       </Tooltip>
      </div>



      <DialogContent 
      sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'space-between',
  }}
      >
        <TextField
          margin="dense"
          label="Task Name"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Status"
          fullWidth
          variant="outlined"
          value={status}
          onChange={(e) => setstatus(e.target.value)}
          sx={{ flex: '1 1 48%' }}
          required
        >
          {statuss.map((person) => (
            <MenuItem key={person} value={person}>
              {person}
            </MenuItem>
          ))}
        </TextField>
        <TextField
        select
        margin='dense'
        label='Assign By'
        fullWidth
        variant="outlined"
        required
        value={assign}
        onChange={(e)=>setAssign(e.target.value)}
        sx={{ flex: '1 1 48%' }}
        >
        {
          assignes.map((person)=>(
            <MenuItem key={person} value={person}>
              {person}
            </MenuItem>
          ))
        }
        </TextField>
        <TextField
          select
          margin="dense"
          label="Priority"
          fullWidth
          variant="outlined"
          value={priority}
          required
          onChange={(e) => setPriority(e.target.value)}
          sx={{ flex: '1 1 48%' }}
        >
          {priorities.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={deadline}
          required
          onChange={(e) => setdeadline(e.target.value)}
          sx={{ flex: '1 1 48%' }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Tooltip title={initialData ? "Save the task" : "Save the task"}>
          <Button
  type="submit"
  disabled={isSubmitting}
  variant="contained"
  fullWidth
  sx={{
    backgroundColor: '#facc15', // Tailwind's yellow-400 / Amber
    color: 'white', // Tailwind's gray-800 for good contrast
    '&:hover': {
      backgroundColor: '#fbbf24', // Slightly darker amber (yellow-500)
    },
  }}
>
 {initialData ? 'Edit Task' : '+ Add Task'}
</Button>

        </Tooltip>
      </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
