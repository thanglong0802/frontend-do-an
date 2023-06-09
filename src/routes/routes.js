import config from "../config";

// Pages
import HomePage from "../pages/HomePage";
import DetailPage from "../pages/DetailPage";
import CategoryPage from "../pages/CategoryPage";
import CartPage from "../pages/CartPage";
import CheckOrderPage from "../pages/CheckOrderPage";
import FilerPage from "../pages/FilterPage";
import ProductManaPage from "../pages/admin/ProductManaPage";
import UserManaPage from "../pages/admin/UserManaPage";
import CategoryManaPage from "../pages/admin/CategoryManaPage";
import ValueManaPage from "../pages/admin/ValueManaPage";
import AttributeManaPage from "../pages/admin/AttributeManaPage";
import StatisticManaPage from "../pages/admin/StatisticManaPage";
import ImageManaPage from "../pages/admin/ImageManaPage";
import LoginPage from "../pages/admin/LoginPage";

// Routes public

const publicRoutes = [
  { path: config.routes.home, component: HomePage },
  { path: config.routes.detail, component: DetailPage },
  { path: config.routes.category, component: CategoryPage },
  { path: config.routes.cart, component: CartPage },
  { path: config.routes.checkOrder, component: CheckOrderPage },
  { path: config.routes.filters, component: FilerPage },
  { path: config.routes.productMana, component: ProductManaPage },
  { path: config.routes.userMana, component: UserManaPage },
  { path: config.routes.categoryMana, component: CategoryManaPage },
  { path: config.routes.valueMana, component: ValueManaPage },
  { path: config.routes.attributeMana, component: AttributeManaPage },
  { path: config.routes.statisticMana, component: StatisticManaPage },
  { path: config.routes.imageMana, component: ImageManaPage },
  { path: config.routes.login, component: LoginPage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
