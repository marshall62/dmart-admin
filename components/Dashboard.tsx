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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { artworksState } from "@/components/state/artworks";
import { tagsState } from "@/components/state/tags";
import { configState } from "@/components/state/config";
import { ArtworksService } from "services/artworks";

// export default function Dashboard() {
export default function Dashboard() {

  const config = useRecoilValue<IConfig>(configState);
  const [artworks, setArtworks] = useRecoilState<IArtwork[]>(artworksState);
  const [tags, setTags] = useRecoilState<Set<string>>(tagsState);


  const [showEditorModal, setShowEditorModal] = useState(false);
  const [artworkToEdit, setArtworkToEdit] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);


  // handler functions that are callbacks from this and sub-components.
  
  const handleCloseEditModal = () => {
    setShowEditorModal(false);   
  };

  const handleAdd = () => {
    setArtworkToEdit({ tags: [] });
    setShowEditorModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const handleShowImageModal = (imagePath) => {
    setShowImageModal(true);
    setImageUrl(config.imageRootURI + "/midsize/" + imagePath);
  };

  const handleEditArtwork = async (artwork) => {
    setArtworkToEdit(artwork);
    setShowEditorModal(true);
  };


  const handleSaveEditModal = async (work: IArtwork) => {
    updateTagSet(work.tags);
    handleCloseEditModal();
    let  res;
    const exists = !!work._id;
    if (exists) {
      res = await ArtworksService.updateArtwork(work);
    }
    else {
      res = await ArtworksService.saveArtwork(work);
    }
    let {status, artwork} = res;

    if (status === 201 && !exists) {
      setArtworks([...artworks, artwork]);
    } 
    else if (status === 200 && exists) {
      const ix = artworks.findIndex((x) => artwork._id === x._id);
      const newList = artworks.slice(); // clone
      newList.splice(ix, 1, artwork); // replace
      setArtworks(newList);
    }
  };



  // update the global set of tags to include any new ones added to the edited artwork.
  const updateTagSet = (artworkTags: string[]) => {
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
        show={showImageModal}
        handleClose={handleCloseImageModal}
      ></ImageModal>
      <EditModal
        artwork={artworkToEdit}
        show={showEditorModal}
        handleClose={handleCloseEditModal}
        handleSave={handleSaveEditModal}
      >
      </EditModal>
      <ArtworkGrid
          handleEditArtwork= {handleEditArtwork}
          handleShowImage= {handleShowImageModal}
      ></ArtworkGrid>
    </main>
  );
}
