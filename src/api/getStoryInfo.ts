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

        if (!response.data)
            throw ("No response data found")

        console.log("Story info:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching story info:", error.status ? error.response.data : error);
        return null;
    }
};

// getStoryInfo("67b1a9da5767b1e50eb6e3e2")

/* 

Example Response

{
  _id: '67b1a9da5767b1e50eb6e3e2',
  text: `Once upon a time, in a quiet little village, there lived a tiny kitten named Whiskers. She had soft, silvery fur and big, bright eyes. Whiskers loved 
  chasing butterflies in the garden, but she always wondered what was beyond the old wooden gate. One night, under a big, glowing moon, Whiskers saw something 
  sparkle near the stone wall. Curious, she padded over and found a tiny door hidden in the vines! She gave it a little push with her paw, and—creak!—the door 
  opened. Inside was a magical garden, glowing in the moonlight! The flowers twinkled, and soft whispers floated through the air. As Whiskers explored, she met 
  Flicker, a friendly firefly whose little light danced beside her. "Come with me!" said Flicker, zipping ahead. Whiskers followed Flicker past bubbling brooks 
  and under archways of glowing vines. Soon, they reached a quiet clearing, where a shiny flower stood tall. The flower’s petals slowly opened, and in a gentle 
  whisper, it shared a secret: "True magic is not just what you see—it's in being brave and kind." Whiskers smiled, feeling warm and happy inside. She thanked 
  Flicker and padded back home, her little heart filled with wonder. Even though she was back in her own garden, Whiskers knew she had discovered something 
  special. From that night on, she always remembered: Kindness and courage make the world more magical!`,
  
  title: 'Whiskers and the Secret Garden',
  name: 'cat',
  category: 'animals',
  thumbnailURL: 'http://192.236.195.254/storyland/thumbnails/cat_thumbnail.jpg',
  imageURL: 'http://192.236.195.254/storyland/backgrounds/cat_bg.jpg',
  audioURL: 'http://192.236.195.254/storyland/audios/cat_audio.mp3',
  __v: 0
}

*/