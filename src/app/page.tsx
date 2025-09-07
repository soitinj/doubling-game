

export default function Home() {
  return (
    <iframe src={`${process.env.NEXT_PUBLIC_SERVER_URL}/widget`}></iframe>
  );
}
