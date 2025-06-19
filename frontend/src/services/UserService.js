import api from './ApiService';


export const getUserDetails = ()=>{
    return api.get('/user/me')
}

export const login = ({email,password})=>{
    return api.post('/user/login', { email, password })
}

export const register = ({name,email,password})=>{
    return api.post('/user/register', {name,email,password})
}

export const updateUser = (id, userData) => {
  return api.put(`/user/${id}`, userData);
};

export const uploadProfile = (formData)=>{
    return api.post('/user/upload-profile',formData)
}