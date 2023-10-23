import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>DinoHerd | Home</title>
        <meta name="description" content="Claynosaurz Collectors Gallery" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="relative flex min-h-screen flex-col items-center justify-center bg-cover"
        style={{
          // backgroundImage: `url('/images/CLAYNO_FJORD.png')`,
          backgroundImage: `url('/images/3d_herd.jpeg')`,
        }}
      ></main>
    </>
  );
}
