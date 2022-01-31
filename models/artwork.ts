export interface IArtwork {
    _id: string,
    title: string,
    price: number,
    tags: string[],
    width: number,
    height: number,
    year: number,
    categoryName: string | null,
    isSold: boolean,
    media: string,
    imagePath: string
}