import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { FaPencilAlt, FaTrash} from 'react-icons/fa';

export default function ArtworkGrid ({config, artworks, callbackHandlers}) {

    const handleEditArtwork = callbackHandlers.handleEditArtwork;
    const handleShowImage = callbackHandlers.handleShowImageModal;
    const artworkDeleted = callbackHandlers.artworkDeleted;

    const deleteArtwork = async (id) => {
        if (window.confirm("Delete this artwork " + id)) {
            const res = await fetch("http://localhost:8000/works/" + id, {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              }
            });
            const status = await res.status;
            // notify main app so it can update artworks state.
            if (status === 204) {
                artworkDeleted(id);
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