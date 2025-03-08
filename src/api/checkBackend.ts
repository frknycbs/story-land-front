import axios, { AxiosError } from 'axios';
import { constants } from '../constants';
import { BackendHealth, Category, CategoryInfo, Story } from '../types';

export const checkBackend = async (): Promise<boolean | null> => {
    try {
        
        const response = await axios.get(constants.BACKEND_API_URL + `/health`, {timeout: 5000});
        if(!response.data)
            throw("No response data found")
        
        const health: BackendHealth = response.data
        
        const isBackendOnline: true | false = health.status === "OK" && health.count > 0
        console.log(health, isBackendOnline)
        return isBackendOnline
    } catch (error: any) {
        console.error("Error fetching status info from backend:", error.status ? error.response.data : error);
        return null;
    }
};