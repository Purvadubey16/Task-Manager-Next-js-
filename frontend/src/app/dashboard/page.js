"use client";
import React, { useEffect, useState } from "react";
import { getTasks ,addTask , updateTask,deleteTask} from "@/services/TaskService";
import TaskForm from "../../components/TaskFrom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskListView from "../../components/TaskListView";
import TaskGridView from "../../components/TaskGridView";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import UserMenu from "../../components/UserMenu";
import ListIcon from "@mui/icons-material/List";
import WindowIcon from "@mui/icons-material/Window";
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { exportTasksToExcel } from "../../utils/exportToExcel";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const fetchTasks = async () => {
    try {
       const res = await getTasks();
       setTasks(res.data.task);  
    }   catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error?.response?.data?.message || "Failed to fetch tasks");
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
      const formattedCreated = new Date(task.created).toLocaleDateString(
        "en-CA"
      );

      const matchesSearch =
        (task.title || "").toLowerCase().includes(lowerSearch) ||
        (task.description || "").toLowerCase().includes(lowerSearch) ||
        (task.status || "").toLowerCase().includes(lowerSearch) ||
        (task.priority || "").toLowerCase().includes(lowerSearch) ||
        (task.assign || "").toLowerCase().includes(lowerSearch) ||
        formattedDeadline.includes(lowerSearch) ||
        formattedCreated.includes(lowerSearch);

      const matchesStatus = !statusFilter || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });


  const handleExport = () =>{
    exportTasksToExcel(tasks,'task_list')
  }



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
     await addTask(task);
    } catch (error) {
     console.error("Add failed:", error?.response?.data?.message || error.message);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    if (!updatedTask || !updatedTask.id) {
      console.error("Invalid updated task:", updatedTask);
      return;
    }

    try {
    await updateTask(updatedTask.id, updatedTask);
    // Optionally show success message/toast
  } catch (error) {
    console.error("Update failed:", error?.response?.data?.message || error.message);
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

    await deleteTask(id); //using  service
    await fetchTasks();   // Refresh task list
    console.log("Task deleted successfully");
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
    <div className="flex flex-col h-screen  pl-[70px] text-black">
      <div className=" flex justify-between bg-gray-100 pb-2.5 pt-2 pr-6 pl-3">
         <div className="flex items-center gap-4 px-2 ">
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
        <UserMenu />
      </div>
      {/* <div className="bg-gray-50/100 px-6"> */}
      <div className="sticky top-0 z-30  pt-3 bg-gray-50/100 pl-4 pr-6 pb-3 ">

        <div className="flex flex-col gap-4  ">
        
       
        
           
{/* search bar and filters */}
  <div className="flex justify-between sm:flex-row  md:flex-col  lg:flex-row w-full items-start lg:items-center gap-4">

           {/* search bar */}
         <div className="w-full lg:w-1/4 sm:1/2">

            <Tooltip title="Type to search tasks" arrow>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search task"
              className="w-full   p-2  rounded-xl bg-white/10 text-black border  border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-[12px] h-[38px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /></Tooltip>
          </div>


 {/* Filters / Sorting / View / Export */}
           <div className="hidden md:flex gap-4 items-center">
             

              {/* priority filters */}
          <div className="flex gap-3">
            {["Progress", "Pending", "Completed"].map((status) => {
              const isActive = statusFilter === status;
              const statusStyle = statusColorMap[status];

               const tooltipText = isActive
      ? `Click to remove "${status}" filter`
      : `Filter by "${status}" tasks`;

              return (
                 <Tooltip title={tooltipText} arrow key={status} placement="top">
                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter((prev) => (prev === status ? "" : status))
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
        ${statusStyle.base} ${statusStyle.hover} ${
                    isActive ? statusStyle.active : ""
                  }
      `}
                >
                  <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[12px] font-semibold">
                    {getStatusCount(status)}
                  </span>
                  <span className="text-[12px]">{status}</span>
                </button>
                </Tooltip>
              );
            })}
          </div>


              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort By</label>
                <Tooltip title='Sort by newest/oldest' placement="top">
                <Select
                  size="small"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  sx={{
                    color: "black",
                    borderRadius: 2,
                    height: "38px",
                    minWidth: "150px",
                    // backgroundColor: "white",
                    // "& .MuiOutlinedInput-root": {
                    //   "& fieldset": { borderColor: "white" },
                    //   "&:hover fieldset": { borderColor: "gray" },
                    //   "&.Mui-focused fieldset": { borderColor: "gray" },
                    // },
                  }}
                  style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" ,fontSize:"10px" }}
                >
                  <MenuItem value="newest" >Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </Select>
                </Tooltip>
              </div>


              {/* views (card , list, grid) */}
              <div className="flex rounded  overflow-hidden shadow-sm h-[38px]"   style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}>
                <Tooltip title="View as card" arrow placement="top">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 px-3 transition duration-200 cursor-pointer ${
                      view === "grid"
                        ? "bg-[#5045E5] text-white shadow-inner"
                        : "bg-white text-black hover:bg-blue-200"
                    }`}
                    aria-label="Grid View"
                  >
                    <WindowIcon fontSize="16px" />
                  </button>
                </Tooltip>
                <Tooltip title="View as List" arrow placement="top">
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 px-3 transition duration-200 cursor-pointer ${
                      view === "list"
                        ? "bg-[#5045E5] text-white shadow-inner"
                        : "bg-white text-black hover:bg-blue-200"
                    }`}
                    aria-label="Table View"
                  >
                    <ListIcon fontSize="16px" />
                  </button>
                </Tooltip>
              </div>


             {/* export button */}
              <div>
                <Tooltip title="Export Tasks" arrow>
                <button className="  rounded h-9 w-24" onClick={handleExport}   style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}>
                 <span style={{ alignItems: "center" }}> 
                  <IosShareIcon style={{ marginTop: "-5px", fontSize: 18 ,marginRight:'5px'}}  /></span>
                  <span style={{ lineHeight: 1 }} className="text-[10px]">
                  Export</span>
                </button>
                </Tooltip>
              </div>


            </div>



          {/* Mobile menu icon */}
          <Tooltip title="task options" arrow>
<div className="md:hidden flex items-center">
  <IconButton onClick={() => setMobileMenuOpen(true)}>
    <MoreVertIcon />
  </IconButton>
</div>
</Tooltip>

  </div>
            





{/* Mobile menu drawer */}
{mobileMenuOpen && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
    <div className="w-72 h-full bg-white rounded-l-xl p-4 shadow-lg flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">Task Options</h2>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* Priority Filters */}
      <div>
           <h3 className="text-sm font-medium text-gray-600 mb-2">Filter by Status</h3>
      <div className="flex gap-1">
            {["Progress", "Pending", "Completed"].map((status) => {
              const isActive = statusFilter === status;
              const statusStyle = statusColorMap[status];

               const tooltipText = isActive
      ? `Click to remove "${status}" filter`
      : `Filter by "${status}" tasks`;

              return (
                 <Tooltip title={tooltipText} arrow key={status} placement="top">
                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter((prev) => (prev === status ? "" : status))
                  }
                  className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm font-medium transition cursor-pointer
        ${statusStyle.base} ${statusStyle.hover} ${
                    isActive ? statusStyle.active : ""
                  }
      `}
                >
                  <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[12px] font-semibold">
                    {getStatusCount(status)}
                  </span>
                  <span className="text-[12px]">{status}</span>
                </button>
                </Tooltip>
              );
            })}
          </div>
</div>
      {/* Sort Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
        <Select
          size="small"
          value={sortOrder}
          fullWidth
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
        </Select>
      </div>

      {/* View Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">View Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`flex-1 p-2 rounded-md transition ${
              view === "grid" ? "bg-[#5045E5] text-white" : "bg-gray-100"
            }`}
          >
            <WindowIcon size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex-1 p-2 rounded-md transition ${
              view === "list" ? "bg-[#5045E5] text-white" : "bg-gray-100"
            }`}
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {/* Export Button */}
      <button
        className="w-full border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        onClick={() => {
          handleExport();
          setMobileMenuOpen(false);
        }}
      >
        <IosShareIcon style={{ fontSize: 18 }} />
        <span className="text-sm font-medium">Export Tasks</span>
      </button>
    </div>
  </div>
)}


        </div>
        {/* <div className="flex flex-col sm:flex-row justify-between items-center py-4   space-y-2 sm:space-y-0 "></div> */}
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
      <div className="flex-1 overflow-y-auto pb-6 bg-gray-50/100 px-3">
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
      <Dialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
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
