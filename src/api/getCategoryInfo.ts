import axios, { AxiosError } from 'axios';
import { constants } from '../constants';
import { Category, CategoryInfo, Story } from '../types';

export const getCategoryInfo = async (): Promise<Array<CategoryInfo> | null> => {
    try {
        
        const response = await axios.get(constants.BACKEND_API_URL + `/category/getCategoryInfo`, {timeout: 5000});
        if(!response.data)
            throw("No response data found")
        
        // console.log("Category info:" , response.data);
        return response.data;
    } catch (error: any) {
        console.log("Error fetching category info:", error);
        return null;
    }
};

// getCategoryInfo()

/* 
Example Response

[
    {
        "categoryName": "animals",
        "bgImageURL": "http://192.236.195.254/storyland/category_backgrounds/animals.jpg"
    },
    {
        "categoryName": "cars",
        "bgImageURL": "http://192.236.195.254/storyland/category_backgrounds/cars.jpg"
    },
    {
        "categoryName": "nature",
        "bgImageURL": "http://192.236.195.254/storyland/category_backgrounds/nature.jpg"
    },
    {
        "categoryName": "space",
        "bgImageURL": "http://192.236.195.254/storyland/category_backgrounds/space.jpg"
    }
]

*/