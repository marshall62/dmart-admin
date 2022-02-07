import "bootstrap/dist/css/bootstrap.css";
import styles from './EditModal.module.css';
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { IConfig } from "../../models/config";
import { IArtwork } from "../../models/artwork";


function parseTags (tags, isExample=false): string[] {
  const res = tags.map(t => {
    if (typeof(t) == "string")
      return t;
    else if (typeof(t) == 'object')
      return t.label;
  });
  if (isExample && !res.includes('exemplar'))
    res.push('exemplar')
  else if (!isExample && res.includes('exemplar')) 
    res.splice(res.indexOf('exemplar'), 1)
  return res;
}

export default function EditModal({config={}, artwork={}, allTags=[], show, handleClose, handleSave }) {
  config = config as IConfig; // because I can't set types on the destructured vars above.
  artwork = artwork as IArtwork;

  const [fileNum, setFileNum] = useState('')
  const [work, setWork] = useState(artwork);
  const [example, setExample] = useState(false);
  let options = Array.from(allTags);
  const imagePathPrefix = config.filename;

  // When a button is clicked in the home component, it changes the
  // artwork prop.  This reacts to that and then sets the state
  // to the new values.
  useEffect(() => {

    setFileNum(getFileNum(artwork.imagePath) || '');
    setExample(artwork?.tags?.includes('exemplar') || false);
    setWork(artwork);
  }, [artwork])

  useEffect(() => {
    options = Array.from(allTags);
  }, [allTags])


  const getFileNum = (imagePath) => {
    if (imagePath) {
      const ix = imagePath.lastIndexOf('/');
      let fileNumAndExt = imagePath.slice(ix+1).split('_')[2];
      return fileNumAndExt.split('.')[0]
    }
    return '';
  }

  const artworkFromForm = () => {
    const editedArtwork = {...work, 
      tags: parseTags(work.tags, example), 
      imagePath: fileNum ? (imagePathPrefix + fileNum + '.jpg') : '',  
    }
    return editedArtwork;
  }

  const handleFieldChange = (e) => {
    // clever way to set any field where field name is [e.target.id]
    setWork({...work, [e.target.id]: e.target.value})
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control id="title" data-testid="title" type="text" placeholder="Enter title" value={work.title || ''}
              onChange={handleFieldChange}
              />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dimensions</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control id="width" aria-label="width" placeholder="width" value={work.width || ''}
                onChange={handleFieldChange}/>
              <InputGroup.Text>X</InputGroup.Text>
              <Form.Control id="height" aria-label="height" placeholder="height" value={work.height || ''}
                onChange={handleFieldChange}/>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control id="year" data-testid="year" type="text" value={work.year || ''}
              onChange={handleFieldChange}/>
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Filename</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>{imagePathPrefix}</InputGroup.Text>
              <Form.Control aria-label="filenum" value={fileNum}
                onChange={e => setFileNum(e.target.value)}/>
              <InputGroup.Text>.jpg</InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Media</Form.Label>
            <Form.Select id="media" aria-label="media" value={work.media || ''}
              onChange={handleFieldChange}>
              <option>-</option>
              <option value="oil on canvas">Oil on canvas</option>
              <option value="oil on paper">Oil on paper</option>
              <option value="oil on muslin panel">Oil on muslin panel</option>
              <option value="oil on panel">Oil on panel</option>
              <option value="pencil">Pencil</option>
              <option value="charcoal">Charcoal</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Price</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control id="price" data-testid="price" aria-label="Amount (to the nearest dollar)" value={work.price || ''}
                onChange={handleFieldChange}/>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Sold" 
              checked={!!work.isSold}
              onChange={() => {
                setWork({...work, isSold: !work.isSold})
                // setSold(!isSold);
              }}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Typeahead id="tags" 
              className={styles.typeahead} 
              multiple placeholder="enter multiple tags"
              onChange={newTags => { 
                setWork({...work, tags: newTags})
              }}
              options={options}
              selected={work.tags || []}
              clearButton={true}
              allowNew={true}
              size={'small'}
              >
            </Typeahead>
            <Form.Text className="text-muted" >
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check id="example" aria-label="is example" type="checkbox" label="Category Example" 
              checked={example}
              onChange={() => {
                setExample(!example);
              }}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control id="categoryName" aria-label="category name" type="text" disabled={!example} value={work.categoryName || ''}
              onChange={handleFieldChange}/>
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
