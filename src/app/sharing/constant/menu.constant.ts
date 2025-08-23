import { TMenu } from "../../models/menu.interface";

export function getMenu(): TMenu[] {
  return [
    {
      name: $localize`:@@menu.product:Sản phẩm`,
      icon: {
        fontSet: 'fa-brands',
        fontIcon: 'fa-product-hunt'
      },
      route: 'san-pham'
    },
    {
      name: $localize`:@@menu.cart:Giỏ hàng`,
      icon: {
        fontSet: 'fa-solid',
        fontIcon: 'fa-cart-shopping'
      },
      route: 'gio-hang'
    }
  ];
}

export function getCustomerMenu(): TMenu[] {
  return [
    {
      name: $localize`:@@menu.personal:Thông tin cá nhân`,
      icon: {
        fontSet: 'fa-solid',
        fontIcon: 'fa-user'
      },
      route: 'personal'
    },
    {
      name: $localize`:@@menu.orderHistory:Lịch sử mua hàng`,
      icon: {
        fontSet: 'fa-solid',
        fontIcon: 'fa-history'
      },
      route: 'order-history'
    },
    {
      name: $localize`:@@menu.addressBook:Sổ địa chỉ`,
      icon: {
        fontSet: 'fa-solid',
        fontIcon: 'fa-map-marker-alt'
      },
      route: 'address-book'
    }
  ];
}