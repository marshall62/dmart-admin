import { IArtwork } from "../models/artwork";

export const getArtworks = async () => {
    const res = await fetch('http://localhost:8000/works');
    let works: IArtwork[] =  await res.json();
    return works;
} 
