import { Posts } from "./Posts"

export interface Support{
    _id: string,
    name: string,
    route: string
}

export interface SupportDetail extends Support{
    postsId: Posts
}