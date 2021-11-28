import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage/ClientManagementPage";
import { ClientSignupPage } from "./pages/ClientSignupPage";
import { ProductListPage } from "./pages/ProductListPage";
import { UserLoginPage } from "./pages/UserLoginPage";
import { UserLogoutRedirect } from "./pages/UserLogoutRedirect";

import ProtectedRoute from "./contexts/ProtectedRoute";
import UserRoles from "./services/models/UserRoles";

const productListRouteName = "product-list-page";
const shoppingCartRouteName = "shopping-cart-page";
const employeeClientManagementRouteName = "employee-client-management-page";
const employeeClientDetailsRouteName = "employee-client-details-page";
const employeeClientSignupRouteName = "employee-client-signup-page";
const userLoginRouteName = "user-login-page";
const userLogoutRouteName = "user-logout-page";
const clientDetailsRouteName = "current-client-details-page"

const routes = {
  [productListRouteName]: {
    path: "/",
    component: () => <ProductListPage />,
    exact: true,
    linkTitle: "Show Product List",
  },
  [shoppingCartRouteName]: {
    path: "/currentCart",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.CLIENT, UserRoles.EMPLOYEE]}>
        <ShoppingCartPage />
      </ProtectedRoute>
    ),
    exact: false,
    linkTitle: "Show Current Cart",
  },
  [employeeClientManagementRouteName]: {
    path: "/employee/clients/",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.EMPLOYEE]}>
        <ClientManagementPage />
      </ProtectedRoute>
    ),
    exact: true,
    linkTitle: "Manage Clients",
  },
  [employeeClientDetailsRouteName]: {
    path: "/employee/clients/:id",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.EMPLOYEE]}>
        <ClientDetailsPage />
      </ProtectedRoute>
    ),
    exact: false,
    linkTitle: "Show Client Details",
  },
  [clientDetailsRouteName]: {
    path: "/currentClient",
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
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.EMPLOYEE]}>
        <ClientSignupPage />
      </ProtectedRoute>
    ),
    exact: false,
    linkTitle: "Signup Client",
  },
  [userLoginRouteName]: {
    path: "/user/login",
    component: () => <UserLoginPage />,
    exact: false,
    linkTitle: "Login",
  },
  [userLogoutRouteName]: {
    path: "/user/logout",
    component: () => <UserLogoutRedirect />,
    exact: false,
    linkTitle: "Logout",
  },
};

function getAvailableNavbarLinks(loggedUser) {
  switch (loggedUser?.role) {
    case UserRoles.CLIENT:
      return [userLogoutRouteName, clientDetailsRouteName];
    case UserRoles.EMPLOYEE:
      return [
        employeeClientManagementRouteName,
        employeeClientSignupRouteName,
        userLogoutRouteName,
      ];
    case UserRoles.FARMER:
      return [userLogoutRouteName];
    default:
      return [userLoginRouteName];
  }
}

export {
  productListRouteName,
  shoppingCartRouteName,
  employeeClientManagementRouteName,
  employeeClientDetailsRouteName,
  employeeClientSignupRouteName,
  clientDetailsRouteName,
  routes,
  getAvailableNavbarLinks,
};
