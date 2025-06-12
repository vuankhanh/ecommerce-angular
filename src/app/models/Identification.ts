import { Address } from './Address';

export interface Identification{
    logo: Logo,
    phoneNumber: Array<PhoneNumber>,
    social: Array<SocialNetwork>,
    address: Array<Address>
}

export interface Logo{
    src: string,
    srcThumbnail: string,
}

export interface PhoneNumber{
    number: string,
    isMain: boolean
}

export interface SocialNetwork{
    name: string,
    url: string
}

