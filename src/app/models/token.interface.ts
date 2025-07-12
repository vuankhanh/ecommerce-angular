import { ISuccess } from "./success.interface"

export interface IJwtDecoded {
  email: string,
  name: string,
  avatar: string,
  exp: number,
  iat: number
}

export type TToken = IAccessToken & IRefreshToken

export interface IAccessToken {
  accessToken: string
}

export interface IRefreshToken {
  refreshToken: string
}