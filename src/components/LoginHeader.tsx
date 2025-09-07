import { useState } from 'react'
import { Button } from 'react-bootstrap'
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useUserStore } from '@/stores/userStore';


const LoginHeader = () => {
  const [loginShow, setLoginShow] = useState(false);
  const [registerShow, setRegisterShow] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <div className='m-4' style={{ display: 'flex', alignItems: 'left' }}>
      {user && (
        <div>
          <div>{user.username} logged in.</div>
          <div>Balance: {user.balance} 🪙 coins.</div>
        </div>
      )}
      {!user &&
        <>
          <div>Not logged in.</div>
          <Button className='mb-1' variant='primary' onClick={() => setLoginShow(true)}>Login here</Button>
          <Button className='mb-1' variant='primary' onClick={() => setRegisterShow(true)}>Register here</Button>
          <LoginModal show={loginShow} setShow={setLoginShow}></LoginModal>
          <RegisterModal show={registerShow} setShow={setRegisterShow}></RegisterModal>
        </>
      }
    </div>
  )
}

export default LoginHeader