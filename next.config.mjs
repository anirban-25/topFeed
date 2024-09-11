/** @type {import('next').NextConfig} */
const nextConfig = {
    target: 'server',
    images: {
        domains : ["lh3.googleusercontent.com", "firebasestorage.googleapis.com", "unavatar.io", "x.com", "twitter.com"]
    }
};

export default nextConfig;
