import { PrismaClient, type User, type VideoEngagement, type FollowEnagegment , type Annoucement } from "@prisma/client";
import fs from "fs";
import path from "path";
// Removed incorrect import of 'json'

// Define PlaylistHasVideo type or import it from your Prisma schema
type PlaylistHasVideo = {
    // Add the appropriate fields based on your schema
    playlistId: string;
    videoId: string;
    // Add other fields if needed
};



const prisma = new PrismaClient();
const userfile = path.join(__dirname, "users.json");
const users : User[] = JSON.parse(fs.readFileSync(userfile, "utf-8")) as User[];
const videosfile = path.join(__dirname, "videos.json");
const videos : Video[] = JSON.parse(fs.readFileSync(videosfile, "utf-8")) as Video[];
const videoEngagement = path.join(__dirname, "videoEngagement.json");
const videoEngagements : VideoEngagement[] = JSON.parse(fs.readFileSync(videoEngagement, "utf-8")) as VideoEngagement[];
const followEngagement = path.join(__dirname, "followEngagement.json");
const followEngagements : FollowEnagegment[] = JSON.parse(fs.readFileSync(followEngagement, "utf-8")) as FollowEnagegment[];
const annoucement = path.join(__dirname, "annoucement.json");
const annoucements : Annoucement[] = JSON.parse(fs.readFileSync(annoucement, "utf-8")) as Annoucement[];
// Define AnnoucementEngagement type or import it from your Prisma schema
type AnnoucementEngagement = {
    // Add the appropriate fields based on your schema
    id: string;
    annoucementId: string;
    userId: string;
    // Add other fields if needed
};

const annoucementEngagement = path.join(__dirname, "annoucementEngagement.json");
const annoucementEngagements : AnnoucementEngagement[] = JSON.parse(fs.readFileSync(annoucementEngagement, "utf-8")) as AnnoucementEngagement[];
const comment = path.join(__dirname, "comment.json");
const comments : Comment[] = JSON.parse(fs.readFileSync(comment, "utf-8")) as Comment[];
const playlist = path.join(__dirname, "playlist.json");
// Define Playlist type or import it from your Prisma schema
type Playlist = {
    id: string;
    name: string;
    userId: string;
    // Add other fields as needed based on your schema
};

const playlists : Playlist[] = JSON.parse(fs.readFileSync(playlist, "utf-8")) as Playlist[];
const playlistHasVideo = path.join(__dirname, "playlistHasVideo.json");
const playlistHasVideos : PlaylistHasVideo[] = JSON.parse(fs.readFileSync(playlistHasVideo, "utf-8")) as PlaylistHasVideo[];
// If you seed playlistHasViseo data later, use prisma.playlistHasViseo instead of prisma.playlistHasVideo


async function processInChunks<T, U>(
    items: T[],
    chunkSize: number,
    processChunk: (chunk: T[]) => Promise<U[]>
): Promise<U[]> {
    const results: U[] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkResults = await processChunk(chunk);
        results.push(...chunkResults);
    }
    return results;
}
const cloudinary = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

async function main() {}
await prisma.user.deleteMany();
await prisma.video.deleteMany();
await prisma.annoucement.deleteMany();
await prisma.comment.deleteMany();
await prisma.playlistHasVideo.deleteMany();
await prisma.videoEngagement.deleteMany();
await prisma.followEnagegment.deleteMany();
await prisma.annoucementEngagement.deleteMany();
// Seed Users
await processInChunks(users, 1, async (chunk) => {
    return Promise.all(
        chunk.map(user =>
            prisma.user.upsert({
                where: { id: user.id },
                update: {
                    ...user,
                    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                    image: user.image ? `https://res.cloudinary.com/${cloudinary}${user.image}` : null,
                    backgroundImage: user.backgroundImage ? `https://res.cloudinary.com/${cloudinary}${user.backgroundImage}` : null,
                },
                create: {
                    ...user,
                    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                    image: user.image ? `https://res.cloudinary.com/${cloudinary}${user.image}` : null,
                    backgroundImage: user.backgroundImage ? `https://res.cloudinary.com/${cloudinary}${user.backgroundImage}` : null,
                },
            })
        )
    );
});
// Assuming you have a 'videos' array loaded similar to 'users'
const videofile = path.join(__dirname, "videos.json");
// Define a Video type or import it from your Prisma schema if available
type Video = {
    id: string;
    createdAt?: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    userId: string;
    // add other fields as needed
};

await processInChunks(videos, 1, async (chunk: Video[]) => {
    return Promise.all(
        chunk.map((video: Video) =>
            prisma.video.upsert({
                where: { id: video.id },
                update: {
                    ...video,
                    createdAt: video.createdAt ? new Date(video.createdAt) : undefined,
                    thumbnailUrl: video.thumbnailUrl ? `https://res.cloudinary.com/${cloudinary}${video.thumbnailUrl}` : null,
                    videoUrl: video.videoUrl ? `https://res.cloudinary.com/${cloudinary}${video.videoUrl}` : undefined,
                },
                create: {
                    ...video,
                    createdAt: video.createdAt ? new Date(video.createdAt) : undefined,
                    thumbnailUrl: video.thumbnailUrl ? `https://res.cloudinary.com/${cloudinary}${video.thumbnailUrl}` : null,
                    videoUrl: video.videoUrl ? `https://res.cloudinary.com/${cloudinary}${video.videoUrl}` : "",
                },
            })
        )
    );
});
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        void prisma.$disconnect();
    });