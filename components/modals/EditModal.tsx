import "bootstrap/dist/css/bootstrap.css";
import styles from './EditModal.module.css';
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useRecoilValue } from "recoil";
import { configState } from "@state/config";
import { tagsState } from "@state/tags";
import { IArtwork } from "@models/artwork";
import { IConfig } from "@models/config";

interface EditModalProps {
  artwork: IArtwork,
  show: boolean,                                     
  handleClose: () => void,
  handleSave: (w: IArtwork) => void,
  children?: any
}

const formDataFromArtwork = (artwork: IArtwork) => {
  return {...artwork, 
    year: artwork.year ? artwork.year.toString() : '',
    width: artwork.width ? artwork.width.toString() : '',
    height: artwork.height ? artwork.height.toString() : '',
    price: artwork.price ? artwork.price.toString() : '',
    media: artwork.media || ''
   }
}

export default function EditModal({ artwork, show, handleClose, handleSave }: EditModalProps) {

  const config = useRecoilValue<IConfig>(configState);
  const allTags = useRecoilValue<Set<string>>(tagsState);
  const [fileNum, setFileNum] = useState('')
  const [formData, setFormData] = useState(formDataFromArtwork(artwork));
  const [example, setExample] = useState(false);
  const [errors, setErrors] = useState<any>({})

  let options = Array.from(allTags);
  const imagePathPrefix = config.filename;

  // When a button is clicked in the parent component, it changes the
  // artwork prop.  This reacts to that and then sets the state
  // to the new values.
  useEffect(() => {
    setFileNum(extractFileNumberFromImagePath(artwork.imagePath) || '');
    setExample(artwork?.tags?.includes('exemplar'));
    setFormData(formDataFromArtwork(artwork));
    setErrors({})
  }, [artwork])

  useEffect(() => {
    options = Array.from(allTags);
  }, [allTags])


  // image filenames are standardized to be like david_marshall_42.jpg
  // imagePath could just be a filename but could be /path/to/david_marshall_42.jpg.  Returns 42
  const extractFileNumberFromImagePath = (imagePath) => {
    if (imagePath) {
      const ix = imagePath.lastIndexOf('/');
      let fileNumAndExt = imagePath.slice(ix+1).split('_')[2];
      return fileNumAndExt.split('.')[0]
    }
    return '';
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title || formData.title.trim() === '') {
      newErrors['title'] = "title is required";
    }
    if (example && (!formData.categoryName || formData.categoryName.trim() === '')) {
      newErrors['categoryName'] = 'Must provide category name if the artwork is an example'
    }
    else if (!example && !!formData.categoryName && formData.categoryName.trim() !== '' ) {
      newErrors['categoryName'] = 'Category name cannot be present when not an example'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return {isValid: false}
    }
    setErrors({})
    return {isValid: true, artwork: artworkFromForm()}
  }

  const artworkFromForm = (): IArtwork => {
    const editedArtwork = {...formData, 
      tags: transformTypeaheadTags(formData.tags, example), 
      imagePath: fileNum ? (imagePathPrefix + fileNum + '.jpg') : '', 
      price: formData.price ? parseFloat(formData.price) : undefined,
      width: formData.width ? parseInt(formData.width) : undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      year: formData.year ? parseInt(formData.year) : undefined,
    }
    return editedArtwork;
  }



  // tags that are newly created (i.e. not chosen from existing list) are wrapped as objects and must be 
  // turned into plain strings in the array of tag strings.
  const transformTypeaheadTags = (tags, isExample=false): string[] => {
    const res = tags.map(t => {
      if (typeof(t) == "string")
        return t;
      else if (typeof(t) == 'object')
        return t.label;
    });
    // add/remove the tag "exemplar" if the artwork is marked as an example.
    if (isExample && !res.includes('exemplar'))
      res.push('exemplar')
    else if (!isExample && res.includes('exemplar')) 
      res.splice(res.indexOf('exemplar'), 1)
    return res;
  }

  const handleFieldChange = (e) => {
    // clever way to set any field where field name is [e.target.id]
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const validation = validateForm();
    if (validation.isValid)
      handleSave(validation.artwork)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              id="title"
              data-testid="title"
              type="text"
              placeholder="Enter title"
              value={formData.title || ""}
              isInvalid={!!errors.title}
              onChange={handleFieldChange}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Form.Control.Feedback type='invalid'>
              { errors.title }
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dimensions</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="width"
                type="text"
                aria-label="width"
                placeholder="width"
                value={formData.width}
                onChange={handleFieldChange}
              />
              <InputGroup.Text>X</InputGroup.Text>
              <Form.Control
                id="height"
                type="text"
                aria-label="height"
                placeholder="height"
                value={formData.height}
                onChange={handleFieldChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control
              id="year"
              data-testid="year"
              type="text"
              value={formData.year}
              onChange={handleFieldChange}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Filename</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>{imagePathPrefix}</InputGroup.Text>
              <Form.Control
                aria-label="filenum"
                type="text"
                value={fileNum}
                onChange={(e) => setFileNum(e.target.value)}
              />
              <InputGroup.Text>.jpg</InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Media</Form.Label>
            <Form.Select
              id="media"
              aria-label="media"
              value={formData.media}
              onChange={handleFieldChange}
            >
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
            <Form.Label for="price">Price</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                id="price"
                data-testid="price"
                aria-label="Amount (to the nearest dollar)"
                value={formData.price}
                onChange={handleFieldChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Sold"
              checked={!!formData.isSold}
              onChange={() => {
                setFormData({ ...formData, isSold: !formData.isSold });
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Typeahead
              id="tags"
              data-testid="tags"
              className={styles.typeahead}
              multiple
              placeholder="enter multiple tags"
              onChange={(newTags: string[]) => {
                setFormData({ ...formData, tags: newTags });
              }}
              options={options}
              selected={formData.tags || []}
              clearButton={true}
              allowNew={true}
              size={"small"}
            ></Typeahead>
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              id="example"
              data-testid="example"
              aria-label="is example"
              type="checkbox"
              label="Category Example"
              checked={example}
              onChange={() => {
                setExample(!example);
              }}
            />
            <Form.Check
              id="active"
              data-testid="active"
              aria-label="is active"
              type="checkbox"
              label="Active"
              checked={formData.isActive}
              onChange={() => {setFormData({...formData, isActive: !formData.isActive})}}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              id="categoryName"
              aria-label="category name"
              type="text"
              disabled={!example}
              value={formData.categoryName || ""}
              isInvalid={!!errors.categoryName}
              onChange={handleFieldChange}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Form.Control.Feedback type='invalid'>
              { errors.categoryName }
            </Form.Control.Feedback>
          </Form.Group>

          <div>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button data-testid="submit" type="submit">Save Changes</Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
