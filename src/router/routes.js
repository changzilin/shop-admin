const index = () => import("@/views/home/index.vue")
// 商品
const GoodList = () => import("@/views/goods/list/index.vue")
const CategoryList = () => import("@/views/goods/category/index.vue")
const SkusList = () => import("@/views/goods/skus/index.vue")
const CouponList = () => import("@/views/goods/coupon/index.vue")
// 用户
const UserList = () => import("@/views/user/list/index.vue")
const LevelList = () => import("@/views/user/level/index.vue")
// 订单管理
const OrderList = () => import("@/views/order/list/index.vue")
const CommentList = () => import("@/views/order/comment/index.vue")
// 配置
const SettingBase = () => import("@/views/setting/base/index.vue")
const SettingBuy = () => import("@/views/setting/buy/index.vue")
const SettingShip = () => import("@/views/setting/ship/index.vue")
// 管理员
const ManagerList = () => import("@/views/manager/list/index.vue")
const AccessList = () => import("@/views/manager/access/index.vue")
const RoleList = () => import("@/views/manager/role/index.vue")
// 分销
const DistributionIndex = () => import("@/views/distribution/distributor/index.vue")
const DistributionSetting = () => import("@/views/distribution/setting/index.vue")
// 其他模块
const ImageList = () => import("@/views/other/image/index.vue")
const NoticeList = () => import("@/views/other/notice/index.vue")

// 动态路由，用于匹配菜单动态添加路由
export default [
  {
    path: "/",
    name: "/",
    component: index,
    meta: {
      title: "后台首页"
    }
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodList,
    meta: {
      title: "商品管理"
    }
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
      title: "分类管理"
    }
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: SkusList,
    meta: {
      title: "规格管理"
    }
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
      title: "用户列表"
    }
  },
  {
    path: "/level/list",
    name: "/level/list",
    component: LevelList,
    meta: {
      title: "会员等级"
    }
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    meta: {
      title: "订单列表"
    }
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    meta: {
      title: "评论管理"
    }
  },
  {
    path: "/distribution/index",
    name: "/distribution/index",
    component: DistributionIndex,
    meta: {
      title: "分销员管理"
    }
  },
  {
    path: "/distribution/setting",
    name: "/distribution/setting",
    component: DistributionSetting,
    meta: {
      title: "分销设置"
    }
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    meta: {
      title: "图库管理"
    }
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    meta: {
      title: "公告管理"
    }
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: SettingBase,
    meta: {
      title: "基础设置"
    }
  },
  {
    path: "/setting/buy",
    name: "/setting/buy",
    component: SettingBuy,
    meta: {
      title: "支付设置"
    }
  },
  {
    path: "/setting/ship",
    name: "/setting/ship",
    component: SettingShip,
    meta: {
      title: "物流设置"
    }
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    meta: {
      title: "优惠券管理"
    }
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    meta: {
      title: "管理员管理"
    }
  },
  {
    path: "/access/list",
    name: "/access/list",
    component: AccessList,
    meta: {
      title: "权限管理"
    }
  },
  {
    path: "/role/list",
    name: "/role/list",
    component: RoleList,
    meta: {
      title: "角色管理"
    }
  }
]