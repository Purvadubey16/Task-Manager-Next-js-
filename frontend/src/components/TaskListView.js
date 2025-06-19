"use client";
import React, { useEffect, useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmation from "./DeleteConfirmation";
import { Tooltip, IconButton, MenuItem, Select } from "@mui/material";

const TaskListView = ({ tasks, onEdit, onDelete }) => {
  // Filter states
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssign, setFilterAssign] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt", // default sort key
    direction: "desc", // default sort direction
  });
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
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterPriority, filterStatus, filterAssign]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tasks]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null }; // default
      }
      return { key, direction: "asc" }; // start with asc
    });
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtering tasks based on selected priority , status and assignee
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      const matchesPriority = filterPriority
        ? task.priority === filterPriority
        : true;
      const matchesStatus = filterStatus ? task.status === filterStatus : true;
      const matchesAssign = filterAssign ? task.assign === filterAssign : true;
      return matchesPriority && matchesStatus && matchesAssign;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (["createdAt", "deadline"].includes(sortConfig.key)) {
          aValue = aValue ? new Date(aValue) : null;
          bValue = bValue ? new Date(bValue) : null;

          if (!aValue && !bValue) return 0;
          if (!aValue) return 1;
          if (!bValue) return -1;

          aValue.setHours(0, 0, 0, 0);
          bValue.setHours(0, 0, 0, 0);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tasks, filterPriority, filterStatus, filterAssign, sortConfig]);

  console.log("Tasks received in TaskListView:", tasks);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, currentPage]);

  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6  space-y-4  max-w-xl mx-auto mt-12">
        <p className="text-3xl font-bold text-gray-300"></p>
        <p className="text-base ">No Task available.</p>
        {/* <p className="text-base text-gray-100">Click the <span className="font-semibold">“Add”</span> button to get started.</p> */}
      </div>
    );
  }
  const isFiltered =
    filterPriority !== "" || filterStatus !== "" || filterAssign !== "";

  return (
    <div>
      <div className="overflow-x-auto mt-3  shadow border border-emerald-400/20">
        <table className="table-auto min-w-full bg-white/10 text-black text-sm md:text-base border border-gray-800 border-collapse">
          <thead>
            <tr className="text-left border ">
              <Tooltip title="Sort by name">
                <th
                  className="border-4 border-gray-200 w-[280px] cursor-pointer pb-5 px-4"
                  onClick={() => handleSort("title")}
                >
                  Task Name{" "}
                  <span>
                    {sortConfig.key === "title"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : sortConfig.direction === "desc"
                        ? "↓"
                        : "↕"
                      : "↕"}
                  </span>
                </th>
              </Tooltip>
              <Tooltip title="Sort by description">
                <th
                  className="border-4 border-gray-200 w-[250px] cursor-pointer pb-5 px-4"
                  onClick={() => handleSort("description")}
                >
                  Description{" "}
                  <span>
                    {sortConfig.key === "description"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : sortConfig.direction === "desc"
                        ? "↓"
                        : "↕"
                      : "↕"}
                  </span>
                </th>
              </Tooltip>

              <th className="py-3 px-4 border-4 border-gray-200 w-[160px] ">
                Assign By
                <Tooltip title="Sort by assignee" placement="top">
                  <Select
                    value={filterAssign}
                    onChange={(e) => setFilterAssign(e.target.value)}
                    variant="standard"
                    disableUnderline
                    renderValue={(selected) => selected || "All"}
                    className=""
                    displayEmpty
                    sx={{
                      // color: "transparent", // hides text without breaking dropdown
                      minWidth: 80,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "black",
                      pl: 1,
                      pr: 3,
                      borderRadius: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      ".MuiSelect-select": {
                        padding: 0,
                        paddingRight: "20px",
                      },
                      ".MuiSelect-icon": {
                        color: "black", // make dropdown arrow white
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {/* const assignes = ['John', 'Jane', 'Bob','larry','hoe']; */}
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="John">John</MenuItem>
                    <MenuItem value="Jane">Jane</MenuItem>
                    <MenuItem value="Bob">Bob</MenuItem>
                    <MenuItem value="larry">larry</MenuItem>
                    <MenuItem value="hoe">hoe</MenuItem>
                  </Select>
                </Tooltip>
              </th>

              <th className="py-3 px-4 border-4 border-gray-200 w-[160px] ">
                Priority
                <Tooltip title="Sort by priority" placement="top">
                  <Select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    variant="standard"
                    disableUnderline
                    renderValue={(selected) => selected || "All"}
                    className=""
                    displayEmpty
                    sx={{
                      minWidth: 80,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "black",
                      pl: 1,
                      pr: 3,
                      borderRadius: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      ".MuiSelect-select": {
                        padding: 0,
                        paddingRight: "20px",
                      },
                      ".MuiSelect-icon": {
                        color: "black", // make dropdown arrow white
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </Tooltip>
              </th>

              <th className="py-3 px-4  border-4 border-gray-200 w-[160px]">
                Status
                <Tooltip title="Sort by status" placement="top">
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    variant="standard"
                    disableUnderline
                    renderValue={(selected) => selected || "All"}
                    className=""
                    displayEmpty
                    sx={{
                      minWidth: 80,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "black",
                      pl: 1,
                      pr: 3,
                      borderRadius: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      ".MuiSelect-select": {
                        padding: 0,
                        paddingRight: "20px",
                      },
                      ".MuiSelect-icon": {
                        color: "black", // make dropdown arrow white
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Progress">Progress</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </Tooltip>
              </th>
              <Tooltip title="Sort by created date">
                <th
                  onClick={() => handleSort("created")}
                  className="pb-5 px-4 border-4 border-gray-200 w-[250px] cursor-pointer"
                >
                  Created At{" "}
                  <span>
                    {sortConfig.key === "created"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </th>
              </Tooltip>

              <Tooltip title="Sort by due date">
                <th
                  onClick={() => handleSort("deadline")}
                  className="pb-5 px-4 border-4 border-gray-200 w-[300px] cursor-pointer"
                >
                  Due Date{" "}
                  <span>
                    {sortConfig.key === "deadline"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </th>
              </Tooltip>
              <th className=" pb-5 px-4 border-4 border-gray-200 w-[160px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr className="border border-gray-600">
                <td
                  colSpan={8}
                  className="text-center text-black py-6 border-4 border-gray-200"
                >
                  No tasks match the current filter.
                </td>
              </tr>
            ) : (
              paginatedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/5 transition">
                  <td className="py-2 px-4 border-4 border-gray-200 w-[150px] break-words whitespace-pre-wrap">
                    {task.title}
                  </td>
                  <td className="py-2 px-4 border-4 border-gray-200  break-words whitespace-pre-wrap max-w-[400px]">
                    {expandedRows[task.id] || task.description.length <= 100
                      ? task.description
                      : `${task.description.slice(0, 100)}...`}
                    {task.description.length > 100 && (
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="text-emerald-300 ml-2  text-xs cursor-pointer"
                      >
                        {expandedRows[task.id] ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 border-4 border-gray-200 w-[150px] break-words whitespace-pre-wrap">
                    {task.assign}
                  </td>

                  <td className="py-2 px-4 border-4 border-gray-200 w-[160px] break-words whitespace-pre-wrap">
                    {/* <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === "Low"
                          ? "bg-[#CAE7CB] text-[#4CAF50]"
                          : task.priority === "Medium"
                          ? "bg-[#FFED85] text-[#FFC107]"
                          : "bg-[#FCC7C3] text-[#754B3E]"
                      }`}
                    > */}
                      <div className="flex gap-1">
    {[0, 1, 2].map((i) => (
      <div key={i} className={priorityBoxClasses(i, task.priority)} />
    ))}
  </div>
                    {/* </span> */}
                  </td>

                  <td className="py-2 px-4 border-4 border-gray-200 w-[160px] break-words whitespace-pre-wrap">
                    {task.status}
                  </td>
                  <td className="py-2 px-4 border-4 border-gray-200">
                    {/* {new Date(task.created).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })} */}
                    {formatDate(task.created)}
                  </td>
                  <td className="py-2 px-4 border-4 border-gray-200 w-[260px] whitespace-nowrap] ">
                    {/* {new Date(task.deadline).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })} */}
                    {formatDate(task.deadline)}
                  </td>

                  <td className="py-2 px-4 border-4 border-gray-200 w-[160px]">
                    <div className="flex gap-2 items-center ">
                      <Tooltip title="Edit task" arrow>
                        <IconButton
                          size="small"
                          color="inherit"
                          aria-label="edit task"
                          onClick={() => onEdit(task)}
                        >
                          <EditIcon fontSize="small" />
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className=" text-sm px-2 italic mt-4">
        {filteredTasks.length === 0 ? (
          <>Showing 0 out of {tasks.length} tasks</>
        ) : isFiltered ? (
          <>
            Showing {filteredTasks.length} out of {tasks.length} tasks
          </>
        ) : (
          <>
            Showing {(currentPage - 1) * tasksPerPage + 1}–
            {Math.min(currentPage * tasksPerPage, filteredTasks.length)} of{" "}
            {tasks.length} tasks
          </>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredTasks.length > tasksPerPage && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-1 px-4 rounded disabled:opacity-50 cursor-pointer"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className=" text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-1 px-4 rounded disabled:opacity-50 cursor-pointer"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(TaskListView);
