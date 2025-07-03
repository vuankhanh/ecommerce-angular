import { ISuccess } from "./success.interface"


export type TToken = IAccessToken & IRefreshToken

export interface IAccessToken {
  accessToken: string
}

export interface IRefreshToken {
  refreshToken: string
}

export interface ITokenResponse extends ISuccess {
  metaData: TToken
}

export interface IRefreshTokenResponse extends ISuccess {
  metaData: IAccessToken
}