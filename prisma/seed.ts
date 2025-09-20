/* eslint-disable */
import { PrismaClient } from "@prisma/client"
import type {
  User,
  Video,
  VideoEngagement,
  FollowEnagegment,
  Annoucement,
  AnnoucementEngagement,
  Comment,
  Playlist,
  PlaylistHasVideo,
} from "@prisma/client"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient({
  // با TiDB و limit پایین، بهتره زمان انتظار کمی بیشتر باشه
  datasources: { db: { url: process.env.DATABASE_URL } },
})

/** ---------- helpers ---------- */
const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME ?? ""
const cdn = (u?: string | null): string | null => {
  if (!u) return null
  if (!cloudinaryName) return u
  return `https://res.cloudinary.com/${cloudinaryName}${u}`
}

const asDate = (val: unknown): Date | undefined => {
  if (!val) return undefined
  const d = new Date(val as string)
  return isNaN(d.getTime()) ? undefined : d
}

/** اجرای ترتیبی روی کل آیتم‌ها (برای جلوگیری از اشباع کانکشن) */
async function forEachSequential<T>(
  items: T[],
  fn: (item: T, index: number) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    // با ! به TS می‌گیم این مقدار قطعا وجود داره
    await fn(items[i]!, i)
  }
}

/** --- load JSONs --- */
const dataDir = path.join(__dirname, "data")
const load = <T>(file: string): T =>
  JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8")) as T

const users = load<User[]>("user.json")
const videos = load<Video[]>("video.json")
const videoEngagements = load<VideoEngagement[]>("videoEngagement.json")
const followEngagements = load<FollowEnagegment[]>("followEngagement.json")
const announcements = load<Annoucement[]>("announcement.json")
const announcementEngagements = load<AnnoucementEngagement[]>("announcementEngagement.json")
const comments = load<Comment[]>("comment.json")
const playlists = load<Playlist[]>("playlist.json")
const playlistHasVideos = load<PlaylistHasVideo[]>("playlistHasVideo.json")

async function main() {
  /** ---------- clean tables (children -> parents) ---------- */
  await prisma.videoEngagement.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.followEnagegment.deleteMany()
  await prisma.annoucementEngagement.deleteMany()
  await prisma.playlistHasVideo.deleteMany()

  await prisma.playlist.deleteMany()
  await prisma.video.deleteMany()
  await prisma.annoucement.deleteMany()
  await prisma.post.deleteMany()

  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  /** ---------- seed users (sequential) ---------- */
  await forEachSequential(users, async (u) => {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name ?? undefined,
        email: u.email ?? undefined,
        emailVerified: asDate(u.emailVerified),
        image: cdn(u.image ?? null) ?? undefined,
        backgroundImage: cdn(u.backgroundImage ?? null) ?? undefined,
        handle: u.handle ?? undefined,
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: asDate(u.emailVerified),
        image: cdn(u.image ?? null),
        backgroundImage: cdn(u.backgroundImage ?? null),
        handle: u.handle,
      },
    })
  })

  /** ---------- seed videos (sequential) ---------- */
  await forEachSequential(videos, async (v) => {
    const url = cdn(v.videoUrl ?? null)
    if (!url) throw new Error(`Video ${v.id} has no videoUrl`)
    await prisma.video.upsert({
      where: { id: v.id },
      update: {
        title: v.title ?? undefined,
        thumbnailUrl: cdn(v.thumbnailUrl ?? null) ?? undefined,
        description: v.description ?? undefined,
        videoUrl: url,
        publish: v.publish,
        userId: v.userId,
        createdAt: asDate(v.createdAt),
      },
      create: {
        ...v,
        videoUrl: url,
        thumbnailUrl: cdn(v.thumbnailUrl ?? null),
        createdAt: asDate(v.createdAt),
      },
    })
  })

  /** ---------- announcements (sequential) ---------- */
  await forEachSequential(announcements, async (a) => {
    await prisma.annoucement.upsert({
      where: { id: a.id },
      update: {
        message: a.message,
        userId: a.userId,
        createdAt: asDate(a.createdAt),
      },
      create: {
        ...a,
        createdAt: asDate(a.createdAt),
      },
    })
  })

  /** ---------- comments (sequential) ---------- */
  await forEachSequential(comments, async (c) => {
    await prisma.comment.upsert({
      where: { id: c.id },
      update: {
        message: c.message,
        videoId: c.videoId,
        userId: c.userId,
        createdAt: asDate(c.createdAt),
      },
      create: {
        ...c,
        createdAt: asDate(c.createdAt),
      },
    })
  })

  /** ---------- playlists (sequential) ---------- */
  await forEachSequential(playlists, async (pl) => {
    await prisma.playlist.upsert({
      where: { id: pl.id },
      update: {
        title: pl.title,
        description: pl.description ?? undefined,
        userId: pl.userId,
        createdAt: asDate(pl.createdAt),
      },
      create: {
        ...pl,
        createdAt: asDate(pl.createdAt),
      },
    })
  })

  /** ---------- relations (mapped & safe) ---------- */

  // VideoEngagement: این مدل فیلد engagementType دارد
  if (videoEngagements.length) {
    await prisma.videoEngagement.createMany({
      data: videoEngagements.map((ve) => ({
        videoId: String((ve as any).videoId),
        userId: String((ve as any).userId),
        engagementType: (ve as any).engagementType,
        createdAt: (ve as any).createdAt ? new Date((ve as any).createdAt) : undefined,
      })),
      skipDuplicates: true,
    })
  }

  // FollowEnagegment: این مدل فیلد engagementType ندارد → حذفش می‌کنیم
  if (followEngagements.length) {
    await prisma.followEnagegment.createMany({
      data: followEngagements.map((fe) => ({
        followerId: String((fe as any).followerId),
        followingId: String((fe as any).followingId),
        createdAt: (fe as any).createdAt ? new Date((fe as any).createdAt) : undefined,
      })),
      skipDuplicates: true,
    })
  }

  // AnnoucementEngagement: اختلاف اسم کلید را هندل می‌کنیم
  if (announcementEngagements.length) {
    const rows = announcementEngagements
      .map((e) => {
        const annId = (e as any).annoucementId ?? (e as any).announcementId
        if (!annId) return null
        return {
          userId: String((e as any).userId),
          annoucementId: String(annId),
          engagementType: (e as any).engagementType,
          createdAt: (e as any).createdAt ? new Date((e as any).createdAt) : undefined,
        }
      })
      .filter(Boolean) as Array<{
        userId: string
        annoucementId: string
        engagementType: any
        createdAt?: Date
      }>

    if (rows.length) {
      await prisma.annoucementEngagement.createMany({
        data: rows,
        skipDuplicates: true,
      })
    }
  }

  // PlaylistHasVideo
  if (playlistHasVideos.length) {
    await prisma.playlistHasVideo.createMany({
      data: playlistHasVideos.map((x) => ({
        playlistId: String((x as any).playlistId),
        videoId: String((x as any).videoId),
        createdAt: (x as any).createdAt ? new Date((x as any).createdAt) : undefined,
      })),
      skipDuplicates: true,
    })
  }

  console.log("✅ Seeding finished.")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
































