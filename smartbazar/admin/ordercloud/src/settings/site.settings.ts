import { adminAndOwnerOnly, adminOwnerAndStaffOnly } from '@utils/auth-utils';
import { ROUTES } from '@utils/routes';

export const siteSettings = {
  name: 'SmartBazaar',
  description: '',
  logo: {
    url: '/logo.svg',
    alt: 'SmartBazaar',
    href: '/',
    width: 128,
    height: 40,
  },
  defaultLanguage: 'en',
  author: {
    name: 'John Doe',
    websiteUrl: 'https://website.com',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: ROUTES.PROFILE_UPDATE,
      labelTransKey: 'authorized-nav-item-profile',
    },
    {
      href: ROUTES.LOGOUT,
      labelTransKey: 'authorized-nav-item-logout',
    },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: [
      {
        href: ROUTES.PRODUCTS,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      {
        href: ROUTES.CATEGORIES,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: ROUTES.ORDERS,
        label: 'sidebar-nav-item-orders',
        icon: 'OrdersIcon',
      },
      {
        href: ROUTES.USER_ORDERS,
        label: 'sidebar-nav-item-user-orders',
        icon: 'OrdersIcon',
        // badge: 'Soon',
      },
      {
        href: ROUTES.CART,
        // label: 'sidebar-nav-item-cart',
        label: 'Cart',
        icon: 'ShippingsIcon',
      },
      {
        href: ROUTES.GROUPS,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: ROUTES.ATTRIBUTES,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: ROUTES.CUSTOMERS,
        label: 'sidebar-nav-item-customers',
        icon: 'ShopIcon',
      },
      {
        href: ROUTES.USERGROUPS,
        label: "User Group",
        icon: "ShopIcon",
      },
      {
        href: ROUTES.USERS,
        label: 'sidebar-nav-item-admin-users',
        icon: 'UsersIcon',
      },
      {
        href: ROUTES.PROMOTIONS,
        label: 'sidebar-nav-item-promotions',
        icon: 'CouponsIcon',
        badge: 'Soon',
      },
      {
        href: ROUTES.PRICE_SCHEDULES,
        label: 'sidebar-nav-item-price-schedules',
        icon: 'TaxesIcon',
        // badge: 'Soon',
      },
      {
        href: ROUTES.MANUFACTURERS,
        label: 'sidebar-nav-item-manufacturers',
        icon: 'DiaryIcon',
        badge: 'Soon',
      },
      {
        href: ROUTES.SHIPPINGS,
        label: 'sidebar-nav-item-shippings',
        icon: 'ShippingsIcon',
        badge: 'Soon',
      },
      {
        href: ROUTES.DASHBOARD,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        badge: 'Soon',
      },
      // {
      //   href: ROUTES.SHOPS,
      //   label: "sidebar-nav-item-shops",
      //   icon: "ShopIcon",
      // },
      // {
      //   href: ROUTES.ADMIN_MY_SHOPS,
      //   label: "sidebar-nav-item-my-shops",
      //   icon: "MyShopIcon",
      // },
      // {
      //   href: ROUTES.TAGS,
      //   label: "sidebar-nav-item-tags",
      //   icon: "TagIcon",
      // },
      // {
      //   href: ROUTES.AUTHORS,
      //   label: "sidebar-nav-item-authors",
      //   icon: "FountainPenIcon",
      // },
      // {
      //   href: ROUTES.ORDER_STATUS,
      //   label: "sidebar-nav-item-order-status",
      //   icon: "OrdersStatusIcon",
      // },
      // {
      //   href: ROUTES.CREATE_ORDER,
      //   label: "sidebar-nav-item-create-order",
      //   icon: "CalendarScheduleIcon",
      // },
      // {
      //   href: ROUTES.COUPONS,
      //   label: "sidebar-nav-item-coupons",
      //   icon: "CouponsIcon",
      // },
      // {
      //   href: ROUTES.TAXES,
      //   label: "sidebar-nav-item-taxes",
      //   icon: "TaxesIcon",
      // },
      // {
      //   href: ROUTES.WITHDRAWS,
      //   label: "sidebar-nav-item-withdraws",
      //   icon: "WithdrawIcon",
      // },
      {
        href: ROUTES.REFUNDS,
        label: 'sidebar-nav-item-refunds',
        icon: 'RefundsIcon',
        badge: 'Soon',
      },
      {
        href: ROUTES.SETTINGS,
        label: 'sidebar-nav-item-settings',
        icon: 'SettingsIcon',
      },
      {
        href: ROUTES.QUOTES,
        label: 'sidebar-nav-item-quotes',
        icon: 'OrdersIcon',
      },
      {
        href: ROUTES.ORGANIZATION,
        label: 'sidebar-nav-item-buyer-organization',
        icon: 'ShopIcon',
      },
    ],
    shop: [
      {
        href: (shop: string) => `${ROUTES.DASHBOARD}${shop}`,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.ATTRIBUTES}`,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.PRODUCTS}`,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.AUTHORS}`,
        label: 'sidebar-nav-item-authors',
        icon: 'FountainPenIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.MANUFACTURERS}`,
        label: 'sidebar-nav-item-manufacturers',
        icon: 'DiaryIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.ORDERS}`,
        label: 'sidebar-nav-item-orders',
        icon: 'OrdersIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.REFUNDS}`,
        label: 'sidebar-nav-item-refunds',
        icon: 'RefundsIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.STAFFS}`,
        label: 'sidebar-nav-item-staffs',
        icon: 'UsersIcon',
        permissions: adminAndOwnerOnly,
      },
      {
        href: (shop: string) => `/${shop}${ROUTES.WITHDRAWS}`,
        label: 'sidebar-nav-item-withdraws',
        icon: 'AttributeIcon',
        permissions: adminAndOwnerOnly,
      },
    ],
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};
