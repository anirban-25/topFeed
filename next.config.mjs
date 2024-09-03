/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains : ["lh3.googleusercontent.com", "firebasestorage.googleapis.com", "unavatar.io", "x.com", "twitter.com"]
    },
    api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
    responseLimit: false,
    externalResolver: true,
  },
};

export default nextConfig;
