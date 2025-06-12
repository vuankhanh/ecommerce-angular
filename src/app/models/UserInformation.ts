export interface JwtDecoded{
    data: UserInformation,
    exp: number,
    iat: number
}

export interface UserInformation {
    userName?: string,
    name: string,
    email: string,
    phoneNumber: string,
    customerCode: string,
    createdAt: string,
    updatedAt: string
}
