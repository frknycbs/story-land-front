export type Story = {
    _id : string;
    text: string;
    title: string;
    name: string;
    category: string;
    thumbnailURL: string;
    audioURL: string;
    imageURL: string;
};

export type CategoryInfo = {
    categoryName: Category,
    bgImageURL: string
}

export type Category = 'animals' | 'space' | 'nature' | 'cars'