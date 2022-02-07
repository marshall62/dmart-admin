import styles from "./Dashboard.module.css";
import Button from "react-bootstrap/Button";
import { GrAdd } from "react-icons/gr";
import Head from "next/head";
import ArtworkGrid from "@/components/ArtworkGrid";
import EditModal from "@/components/modals/EditModal";
import ImageModal from "@/components/modals/ImageModal";
import { useState } from "react";
import { IArtwork } from "models/artwork";
import { IConfig } from "models/config";

export default function Dashboard({ config, allArtworks, allTags }) {

  const [showArtworkEditor, setShowArtworkEditor] = useState(false);
  const [artworks, setArtworks] = useState(allArtworks);
  const [tags, setTags] = useState(new Set<string>(allTags));
  const [artworkToEdit, setArtworkToEdit] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [showImage, setShowImage] = useState(false);


  // handler functions that are callbacks from this and sub-components.
  
  const handleClose = () => {
    setShowArtworkEditor(false);   
  };

  const handleAdd = () => {
    setArtworkToEdit({ tags: [] });
    setShowArtworkEditor(true);
  };

  const handleCloseImage = () => {
    setShowImage(false);
  };

  const handleShowImageModal = (imagePath) => {
    setShowImage(true);
    setImageUrl(config.imageRootURI + "/midsize/" + imagePath);
  };

  // This callback is necessary because the child ArtworkGrid cant change the artworks state
  // of this.  TODO move artworks into a Recoil state and then it will be able to.
  const handleArtworkDeleted = async (id) => {
    setArtworks(artworks.filter((aw) => aw._id !== id));
  };

  const handleEditArtwork = async (artwork) => {
    console.log("edit ", artwork);
    setArtworkToEdit(artwork);
    setShowArtworkEditor(true);
  };

  const handleSave = async (artworkInfo) => {
    const artwork: IArtwork = toArtwork(artworkInfo);
    parseTags(artwork.tags);
    handleClose();
    console.log("Saving", artwork);
    const exists = !!artwork._id;
    let url = "http://localhost:8000/works";
    let method = "POST";
    if (exists) {
      url += `/${artwork._id}`;
      method = "PATCH";
    }
    const res = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artwork),
    });
    const content = await res.json();
    const status = await res.status;
    if (status === 201 && !exists) {
      setArtworks([...artworks, content]);
    } else if (status === 200 && exists) {
      const ix = artworks.findIndex((x) => artwork._id === x._id);
      const newList = artworks.slice();
      newList.splice(ix, 1, artwork);
      setArtworks(newList);
    }
  };

  //   Helper functions

  const toArtwork = (artworkInfo): IArtwork => {
    const artwork = { ...artworkInfo };
    artwork.price = artworkInfo.price
      ? parseFloat(artworkInfo.price)
      : undefined;
    artwork.width = artworkInfo.width ? parseInt(artworkInfo.width) : undefined;
    artwork.height = artworkInfo.height
      ? parseInt(artworkInfo.height)
      : undefined;
    artwork.year = artwork.year ? parseInt(artworkInfo.year) : undefined;
    return artwork;
  };

  const parseTags = (artworkTags: string[]) => {
    let newTags = false;
    artworkTags.forEach((tag) => {
      if (!tags.has(tag)) newTags = true;
    });
    if (newTags) {
      const newset = new Set<string>(tags);
      artworkTags.forEach((t) => newset.add(t));
      setTags(newset);
    }
  };

  return (
    <main className={styles.main}>
      <Head>
        <title>{config.artist} Admin</title>
        <meta name="description" content="data administratior for dm art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.controlContainer}>
        <div>
          <h1 className={styles.title}>
            <a>{config.artist} Admin</a>
          </h1>
        </div>
        <div>
          <Button onClick={handleAdd}>
            <GrAdd />
          </Button>
        </div>
      </div>
      <ImageModal
        url={imageUrl}
        show={showImage}
        handleClose={handleCloseImage}
      ></ImageModal>
      <EditModal
        config={config}
        artwork={artworkToEdit}
        allTags={tags}
        show={showArtworkEditor}
        handleClose={handleClose}
        handleSave={handleSave}
      >
        {" "}
      </EditModal>
      <ArtworkGrid
        config={config}
        artworks={artworks}
        callbackHandlers={{
          handleEditArtwork: handleEditArtwork,
          artworkDeleted: handleArtworkDeleted,
          handleShowImageModal: handleShowImageModal,
        }}
      ></ArtworkGrid>
    </main>
  );
}
