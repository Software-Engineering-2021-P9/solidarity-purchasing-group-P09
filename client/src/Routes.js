import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage/ClientManagementPage";
import { ClientSignupPage } from "./pages/ClientSignupPage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductManagementPage } from "./pages/ProductManagementPage/ProductManagementPage";

const productListRouteName = "product-list-page";
const shoppingCartRouteName = "shopping-cart-page";
const employeeClientManagementRouteName = "employee-client-management-page";
const employeeClientDetailsRouteName = "employee-client-details-page";
const employeeClientSignupRouteName = "employee-client-signup-page";
const farmerProductManagementRouteName = "farmer-product-management-page";
const farmerProductDetailsRouteName = "farmer-product-details-page";

const routes = {
  [productListRouteName]: {
    path: "/",
    component: ProductListPage,
    exact: true,
    linkTitle: "Show Product List",
  },
  [shoppingCartRouteName]: {
    path: "/currentCart",
    component: ShoppingCartPage,
    exact: false,
    linkTitle: "Show Current Cart",
  },
  [employeeClientManagementRouteName]: {
    path: "/employee/clients/",
    component: ClientManagementPage,
    exact: true,
    linkTitle: "Manage Clients",
  },
  [employeeClientDetailsRouteName]: {
    path: "/employee/clients/:id",
    component: ClientDetailsPage,
    exact: false,
    linkTitle: "Show Client Details",
  },
  [employeeClientSignupRouteName]: {
    path: "/employee/signupClient",
    component: ClientSignupPage,
    exact: false,
    linkTitle: "Signup Client",
  },
  [farmerProductManagementRouteName]: {
    path: "/farmer/products",
    component: ProductManagementPage,
    exact: false,
    linkTitle: "Manage Products",
  },
  [farmerProductDetailsRouteName]: {
    path: "/farmer/products/:id",
    component: <></>,
    exact: false,
    linkTitle: "Show Product Details",
  },
};

const employeeNavbarLinks = [
  employeeClientManagementRouteName,
  employeeClientSignupRouteName,
];

const farmerNavbarLinks = [farmerProductManagementRouteName];

export {
  productListRouteName,
  shoppingCartRouteName,
  employeeClientManagementRouteName,
  employeeClientDetailsRouteName,
  employeeClientSignupRouteName,
  farmerProductManagementRouteName,
  farmerProductDetailsRouteName,
  routes,
  employeeNavbarLinks,
  farmerNavbarLinks,
};
