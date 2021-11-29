import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage/ClientManagementPage";
import { ClientSignupPage } from "./pages/ClientSignupPage";
import { ProductListPage } from "./pages/ProductListPage";

const productListRouteName = "product-list-page";
const shoppingCartRouteName = "shopping-cart-page";
const employeeClientManagementRouteName = "employee-client-management-page";
const employeeClientDetailsRouteName = "employee-client-details-page";
const employeeClientSignupRouteName = "employee-client-signup-page";
const userLoginRouteName = "user-login-page";
const userLogoutRouteName = "user-logout-page";
const clientDetailsRouteName = "client-details-page";

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
  [clientDetailsRouteName]: {
    path: "/client",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.CLIENT]}>
        <ClientDetailsPage />
      </ProtectedRoute>
    ),
    exact: false,
    linkTitle: "My Page",
  },
  [employeeClientSignupRouteName]: {
    path: "/employee/signupClient",
    component: ClientSignupPage,
    exact: false,
    linkTitle: "Signup Client",
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
  clientDetailsRouteName,
  routes,
  employeeNavbarLinks,
};
