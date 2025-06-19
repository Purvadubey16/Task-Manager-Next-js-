import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,  
    // headers: {
    //     'Content-Type': 'application/json',
    // }
})

// api.interceptors.request.use(
//     (config)=>{
//         const token = localStorage.getItem('authToken');
//         if(token){
//             config.headers.Authorization=`Bearer ${token}`;
//         }
//         return config;
//     },
//     (error)=>Promise.reject(error)
// )

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  const isAuthRoute = config.url.includes("/login") || config.url.includes("/register");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
    (response) =>response,
    (error) =>{
        if(error.response.status === 401){
            console.warn("unauthorized");
            
        }
        return Promise.reject(error);
    }
)

export default api;