export interface Address{
    _id?: string,
    responsiblePerson: string,
    phoneNumber: string,
    street: string,
    ward: Ward,
    district: District,
    province: Province,
    position: Position | null,
    isHeadquarters: boolean,
}

export interface Position{
    lat: number,
    lng: number
}

export interface Province{
    _id: string,
    name: string,
    code: string,
}

export interface District{
    _id: string,
    provinceCode: string
    name: string,
    code: string,
}

export interface Ward{
    _id: string,
    districtCode: string
    name: string,
    code: string,
    type: string
}