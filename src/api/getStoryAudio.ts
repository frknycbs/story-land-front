import axios, { AxiosError } from 'axios';
import { constants } from '../constants';

export const getStoryAudio = async (storyID: string): Promise<Blob | null> => {
    try {
        if (!storyID) {
            throw new Error("Story ID is required");
        }

        const response = await axios.get(constants.BACKEND_API_URL + `/story/getStoryAudio`, {
            params: { storyID },
            responseType: 'blob', // Ensures audio is received as binary
        });

        if(!response.data.data)
            throw("No response data found")
        
        console.log("Story Audio as binary file:" , response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching story info:", error.response.data);
        return null;
    }
};

getStoryAudio("67ae3809a92665cb1f7cadbe")