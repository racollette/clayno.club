import Head from "next/head";

const MetaTags = ({
  title = "DinoHerd",
  description = "Claynosaurz Collectors Gallery",
  ogTitle = "Default OG Title",
  ogDescription = "Default OG Description",
  ogImage = "/default-image.jpg",
  ogUrl = "https://example.com",
  twitterCard = "summary",
  twitterImage = "/default-twitter-image.jpg",
}) => {
  return (
    <Head>
      {/* Page title */}
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Description */}
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />

      <meta name="twitter:image" content={twitterImage} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default MetaTags;
