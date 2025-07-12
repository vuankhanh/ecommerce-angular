import { TMenu } from "../../models/menu.interface";

export const Menu: TMenu[] = [
  {
    name: 'Sản phẩm',
    icon: {
      fontSet: 'fa-brands',
      fontIcon: 'fa-product-hunt'
    },
    route: 'san-pham'
  },
  {
    name: 'Giỏ hàng',
    icon: {
      fontSet: 'fa-solid',
      fontIcon: 'fa-cart-shopping'
    },
    route: 'gio-hang'
  }
];

export const CustomerMenu: TMenu[] = [
  {
    name: 'Thông tin cá nhân',
    icon: {
      fontSet: 'fa-solid',
      fontIcon: 'fa-user'
    },
    route: 'personal'
  },
  {
    name: 'Lịch sử mua hàng',
    icon: {
      fontSet: 'fa-solid',
      fontIcon: 'fa-history'
    },
    route: 'order-history'
  },
  {
    name: 'Sổ địa chỉ',
    icon: {
      fontSet: 'fa-solid',
      fontIcon: 'fa-map-marker-alt'
    },
    route: 'address-book'
  }
]