// import {
//   PrismaClient,
//   type User,
//   type Video,
//   type VideoEngagement,
//   type FollowEnagegment,
//   type Annoucement,
//   type AnnoucementEngagement,
//   type Comment,
//   type Playlist,
//   type PlaylistHasVideo,
// } from "@prisma/client";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const prisma = new PrismaClient();

// // ---------- helpers ----------
// const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME ?? "";
// const cdn = (u?: string | null) => {
//   console.log("cdn", { u, cloudinaryName });
//   if (!u) return null;
//   if (!cloudinaryName) return u;
//   const result = `https://res.cloudinary.com/${cloudinaryName}${u}`;
//   console.log("cdn result", result);
//   return result;
// };

// async function processInChunks<T, U = unknown>(
//   items: T[],
//   chunkSize: number,
//   processItem: (item: T) => Promise<U>
// ): Promise<U[]> {
//   const results: U[] = [];
//   for (let i = 0; i < items.length; i += chunkSize) {
//     const chunk = items.slice(i, i + chunkSize);
//     const chunkResults = await Promise.all(chunk.map(processItem));
//     results.push(...chunkResults);
//   }
//   return results;
// }

// // --- load JSONs (از مسیر prisma/data/*) ---
// const dataDir = path.join(__dirname, "data");
// const load = <T>(file: string) =>
//   JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8")) as T;

// const users = load<User[]>("user.json");
// const videos = load<Video[]>("video.json");
// const videoEngagements = load<VideoEngagement[]>("videoEngagement.json");
// const followEngagements = load<FollowEnagegment[]>("followEngagement.json");
// const announcements = load<Annoucement[]>("announcement.json");
// const announcementEngagements = load<AnnoucementEngagement[]>(
//   "announcementEngagement.json"
// );
// const comments = load<Comment[]>("comment.json");
// const playlists = load<Playlist[]>("playlist.json");
// const playlistHasVideos = load<PlaylistHasVideo[]>("playlistHasVideo.json");

// async function main() {
//   // ---------- clean tables (children -> parents) ----------
//   // join/children
//   await prisma.videoEngagement.deleteMany();
//   await prisma.comment.deleteMany();
//   await prisma.followEnagegment.deleteMany();
//   await prisma.annoucementEngagement.deleteMany();

//   // mid-level
//   await prisma.playlist.deleteMany();
//   await prisma.video.deleteMany();
//   await prisma.annoucement.deleteMany();
//   await prisma.post.deleteMany(); // Post وابسته به User و cascade ندارد

