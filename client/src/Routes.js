import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage/ClientManagementPage";
import { ClientSignupPage } from "./pages/ClientSignupPage";
import { ProductListPage } from "./pages/ProductListPage";

const productListRouteName = "product-list-page";
const productListClientRouteName = "product-list-client-page";
const shoppingCartRouteName = "shopping-cart-page";
const employeeClientManagementRouteName = "employee-client-management-page";
const employeeClientDetailsRouteName = "employee-client-details-page";
const employeeClientSignupRouteName = "employee-client-signup-page";

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
  [productListClientRouteName]: {
    path: "/clientID=:clientID",
    component: ProductListPage,
    exact: false,
    linkTitle: "Show Product List for a client",
  },
};

const employeeNavbarLinks = [
  employeeClientManagementRouteName,
  employeeClientSignupRouteName,
];

export {
  productListRouteName,
  shoppingCartRouteName,
  employeeClientManagementRouteName,
  employeeClientDetailsRouteName,
  employeeClientSignupRouteName,
  routes,
  employeeNavbarLinks,
};
