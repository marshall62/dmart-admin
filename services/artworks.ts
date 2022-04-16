import { IArtwork } from "../models/artwork";


export class ArtworksService {

  public static async getArtworks(): Promise<IArtwork[]> {
    const res = await fetch(process.env.NEXT_PUBLIC_API + 'works');
    let works: IArtwork[] = await res.json();
    return works;
  }

  public static async deleteArtwork(id): Promise<number> {
    const res = await fetch(process.env.NEXT_PUBLIC_API + "works/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    });
    const status = await res.status;
    return status
  }

  public static async updateArtwork(artwork: IArtwork): Promise<{status:number, artwork: IArtwork}> {
    const id = artwork._id;
    let url = process.env.NEXT_PUBLIC_API + "works/" +  id ;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artwork),
    });
    const content:IArtwork = await res.json();
    const status = await res.status;
    return {status, artwork:content}

  }

  public static async saveArtwork(artwork: IArtwork): Promise<{status:number, artwork: IArtwork}> {
    let url = process.env.NEXT_PUBLIC_API + "works";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artwork),
    });
    const content = await res.json();
    const status = await res.status;
    return {status, artwork:content}
  }


}