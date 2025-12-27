import { IAddress } from "./address.interface"

export interface Identification {
  logo: ILogo,
  phoneNumber: IPhoneNumber[],
  social: ISocialNetwork[],
  address: IAddress[]
}

export interface ILogo {
  src: string,
  srcThumbnail: string,
}

export interface IPhoneNumber {
  number: string,
  isMain: boolean
}

export interface ISocialNetwork {
  name: string,
  url: string
}

