"use client";
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { CircularProgress, Toolbar, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts';





const Page = () => {
  const [tasks, setTasks] = useState([]);
  const [loading,setLoading]=useState(false);
  const [statusCounts,setStatusCounts]= useState({});
  const [priorityCounts,setPriorityCounts]=useState({});

const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Auth token:", token);
      const res = await fetch("http://localhost:3000/task/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
     await setTasks(data.task);

     //count status
     const statusCountMap = {};
     //count priority
     const priorityCountMap = {};
     
      data.task.forEach(task => {
      priorityCountMap[task.priority] = (priorityCountMap[task.priority] || 0) + 1;
      statusCountMap[task.status] = (statusCountMap[task.status] || 0) + 1;
      });

      setPriorityCounts(priorityCountMap);
      setStatusCounts(statusCountMap);

    } catch (error) {
      console.error(error);
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  
 if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center h-64  rounded-lg shadow-md border  space-x-3">
        <CircularProgress size={24} style={{ color: "#10b981" }} />
        <p className="text-black text-lg font-medium">Loading tasks...</p>
      </div>
    );
  }



const priorityPieData = Object.entries(priorityCounts).map(([key, value], index) => ({
  id: index,
  value,
  label: key,
}));

const statusPieData = Object.entries(statusCounts).map(([key, value], index) => ({
  id: index,
  value,
  label: key,
}));

 
  return (
     <div className="min-h-screen  p-6 text-black">
         
        <div className="mb-6 ">
      <Toolbar className="flex justify-between items-center "   disableGutters sx={{ minHeight: 64 }}>
        <Navbar />
        <Typography
          variant="h5" // Use h6 for better vertical alignment
          component="div"
          className="font-bold text-black"
          sx={{ flexGrow: 1 }}
        >
        Task Summary
        </Typography>
      </Toolbar>
    </div>


<div className="mb-8">
  {tasks.length === 0 ? (
    // ✅ Show this when there are no tasks
    <div className="flex flex-col items-center justify-center text-center py-20 text-black space-y-3  rounded-xl shadow-md">
      <span className="text-6xl">📭</span>
      <p className="text-2xl font-semibold text-black">No tasks available</p>
      <p className="text-sm text-black">Looks like you have not created any tasks yet.</p>
    </div>
  ) : (
    // ✅ Show this when there are tasks
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className=" p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-black mb-2">Priority Chart</h3>
        <PieChart
          series={[{ data: priorityPieData }]}
          width={300}
          height={300}
        />
      </div>

      <div className=" p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-black mb-2">Status Chart</h3>
        <PieChart
          series={[{ data: statusPieData }]}
          width={300}
          height={300}
        />
      </div>
    </div>
  )}
</div>



    </div>
  )
}

export default Page
