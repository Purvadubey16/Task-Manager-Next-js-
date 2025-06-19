import api from './ApiService';

export const getTasks = ()=>{
    return api.get("/task/all")
}

export const addTask = (taskData) => {
  return api.post("/task", taskData);
};


export const updateTask  = (id, taskData) => {
 return api.put(`/task/${id}`, taskData);
}


export const deleteTask = (id) => {
  return api.delete(`/task/${id}`);
};