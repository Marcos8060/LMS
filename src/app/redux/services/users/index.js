import { APP_API_URL } from '../../../../assets/api-endpoints'
import UseAxios  from '../../../../assets/hooks/use-axios'


export const fetchUsers = async(auth) =>{
    const axiosInstance = UseAxios();
    try {
        const response = await axiosInstance.get(`${APP_API_URL.FETCH_USERS}`,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}

export const createUser = async(payload,auth) =>{
    const axiosInstance = UseAxios();
    try {
        const response = await axiosInstance.post(`${APP_API_URL.CREATE_USERS}`,payload,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}

export const editUser = async(payload,id,auth) =>{
    const axiosInstance = UseAxios();
    const data = {
        ...payload,
        id
    }
    try {
        const response = await axiosInstance.put(`${APP_API_URL.EDIT_USER}`,data,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}

export const deleteUser = async(id,auth) =>{
    const axiosInstance = UseAxios();
    try {
        const response = await axiosInstance.delete(`${APP_API_URL.DELETE_USER}`,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            },
            data: { userId: id }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}

