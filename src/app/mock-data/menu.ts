import { ProductCategory } from '../models/ProductCategory';

export const MenusList: Array<Menu> =
[
    {
        icon: 'home',
        title: 'Trang chủ',
        route: '',
        child: []
    },{
        icon: 'store',
        title: 'Sản phẩm',
        route: 'san-pham',
        child: []
    },{
        icon: 'shopping_cart',
        title: 'Giỏ hàng',
        route: 'cart',
        child: []
    }
];

export const CustomerMenu: Array<Menu> = [
    {
        icon: 'personal',
        title: 'Thông tin cá nhân',
        route: 'personal',
        child:[]
    },{
        icon: 'shopping_cart',
        title: 'Lịch sử mua hàng',
        route: 'order-history',
        child:[]
    },{
        icon: 'place',
        title: 'Sổ địa chỉ',
        route: 'address-book',
        child:[]
    },
]

export interface Menu{
    icon?: string;
    svgIcon?: string,
    title: string,
    route: string,
    child: Array<ProductCategory>
}