import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage/ClientManagementPage";
import { ClientSignupPage } from "./pages/ClientSignupPage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductManagementPage } from "./pages/ProductManagementPage/ProductManagementPage";
import { UserLoginPage } from "./pages/UserLoginPage";
import { UserLogoutRedirect } from "./pages/UserLogoutRedirect";

import ProtectedRoute from "./contexts/ProtectedRoute";
import UserRoles from "./services/models/UserRoles";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import ProductCreatePage from "./pages/ProductCreatePage";

const productListRouteName = "product-list-page";
const shoppingCartRouteName = "shopping-cart-page";
const employeeClientManagementRouteName = "employee-client-management-page";
const employeeClientDetailsRouteName = "employee-client-details-page";
const employeeClientSignupRouteName = "employee-client-signup-page";
const farmerProductManagementRouteName = "farmer-product-management-page";
const farmerProductDetailsRouteName = "farmer-product-details-page";
const farmerProductCreateRouteName = "farmer-product-create-page";
const userLoginRouteName = "user-login-page";
const userLogoutRouteName = "user-logout-page";
const clientSignupRouteName = "client-signup-page";
const clientDetailsRouteName = "client-details-page";

const routes = {
  [clientSignupRouteName]: {
    path: "/client/signup",
    component: () => <ClientSignupPage />,
    exact: true,
    linkTitle: "Register",
  },
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
    path: "/client",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.CLIENT]}>
        <ClientDetailsPage />
      </ProtectedRoute>
    ),
    exact: true,
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
  [farmerProductManagementRouteName]: {
    path: "/farmer/products",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.FARMER]}>
        <ProductManagementPage />
      </ProtectedRoute>
    ),
    exact: true,
    linkTitle: "Manage Products",
  },
  [farmerProductDetailsRouteName]: {
    path: "/farmer/products/:id",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.FARMER]}>
        <ProductDetailsPage />
      </ProtectedRoute>
    ),
    exact: false,
    linkTitle: "Show Product Details",
  },
  [farmerProductCreateRouteName]: {
    path: "/farmer/createProduct",
    component: () => (
      <ProtectedRoute requiredRoles={[UserRoles.FARMER]}>
        <ProductCreatePage />
      </ProtectedRoute>
    ),
    exact: false,
    linkTitle: "Add Product",
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
      return [userLogoutRouteName];
    case UserRoles.EMPLOYEE:
      return [
        employeeClientManagementRouteName,
        employeeClientSignupRouteName,
        userLogoutRouteName,
      ];
    case UserRoles.FARMER:
      return [farmerProductManagementRouteName, userLogoutRouteName];
    default:
      return [userLoginRouteName, clientSignupRouteName];
  }
}

export {
  productListRouteName,
  shoppingCartRouteName,
  employeeClientManagementRouteName,
  employeeClientDetailsRouteName,
  employeeClientSignupRouteName,
  farmerProductManagementRouteName,
  farmerProductDetailsRouteName,
  farmerProductCreateRouteName,
  clientDetailsRouteName,
  routes,
  getAvailableNavbarLinks,
  clientSignupRouteName,
};
