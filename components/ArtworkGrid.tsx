import { IArtwork } from 'models/artwork';
import { IConfig } from 'models/config';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { FaPencilAlt, FaTrash} from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';
import { artworksState } from '@/components/state/artworks';
import { configState } from '@/components/state/config';
import { ArtworksService } from 'services/artworks';

export default function ArtworkGrid ({handleEditArtwork, handleShowImage}) {

  const config = useRecoilValue<IConfig>(configState);
  const [artworks, setArtworks] = useRecoilState<IArtwork[]>(artworksState);


    const deleteArtwork = async (id) => {
      if (window.confirm("Delete this artwork " + id)) {
          const status = await ArtworksService.deleteArtwork(id)
          if (status === 204) {
              setArtworks(artworks.filter((aw) => aw._id !== id));
          }
      }
    }

    return (
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
              <td><img height={70} alt="" onClick={() => handleShowImage(a.imagePath)} src={config.imageRootURI + '/' + a.imagePath}></img></td>
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
                <Button onClick={() => deleteArtwork(a._id)}><FaTrash /></Button>
              </td>
            </tr>
          )
          }
        </tbody>
      </Table>
    )
    
}