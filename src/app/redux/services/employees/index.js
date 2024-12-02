import { APP_API_URL } from '../../../../assets/api-endpoints'
import UseAxios  from '../../../../assets/hooks/use-axios'


export const fetchUserLeave = async(auth) =>{
    const axiosInstance = UseAxios();
    try {
        const response = await axiosInstance.get(`${APP_API_URL.FETCH_USER_LEAVE}`,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}

export const fetchAllLeaves = async(auth) =>{
    const axiosInstance = UseAxios();
    try {
        const response = await axiosInstance.get(`${APP_API_URL.FETCH_ALL_LEAVES}`,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}

export const createLeave = async(payload,auth) =>{
    const axiosInstance = UseAxios();
    try {
        const response = await axiosInstance.post(`${APP_API_URL.ADD_LEAVE}`,payload,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}

export const updateLeave = async(payload,id,auth) =>{
    const axiosInstance = UseAxios();
    const data = {
        ...payload,
        id
    }
    try {
        const response = await axiosInstance.put(`${APP_API_URL.UPDATE_LEAVE}`,data,{
            headers:{
                Authorization: auth ? `Bearer ${auth}` : undefined,
            }
        })
        return response.data;
    } catch (error) {
        return error.message
    }
}


export const deleteLeave = async(id,auth) =>{
    const axiosInstance = UseAxios();
    try {
        const response = await axiosInstance.delete(`${APP_API_URL.DELETE_LEAVE}`,{
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


export const approvedLeave = async(payload,id,auth) =>{
    const axiosInstance = UseAxios();
    const data = {
        ...payload,
        id
    }
    try {
        const response = await axiosInstance.put(`${APP_API_URL.UPDATE_LEAVE}`,data,{
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