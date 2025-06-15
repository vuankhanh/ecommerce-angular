export interface JwtDecoded {
  email: string,
  name: string,
  avatar: string,
  exp: number,
  iat: number
}

export interface UserInformation {
  email: string,
  name: string,
  avatar: string,
  phoneNumber: string,
  customerCode: string,
  createdAt: string,
  updatedAt: string
}
