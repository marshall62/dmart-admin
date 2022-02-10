
import { ArtworksService } from "services/artworks";
import "bootstrap/dist/css/bootstrap.css";
import {RecoilRoot, useRecoilState, useSetRecoilState} from 'recoil';
import {configState} from "components/state/config";
import {artworksState} from "components/state/artworks";
import {tagsState} from "components/state/tags";
import { IArtwork } from "models/artwork";
import { IConfig } from "models/config";
import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";

// export async function getStaticProps() {

// next.js get the config and artworks from the API on a per request basis since
// the artworks list is changing
export const getServerSideProps = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API + "config");
  const config: IConfig = await res.json();
  const data: IArtwork[] = await ArtworksService.getArtworks();
  const tags: Set<string> = extractTags(data);
  const props: {allArtworks: IArtwork[], config: IConfig, allTags: string[]} = {} as any;

  props.allArtworks = data;
  props.config = config;
  props.allTags = Array.from(tags);
  // The value of the `props` key will be
  //  passed to the `Home` component and it must be serializable as JSON
  // which is why the tags Set is converted to an array.
  return {
    props: props,
  };
};

// go through all the tags of the artworks and build a comprehensive set of them.
const extractTags = (artworks: IArtwork[]): Set<string> => {
  const tags = new Set<string>();
  artworks.forEach((artwork) => artwork.tags.forEach((tag) => tags.add(tag)));
  return tags;
};

export default function Home({ allArtworks, config, allTags }) {

  const setConfig = useSetRecoilState<IConfig>(configState);
  const setArtworks = useSetRecoilState<IArtwork[]>(artworksState);
  const setTags = useSetRecoilState<Set<string>>(tagsState);

  // N.B. Will get a warning in the browser about Cannot update a component from inside a function body of a different
  // component.  This is because of recoil issue https://github.com/facebookexperimental/Recoil/issues/12
  // *The solution seems to be to put these initial calls to setXXX of the recoil state inside a useEffect* 
  useEffect(() => {
    setConfig(config);
    setArtworks(allArtworks);
    setTags(new Set<string>(allTags));
  })

  return (
    <>
      <Dashboard/>
      Back-end is running at {process.env.NEXT_PUBLIC_API}
    </>

  );
}
