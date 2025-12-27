import { Identification } from "../../models/Identification";

export const IDENTIFICATION: Identification = {
  logo: {
    src: '/assets/avatar/logo-full.png',
    srcThumbnail: '/assets/avatar/logo-thumb.png',
  },
  phoneNumber: [
    { number: '0834 517 989 ', isMain: true },
    { number: '0974 017 030', isMain: false }
  ],
  social: [
    { name: 'facebook', url: 'https://facebook.com/bep.4.than' },
  ],
  address: [
    {
      street: 'Số 96 ngõ 14 Mễ Trì Hà, phường Mễ Trì, quận Nam Từ Liêm, TP Hà Nội',
      ward: {
        "_id": "68af14ef6e44fa3a8b62f71c",
        "name": "Mỹ Đình 1",
        "type": "phuong",
        "slug": "my-dinh-1",
        "name_with_type": "Phường Mỹ Đình 1",
        "path": "Mỹ Đình 1, Nam Từ Liêm, Hà Nội",
        "path_with_type": "Phường Mỹ Đình 1, Quận Nam Từ Liêm, Thành phố Hà Nội",
        "code": "00625",
        "parent_code": "019",
        "isDeleted": false
      },
      district: {
        "_id": "68af14ef6e44fa3a8b62f39e",
        "name": "Nam Từ Liêm",
        "type": "quan",
        "slug": "nam-tu-liem",
        "name_with_type": "Quận Nam Từ Liêm",
        "path": "Nam Từ Liêm, Hà Nội",
        "path_with_type": "Quận Nam Từ Liêm, Thành phố Hà Nội",
        "code": "019",
        "parent_code": "01",
        "isDeleted": false
      },
      province: {
        "_id": "68af14ef6e44fa3a8b62f353",
        "name": "Hà Nội",
        "slug": "ha-noi",
        "type": "thanh-pho",
        "name_with_type": "Thành phố Hà Nội",
        "code": "01",
        "isDeleted": false
      },
    }
  ]
};