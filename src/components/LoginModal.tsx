import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import userActions from '@/stores/userStore'

const LoginModal = ({ show, setShow }: { show: boolean, setShow: (value: boolean) => void }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const postLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await userActions.login(username, password);
    setShow(false);
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Login to your account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={postLogin}>
          <Form.Group className='mt-2 mb-2' controlId='loginForm.username'>
            <Form.Control
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mt-2 mb-2' controlId='loginForm.password'>
            <Form.Control
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button type='submit'>login</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LoginModal;