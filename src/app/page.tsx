'use client'

export default function Home() {
  // Ideally, communication between client and 
  // This however needs to be carefully specified first
  /*
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const user = useUserStore((state) => state.user);

  const messageStartClient = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'auth', user: user}, `${process.env.NEXT_PUBLIC_API_URL}`);
  }
  */

  return (
    <>
      {/*user && <Button onClick={messageStartClient}>Start Game</Button>*/}
      <iframe className='m-4' width={400} height={600} src={`${process.env.NEXT_PUBLIC_API_URL}/client`}></iframe>
    </>
  );
}
