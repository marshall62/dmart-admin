import Head from 'next/head'
import Image from 'next/image'
import Button from 'react-bootstrap/Button';
import { FaPencilAlt, FaTrash} from 'react-icons/fa';
import { GrAdd } from 'react-icons/gr';


import styles from '../styles/Home.module.css'
import { getArtworks } from '../services/artworks';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import EditModal from './modals/EditModal';
import ImageModal from './modals/ImageModal';
import { useState } from 'react';
import { IArtwork } from '../models/artwork';
import { IConfig } from '../models/config';



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
      allTags: Array.from(tags)
    }
  } 
}

const extractTags = (artworks: IArtwork[]): Set<string> => {
  const tags = new Set<string>();
  artworks.forEach( artwork => artwork.tags.forEach(tag => tags.add(tag)));
  return tags;
}


export default function Home({ allArtworks, config, allTags }) {
  const [showArtworkEditor, setShowArtworkEditor] = useState(false);
  const [artworks, setArtworks] = useState(allArtworks);
  const [tags, setTags] = useState(new Set<string>(allTags));
  const [artworkToEdit, setArtworkToEdit] = useState({});
  const [imageUrl, setImageUrl] = useState('')
  const [showImage, setShowImage] = useState(false)

  const handleClose = () => { 
    console.log("handleClose");
    setShowArtworkEditor(false); 
  }
  const handleAdd = () => {
    setArtworkToEdit({});
    setShowArtworkEditor(true);
  }

  const handleCloseImage = () => {
    setShowImage(false);
  }

  const showImageModal = (imagePath) =>{
    setShowImage(true);
    setImageUrl(config.imageRootURI + '/midsize/' + imagePath)
  }

  const handleDeleteArtwork = async (id) => {
    if (window.confirm("Delete this artwork " + id)) {
      const res = await fetch("http://localhost:8000/works/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });
      const status = await res.status;
      if (status === 204) {
        setArtworks(artworks.filter(aw => aw._id !== id))
      }
    }
  }

  const handleEditArtwork = async (artwork) => {
    console.log("edit ", artwork);
    setArtworkToEdit(artwork)
    setShowArtworkEditor(true);
  }

  const toArtwork = (artworkInfo): IArtwork => {
    const artwork = {...artworkInfo};
    artwork.price = artworkInfo.price ? parseFloat(artworkInfo.price) : undefined;
    artwork.width = artworkInfo.width ? parseInt(artworkInfo.width) : undefined;
    artwork.height = artworkInfo.height ? parseInt(artworkInfo.height) : undefined;
    artwork.year = artwork.year ? parseInt(artworkInfo.year) : undefined;
    return artwork;
  }

  const updateTags = (artworkTags: string[]) => {
    let newTags = false;
    artworkTags.forEach(tag => {
      if (!tags.has(tag)) 
        newTags = true;
    });
    if (newTags) {
      const newset = new Set<string>(tags);
      artworkTags.forEach(t => newset.add(t))
      setTags(newset);
    }
  }

  const handleSave = async (artworkInfo) => {
    const artwork: IArtwork = toArtwork(artworkInfo);
    updateTags(artwork.tags);
    handleClose();
    console.log("Saving", artwork)
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
      setArtworks([...artworks, content])
    }
    else if (status === 200 && exists) {
      const ix = artworks.findIndex(x => artwork._id === x._id);
      const newList = artworks.slice();
      newList.splice(ix,1,artwork);
      setArtworks(newList);
    }

  }



  return (
    <div >
      <Head>
        <title>{config.artist} Admin</title>
        <meta name="description" content="data administratior for dm art" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main className={styles.main}>
        <div className={styles.controlContainer}>
          <div>
            <h1 className={styles.title}>
              <a>{config.artist} Admin</a>
            </h1>
          </div>
          <div><Button onClick={handleAdd}><GrAdd/></Button></div>
        </div>
        <ImageModal url={imageUrl} show={showImage} handleClose={handleCloseImage}></ImageModal>
        <EditModal config={config} artwork={artworkToEdit} allTags = {tags} show={showArtworkEditor} handleClose={handleClose} handleSave={handleSave}> </EditModal>
        {/* <ul>{Array.from(tags).map((t,ix) => <li key={ix}>{t}</li>)}</ul> */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>title</th>
              <th>year</th>
              <th>dimensions</th>
              <th>price</th>
              <th>media</th>
              <th>filename</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {artworks.map((a,index) => 
              <tr key={index}>
                <td><img height={70} onClick={() => showImageModal(a.imagePath)} src={config.imageRootURI + '/' + a.imagePath}></img></td>
                <td>{a.title}</td>
                <td>{a.year}</td>
                <td>{a.width} {a.width ? "x" : ""} {a.height}</td>
                <td>{a.price}</td>
                <td>{a.media}</td>
                <td>{a.imagePath}</td>
                <td>
                  <Button onClick={() => handleEditArtwork(a) }>
                    <FaPencilAlt />
                  </Button>
                  <Button onClick={() => handleDeleteArtwork(a._id)}><FaTrash /></Button>
                </td>
              </tr>
            )
            }
          </tbody>
        </Table>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