//   // auth & root
//   await prisma.session.deleteMany();
//   await prisma.account.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.verificationToken.deleteMany();

//   // ---------- seed users ----------
//   await processInChunks(users, 200, (u) =>
//   prisma.user.upsert({
//     where: { id: u.id },
//     update: {
//       name: u.name ?? undefined,
//       email: u.email ?? undefined,
//       emailVerified: u.emailVerified ? new Date(u.emailVerified) : undefined,
//       image: cdn(u.image ?? null) ?? undefined,
//       backgroundImage: cdn(u.backgroundImage ?? null) ?? undefined,
//       handle: u.handle ?? undefined,
//     },
//     create: {
//       id: u.id,
//       name: u.name,
//       email: u.email,
//       emailVerified: u.emailVerified ? new Date(u.emailVerified) : undefined,
//       image: cdn(u.image ?? null),
//       backgroundImage: cdn(u.backgroundImage ?? null),
//       handle: u.handle,
//       // اگر فیلدی مثل bio داری، اینجا مقدار بده؛ ولی description را حذف کن
//     },
//   })
// );

//   // ---------- seed videos ----------
//   await processInChunks(videos, 200, (video) => {
//     const safeVideoUrl = cdn(video.videoUrl ?? null);
//     if (!safeVideoUrl) {
//       throw new Error(`Video ${video.id} has no videoUrl`);
//     }
//     return prisma.video.upsert({
//       where: { id: video.id },
//       update: {
//         title: video.title ?? undefined,
//         thumbnailUrl: cdn(video.thumbnailUrl ?? null) ?? undefined,
//         description: video.description ?? undefined,
//         videoUrl: safeVideoUrl,
//         publish: video.publish,
//         userId: video.userId,
//         createdAt: video.createdAt ? new Date(video.createdAt) : undefined,
//       },
//       create: {
//         ...video,
//         thumbnailUrl: cdn(video.thumbnailUrl ?? null),
//         videoUrl: safeVideoUrl,
//         createdAt: video.createdAt ? new Date(video.createdAt) : undefined,
//       },
//     });
//   });

//   // ---------- seed announcements (Annoucement) ----------
//   await processInChunks(announcements, 200, (a) =>
//     prisma.annoucement.upsert({
//       where: { id: a.id },
//       update: {
//         message: a.message,
//         userId: a.userId,
//         createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
//       },
//       create: {
//         ...a,
//         createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
//       },
//     })
//   );

//   // ---------- seed comments ----------
//   await processInChunks(comments, 500, (cmt) => {
//     const { id, updatedAt, ...rest } = cmt;
//     return prisma.comment.upsert({
//       where: { id },
//       update: {
//         ...rest,
//         createdAt: cmt.createdAt ? new Date(cmt.createdAt) : undefined,
//       },
//       create: {
//         ...rest,
//         id,
//         createdAt: cmt.createdAt ? new Date(cmt.createdAt) : undefined,
//       },
//     });
//   });

//   // ---------- seed playlists ----------
//   await processInChunks(playlists, 200, (pl) => {
//     const { id, updatedAt, ...rest } = pl;
//     return prisma.playlist.upsert({
//       where: { id },
//       update: {
//         ...rest,
//         createdAt: pl.createdAt ? new Date(pl.createdAt) : undefined,
//       },
//       create: {
//         ...rest,
//         id,
//         createdAt: pl.createdAt ? new Date(pl.createdAt) : undefined,
//       },
//     });
//   });

//   // ---------- seed relations/engagements (با skipDuplicates) ----------
//   if (videoEngagements.length) {
//     await prisma.videoEngagement.createMany({
//       data: videoEngagements.map((ve) => ({
//         ...ve,
//         // اگر تاریخ‌ها string هستند، می‌تونی تبدیل‌شون کنی:
//         // createdAt: ve.createdAt ? new Date(ve.createdAt) as any : undefined,
//       })),
//       skipDuplicates: true, // به‌خاطر @@unique(videoId,userId)
//     });
//   }

//   if (followEngagements.length) {
//     await prisma.followEnagegment.createMany({
//       data: followEngagements,
//       skipDuplicates: true, // به‌خاطر @@id(followerId,followingId)
//     });
//   }

//   if (announcementEngagements.length) {
//     await prisma.annoucementEngagement.createMany({
//       data: announcementEngagements,
//       skipDuplicates: true, // به‌خاطر @@id(annoucementId,userId)
//     });
//   }

//   if (playlistHasVideos.length) {
//     await prisma.playlistHasVideo.createMany({
//       data: playlistHasVideos,
//       skipDuplicates: true,
//     });
//   }

//   console.log("✅ Seeding finished.");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seeding failed:", e);
//     process.exit(1);
//   })
//   .finally( () => {
//     void prisma.$disconnect();
//   });