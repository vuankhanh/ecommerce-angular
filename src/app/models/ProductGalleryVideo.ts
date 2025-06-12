export interface ProductGalleryVideo{
    _id: string,
    name: string,
    route: string,
    thumbnail: string,
    media: Array<Media>,
    createdAt: string,
    updatedAt: string,
}

export interface Media{
    _id: string,
    type: string | 'youtube-video',
    youtubeId: string,
    isMain: boolean,
    createdAt?: string,
    updatedAt?: string,
}