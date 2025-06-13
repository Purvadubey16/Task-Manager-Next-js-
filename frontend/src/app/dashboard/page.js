"use client";
import React, { useEffect, useState } from "react";
import { LayoutGrid, Table } from "lucide-react";
import TaskForm from "../components/TaskFrom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, Toolbar, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskListView from "../components/TaskListView";
import TaskGridView from "../components/TaskGridView";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import UserMenu from "../components/UserMenu";
import { Upload } from "@mui/icons-material";
import ListIcon from '@mui/icons-material/List';
import WindowIcon from '@mui/icons-material/Window';
const Page = () => {
  const [view, setView] = useState("grid");
  const [openForm, setOpenForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = React.useState(null);
  const [sortOrder, setSortOrder] = useState("oldest");
   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
 const [statusFilter, setStatusFilter] = useState("");


    const router = useRouter();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:3000/task/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.task);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

const getStatusCount = (status) =>
  tasks.filter((task) => task.status === status).length;


  const filteredTasks = (tasks || [])
  .filter((task) => task && typeof task === "object")
  .filter((task) => {
    const lowerSearch = searchTerm.toLowerCase();
    const formattedDeadline = task.deadline
      ? new Date(task.deadline).toLocaleDateString("en-CA")
      : "";
    const formattedCreated = new Date(task.created).toLocaleDateString("en-CA");

    const matchesSearch = 
      (task.title || "").toLowerCase().includes(lowerSearch) ||
      (task.description || "").toLowerCase().includes(lowerSearch) ||
      (task.status || "").toLowerCase().includes(lowerSearch) ||
      (task.priority || "").toLowerCase().includes(lowerSearch) ||
      (task.assign || "").toLowerCase().includes(lowerSearch) ||
      formattedDeadline.includes(lowerSearch) ||
      formattedCreated.includes(lowerSearch);

    const matchesStatus  = !statusFilter || task.status === statusFilter;


    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    const dateA = new Date(a.created);
    const dateB = new Date(b.created);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

const statusColorMap = {
  Pending: {
    base: "bg-[#FFC107] text-white",
    hover: "hover:bg-[#FFB300]",
    active: "ring-2 ring-yellow-400 ring-offset-1",
  },
  Progress: {
    base: "bg-[#2198F3] text-white",
    hover: "hover:bg-[#1976D2]",
    active: "ring-2 ring-blue-400 ring-offset-1",
  },
  Completed: {
    base: "bg-[#4CAF50] text-white",
    hover: "hover:bg-[#388E3C]",
    active: "ring-2 ring-green-400 ring-offset-1",
  },
};



  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center h-64 bg-gray-50 rounded-lg shadow-md border border-gray-200 space-x-3">
        <CircularProgress size={24} style={{ color: "#10b981" }} />
        <p className="text-gray-800 text-lg font-medium">Loading tasks...</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  const onSubmit = async (task) => {
    if (editTask) {
      await handleUpdateTask(task); // Update only
    } else {
      await handleAddTask(task); // Add new task
    }
    await fetchTasks(); // Refetch to refresh UI
    setEditTask(null);
    setOpenForm(false);
  };

  const handleAddTask = async (task) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:3000/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error("Failed to add task");
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    if (!updatedTask || !updatedTask.id) {
      console.error("Invalid updated task:", updatedTask);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:3000/task/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) throw new Error("Failed to update task");

      // await fetchTasks(); // Refresh tasks after successful update
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setEditTask(null);
    setOpenForm(false);
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("Invalid ID to delete:", id);
        return;
      }
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:3000/task/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete task");

      await fetchTasks();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  const handleOpenDialog = (id) => {
    setTaskIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setTaskIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (taskIdToDelete) {
      await handleDelete(taskIdToDelete); 
      handleCloseDialog(); // close the confirmation dialog
    }
  };

    const handleLogout = () => {
    localStorage.removeItem("authToken");
    setShowLogoutDialog(false);
    router.push("/");
  };

  return (
   <div className="flex flex-col h-screen pl-[250px]  text-black">
    <div className=" pt-4 flex justify-end bg-gray-100 pb-3 pr-6">
  <UserMenu/>
</div>
{/* <div className="bg-gray-50/100 px-6"> */}
<div className="sticky top-0 z-30  pt-2 bg-gray-50/100 px-6 ">
  <div className="flex flex-col gap-4 mb-2 ">
    {/* Top Row: Navbar Title + Add Button | Toggle + Sort */}
    <div className="flex justify-between items-center flex-wrap gap-4">
      {/* Left side: Title and Add Button */}
      <div className="flex items-center gap-4">
        <Navbar />
        <Typography variant="h5" component="div" className="font-bold">
          Task
        </Typography>
        <Tooltip title="Click to add a new task" arrow>
          <button
            className="p-1 bg-[#EDC824] hover:bg-yellow-400 text-white font-medium rounded-full transition shadow cursor-pointer"
            onClick={() => setOpenForm(true)}
          >
            <AddIcon />
          </button>
        </Tooltip>
      </div>

      {/* Right side: Toggle view + Sort */}
      <div className="flex gap-4 items-center">
        {/* Toggle View Buttons */}
      

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select
            size="small"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{
              color: 'black',
              borderRadius: 1,
              height: '40px',
              minWidth: '150px',
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'gray' },
                '&.Mui-focused fieldset': { borderColor: 'gray' },
              },
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </div>
          <div className="flex rounded-xl border border-gray-300 overflow-hidden shadow-sm h-10">
          <Tooltip title="View as card" arrow>
            <button
              onClick={() => setView("grid")}
              className={`p-2 px-3 transition duration-200 cursor-pointer ${
                view === "grid"
                  ? "bg-[#5045E5] text-white shadow-inner"
                  : "bg-white text-black hover:bg-blue-200"
              }`}
              aria-label="Grid View"
            >
              <WindowIcon   size={10} />
            </button>
          </Tooltip>
          <Tooltip title="View as List" arrow>
            <button
              onClick={() => setView("list")}
              className={`p-2 px-3 transition duration-200 cursor-pointer ${
                view === "list"
                  ? "bg-[#5045E5] text-white shadow-inner"
                  : "bg-white text-black hover:bg-blue-200"
              }`}
              aria-label="Table View"
            >
              <ListIcon  size={20} />
            </button>
          </Tooltip>
        </div>


        <div>
          <button className="border border-gray-300 px-2 py-1 rounded h-9">
            <Upload/>
              Export</button>
        </div>
      </div>
    </div>




</div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5 ">
        <div className="w-full">

        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search tasks ..."
          className="w-full md:w-2/3 lg:w-1/2  p-2  rounded-xl bg-white/10 text-black border  border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
       
<div className="flex gap-3 mt-2">
{[ "Progress","Pending", "Completed"].map((status) => {
  const isActive = statusFilter === status;
  const statusStyle = statusColorMap[status];
  return (
    <button
      key={status}
      onClick={() =>
        setStatusFilter((prev) => (prev === status ? "" : status))
      }
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
        ${statusStyle.base} ${statusStyle.hover} ${isActive ? statusStyle.active : ""}
      `}
    >
      <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
        {getStatusCount(status)}
      </span>
      <span>{status}</span>
    </button>
  );
})}

</div>



      </div>



<div className="flex flex-col sm:flex-row justify-between items-center py-4   space-y-2 sm:space-y-0 ">
 

 
</div>

</div>



      <TaskForm
        open={openForm}
        handleClose={handleFormClose}
        onSubmit={onSubmit}
        initialData={editTask}
      />
      <DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
      />
<div className="flex-1 overflow-y-auto pb-6 bg-gray-50/100 px-6">

      {view === "list" ? (
        <TaskListView
          tasks={filteredTasks}
          onEdit={handleEditClick}
          onDelete={handleOpenDialog}
        />
      ) : (
        <TaskGridView
          tasks={filteredTasks}
          onEdit={handleEditClick}
          onDelete={handleOpenDialog}
        />
      )}
</div>
 <Dialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
{/* </div> */}
    </div>
  );
};

export default Page;
