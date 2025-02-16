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

// getStoryInfo("67b1d54ebf6799ed9bc54075")

/* 

Example Response

{
  _id: '67b1d54ebf6799ed9bc54075',
  text: 'Once upon a time, in a happy little town, there lived a small dog named Buddy. He had shiny eyes and a curious heart. Every day, he chased butterflies, sniffed flowers, and dreamed of exciting adventures. One morning, Buddy found a crinkled old map under a pile of leaves. The map had shiny stars and a twisting path leading to a secret place called the Enchanted Meadow. Buddy’s tail wagged with 
excitement—it was time for an adventure! With the map in his mouth, Buddy trotted through town and into a whispering forest. There, he met Oliver the wise owl. "Trust your heart, little one," said Oliver. "The path will show itself." Buddy smiled and kept going. But—oh no!—a big gust of wind blew the map away! Luckily, a friendly squirrel named Nutty saw what happened. "I’ll get it!" Nutty scampered up 
a tree and grabbed the map. "Thank you, Nutty!" Buddy barked happily. Together, they followed the path until they reached the Enchanted Meadow. The grass sparkled, the flowers danced, and in the middle stood a giant oak tree with a tiny door. Buddy gave a brave bark and knocked. The door creaked open, and inside, a cozy secret room twinkled with lights! On a soft cushion, Buddy found a note from Hazel the hedgehog: "Every adventure teaches us something new. With courage and good friends, you can find magic anywhere!" Buddy’s heart felt warm and happy. He had found a beautiful place, but more importantly, he had made a new friend and learned that bravery and kindness make every adventure special. As the stars twinkled above, Buddy and Nutty trotted home, ready for more magical adventures to come!',    
  title: 'Buddy’s Amazing Trip',
  name: 'dog',
  category: 'animals',
  thumbnailURL: 'http://192.236.195.254/storyland/thumbnails/dog_thumbnail.jpg',
  imageURL: 'http://192.236.195.254/storyland/backgrounds/dog_bg.jpg',
  audioURL: 'http://192.236.195.254/storyland/audios/dog_audio.mp3',
  __v: 0
}

*/