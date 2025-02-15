import axios, { AxiosError } from 'axios';
import { constants } from '../constants';
import { Story } from '../types';

export const getStoryInfo = async (storyID: string): Promise<Story | null> => {
    try {
        if (!storyID) {
            throw new Error("Story ID is required");
        }

        const response = await axios.get(constants.BACKEND_API_URL + `/story/getStoryInfo`, {
            params: { storyID }
        });

        if(!response.data.data)
            throw("No response data found")
        
        console.log("Story info:" , response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching story info:", error.response.data);
        return null;
    }
};

getStoryInfo("67ae3809a92665cb1f7cadbe")