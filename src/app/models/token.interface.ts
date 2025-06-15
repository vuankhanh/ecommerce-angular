import { Success } from "./success.interface"


export type TToken = IAccessToken & IRefreshToken

export interface IAccessToken {
  accessToken: string
}

export interface IRefreshToken {
  refreshToken: string
}

export interface ITokenResponse extends Success {
  metaData: TToken
}

export interface IRefreshTokenResponse extends Success {
  metaData: IAccessToken
}