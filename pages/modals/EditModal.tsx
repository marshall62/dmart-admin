import "bootstrap/dist/css/bootstrap.css";
import styles from './EditModal.module.css';
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { IConfig } from "../../models/config";
import { IArtwork } from "../../models/artwork";


function parseTags (tags) {
  return tags.map(t => {
    if (typeof(t) == "string")
      return t;
    else if (typeof(t) == 'object')
      return t.label;
  })
}

export default function EditModal({children, config, artwork, allTags, show, handleClose, handleSave }) {
  config = config as IConfig; // because I can't set types on the destructured vars above.
  artwork = artwork as IArtwork;
  const [title, setTitle] = useState(artwork.title || '')
  const [price, setPrice] = useState(artwork.price || '')
  const [isSold, setSold] = useState(artwork.isSold || false)
  const [width, setWidth] = useState(artwork.width || '')
  const [height, setHeight] = useState(artwork.height || '')
  const [imagePath, setImagePath] = useState(artwork.url || '')
  const [media, setMedia] = useState(artwork.media || '')
  const [year, setYear] = useState(artwork.date || '')
  const [tags, setTags] = useState(artwork.tags || [])
  const [work, setWork] = useState(artwork);
  const [example, setExample] = useState(false);
  const [categoryName, setCategoryName] = useState(artwork.exemplarTitle || '')
  let options = Array.from(allTags);
  const imagePathPrefix = config.filename;

  // When a button is clicked in the home component, it changes the
  // artwork prop.  This reacts to that and then sets the state
  // to the new values.
  useEffect(() => {
    setTitle(artwork.title || '');
    setPrice(artwork.price || '');
    setSold(artwork.isSold || false);
    setWidth(artwork.width || '');
    setHeight(artwork.height || '');
    setImagePath(getFilename(artwork.imagePath) || '');
    setMedia(artwork.media || '');
    setYear(artwork.year || '');
    setTags(artwork.tags || []);
    setExample(!!artwork.categoryName);
    setCategoryName(artwork.categoryName || '');
    setWork(artwork);
    console.log("Editing artwork",artwork);
  }, [artwork])

  useEffect(() => {
    options = Array.from(allTags);
  }, [allTags])


  const getFilename = (imagePath) => {
    if (imagePath) {
      const ix = imagePath.lastIndexOf('/');
      let fileNum = imagePath.slice(ix+1).split('_')[2];
      return fileNum.split('.')[0]
    }
    return '';
  }

  const artworkFromForm = () => {
    const artwork =  {
      title: title,
      price: (price),
      width: (width),
      height: (height),
      media: media,
      year: (year),
      categoryName: categoryName,
      tags: parseTags(tags),
      // this is poorly done - it won't allow entries like /portraits/dave.jpg
      imagePath: !imagePath.startsWith(imagePathPrefix) ? (imagePathPrefix + imagePath + '.jpg') : imagePath,
      isSold: isSold,
      _id: work._id
    };
    if (example && !artwork.tags.includes('exemplar'))
      artwork.tags.push('exemplar')

    if (price === 'sold') {
      artwork.price = undefined;
      artwork.isSold = true;
    }
    return artwork;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter title" value={title}
              onChange={(e) => setTitle(e.target.value)}/>
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dimensions</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control aria-label="" placeholder="width" value={width}
                onChange={e => setWidth(e.target.value)}/>
              <InputGroup.Text>X</InputGroup.Text>
              <Form.Control aria-label="" placeholder="height" value={height}
                onChange={e => setHeight(e.target.value)}/>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control type="text" value={year}
              onChange={e => setYear(e.target.value) }/>
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Filename</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>{imagePathPrefix}</InputGroup.Text>
              <Form.Control aria-label="" value={imagePath}
                onChange={e => setImagePath(e.target.value)}/>
              <InputGroup.Text>.jpg</InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Media</Form.Label>
            <Form.Select aria-label="media" value={media}
              onChange={e => setMedia(e.target.value)}>
              <option>-</option>
              <option value="Oil on canvas">Oil on canvas</option>
              <option value="Oil on paper">Oil on paper</option>
              <option value="Oil on muslin panel">Oil on muslin panel</option>
              <option value="Oil on panel">Oil on panel</option>
              <option value="Pencil">Pencil</option>
              <option value="Charcoal">Charcoal</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Price</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control aria-label="Amount (to the nearest dollar)" value={price}
                onChange={e => setPrice(e.target.value)}/>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Sold" 
              checked={isSold}
              onChange={() => {
                setSold(!isSold);
              }}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Typeahead id="tags" className={styles.typeahead} multiple placeholder="enter multiple tags"
              onChange={setTags}
              options={options}
              selected={tags}
              clearButton={true}
              allowNew={true}
              size={'small'}
              >
            </Typeahead>
            <Form.Text className="text-muted" >
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Category Example" 
              checked={example}
              onChange={() => {
                setExample(!example);
              }}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control type="text" disabled={!example} value={categoryName}
              onChange={e => setCategoryName(e.target.value)}/>
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSave(artworkFromForm())}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
