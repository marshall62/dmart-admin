import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
export default function ImageModal({ url, show, handleClose }) {
  const [myurl, setMyURL] = useState(url);

  useEffect(() => {
    setMyURL(url);
  }, [url]);
  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <img src={myurl}></img>
      </Modal.Body>
    </Modal>
  );
}
