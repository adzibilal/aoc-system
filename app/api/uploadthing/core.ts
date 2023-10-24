
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
    produkImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .onUploadComplete(() => {}),
    // courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    //     .middleware(() => handleAuth())
    //     .onUploadComplete(() => {}),
    // courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    //     .middleware(() => handleAuth())
    //     .onUploadComplete(() => {}),
    // chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: '512GB' } })
    //     .middleware(() => handleAuth())
    //     .onUploadComplete(() => {})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
