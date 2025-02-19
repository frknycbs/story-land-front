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

        if(!response.data)
            throw("No response data found")

        // console.log("Stories in category:" , response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching story info:", error.status ? error.response.data : error);
        return null;
    }
};

// getStoriesByCategory("animals")

/* 

Example Response
[
  {
    _id: '67b195765767b1e50eb6e3b3',
    text: 'Once upon a time, in a bright forest with singing leaves and sparkling streams, there was a little bird named Chirpy. Chirpy had blue feathers and loved to sing happy songs all day. But he dreamed of flying far away and seeing new places. One sunny morning, Chirpy decided it was time for an adventure. He flapped his wings and soared high above the forest. The wind felt fun and exciting as it 
carried him away. While flying over a shiny river, Chirpy saw a tiny glowing light on the water. He flew down and found it was a little firefly named Flicker. Flicker had lost her way! Chirpy gently helped her find her friends by the glowing riverbank. Flicker twinkled brightly to say, "Thank you!" Chirpy continued flying and soon reached a big, tall hill. The hill looked hard to climb, and Chirpy felt 
tired and unsure. But then, he met a wise old sparrow who told him, "Sometimes, the hardest climb gives you the best view." Chirpy felt brave and kept going. When Chirpy reached the top, he saw a beautiful valley full of colorful flowers. He met some new friends—a playful rabbit, a gentle fawn, and a shy hedgehog. They all shared stories and laughed together. As night came, Chirpy flew back home to his 
favorite branch. He looked up at the stars and felt happy and proud. His adventure had taught him that even though some things are hard, they can lead to wonderful surprises and new friends.',
    title: 'Chirpy’s Big Adventure',
    name: 'bird',
    category: 'animals',
    thumbnailURL: 'http://192.236.195.254/storyland/thumbnails/bird_thumbnail.jpg',
    imageURL: 'http://192.236.195.254/storyland/backgrounds/bird_bg.jpg',
    audioURL: 'http://192.236.195.254/storyland/audios/bird_audio.mp3',
    __v: 0
  },
  {
    _id: '67b19f485767b1e50eb6e3d0',
    text: 'In the busy town of Sunnyville, there lived a happy little bus named Buzzy. He was bright yellow and loved taking children to school, the park, and the market. But deep inside, Buzzy dreamed of an adventure beyond the town’s streets. One sunny morning, Buzzy saw a mysterious road sign pointing to "New Horizons Land." It sounded magical! With a joyful rumble, Buzzy decided to follow the sign and explore the unknown road. As he drove along twisting country roads, Buzzy met a friendly tractor named Tilly. "Where are you going, Buzzy?" asked Tilly. "To New Horizons Land!" Buzzy said excitedly. "Enjoy your adventure!" said Tilly, waving a big wheel. Buzzy also met a wise old bridge who had seen many travelers. "Keep going, little bus. Every road has a story!" the bridge whispered. But—oh no!—Buzzy reached a bumpy, rocky road! He wasn’t sure how to get across. Luckily, a strong tow truck named Max came to help. "I’ll guide you, Buzzy! Just go slow and steady." With Max’s help, Buzzy carefully rolled past the rocks and into a beautiful new village! The village was bright and colorful, with houses made of recycled treasures. The friendly villagers welcomed Buzzy and listened to his exciting stories. After a few happy days, Buzzy realized he missed home. With a heart full of memories and new friendships, he rumbled back to Sunnyville, knowing the world was full of surprises just waiting to be explored. From that day on, whenever Buzzy saw a curious road sign, he smiled—because he knew that every journey is an adventure!',
    title: 'Buddy’s Amazing Trip',
    name: 'dog',
    category: 'animals',
    thumbnailURL: 'http://192.236.195.254/storyland/thumbnails/dog_thumbnail.jpg',
  {
    _id: '67b1a9da5767b1e50eb6e3e2',
    text: `Once upon a time, in a quiet little village, there lived a tiny kitten named Whiskers. She had soft, silvery fur and big, bright eyes. Whiskers loved chasing butterflies in the garden, but she always wondered what was beyond the old wooden gate. One night, under a big, glowing moon, Whiskers saw something sparkle near the stone wall. Curious, she padded over and found a tiny door hidden in the vines! She gave it a little push with her paw, and—creak!—the door opened. Inside was a magical garden, glowing in the moonlight! The flowers twinkled, and soft whispers floated through the air. As Whiskers explored, she met Flicker, a friendly firefly whose little light danced beside her. "Come with me!" said Flicker, zipping ahead. Whiskers followed Flicker past bubbling brooks and under archways of glowing vines. Soon, they reached a quiet clearing, where a shiny flower stood tall. The flower’s petals slowly opened, and in a gentle whisper, it shared a secret: "True magic is not just what you see—it's in being brave and kind." Whiskers smiled, feeling warm and happy inside. She thanked Flicker and padded back home, her little heart filled with wonder. Even though she was back in her own garden, Whiskers knew she had discovered something special. From that night on, she always remembered: Kindness and courage make the world more magical!`,
    title: 'Whiskers and the Secret Garden',
    name: 'cat',
    category: 'animals',
    thumbnailURL: 'http://192.236.195.254/storyland/thumbnails/cat_thumbnail.jpg',
    imageURL: 'http://192.236.195.254/storyland/backgrounds/cat_bg.jpg',
    audioURL: 'http://192.236.195.254/storyland/audios/cat_audio.mp3',
    __v: 0
  }
]

*/ 