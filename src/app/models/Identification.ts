import { IAddress } from "./address.interface"

export interface Identification {
  logo: Logo,
  phoneNumber: PhoneNumber[],
  social: SocialNetwork[],
  address: IAddress[]
}

export interface Logo {
  src: string,
  srcThumbnail: string,
}

export interface PhoneNumber {
  number: string,
  isMain: boolean
}

export interface SocialNetwork {
  name: string,
  url: string
}

