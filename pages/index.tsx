
import styles from "@/styles/Home.module.css";
import { getArtworks } from "services/artworks";
import "bootstrap/dist/css/bootstrap.css";

import { IArtwork } from "models/artwork";
import { IConfig } from "models/config";
import Dashboard from "@/components/Dashboard";

// export async function getStaticProps() {
export const getServerSideProps = async () => {
  const res = await fetch("http://localhost:8000/config");
  const config: IConfig = await res.json();
  const data: IArtwork[] = await getArtworks();
  const tags: Set<string> = extractTags(data);

  // The value of the `props` key will be
  //  passed to the `Home` component and it must be serializable as JSON
  // which is why the tags Set is converted to an array.
  return {
    props: {
      allArtworks: data,
      config: config,
      allTags: Array.from(tags),
    },
  };
};

const extractTags = (artworks: IArtwork[]): Set<string> => {
  const tags = new Set<string>();
  artworks.forEach((artwork) => artwork.tags.forEach((tag) => tags.add(tag)));
  return tags;
};

export default function Home({ allArtworks, config, allTags }) {

  return (
    <div>
      <Dashboard config={config} allArtworks={allArtworks} allTags={allTags}></Dashboard>
    </div>
  );
}
