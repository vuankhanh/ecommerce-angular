
export interface ProductGallery{
    _id?: string,
    name: string,
    route: string,
    thumbnail: string,
    media: Array<Media>,
    createdAt: string,
    updatedAt: string,
}

export interface Media{
    _id: string,
    type: 'img' | 'video',
    src: string,
    srcThumbnail: string | null,
    isMain: boolean,
    createdAt?: string,
    updatedAt?: string,
}