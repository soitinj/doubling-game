import { Modal, Button } from 'react-bootstrap'

const RegisterModal = ({ show, setShow }: { show: boolean, setShow: (value: boolean) => void }) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Register modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RegisterModal;