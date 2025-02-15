import axios, { AxiosError } from 'axios';
import { constants } from '../constants';
import { Story } from '../types';

export const getStoriesByCategory = async (category: string): Promise<Array<Story> | null> => {
    try {
        if (!category) {
            throw new Error("Category is required");
        }

        const response = await axios.get(constants.BACKEND_API_URL + `/story/getStoriesByCategory`, {
            params: { category }
        });

        if(!response.data.data)
            throw("No response data found")

        console.log("Stories in category:" , response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching story info:", error.response?.data);
        return null;
    }
};

getStoriesByCategory("Animals")