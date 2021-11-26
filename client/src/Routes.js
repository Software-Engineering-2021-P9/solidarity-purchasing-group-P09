import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage/ClientManagementPage";
import { ClientSignupPage } from "./pages/ClientSignupPage";
import { ProductListPage } from "./pages/ProductListPage";
import ProtectedRoute from "./contexts/ProtectedRoute";
import { UserRoles } from "./contexts/AuthContextProvider";

const productListRouteName = "product-list-page";
const shoppingCartRouteName = "shopping-cart-page";
const employeeClientManagementRouteName = "employee-client-management-page";
const employeeClientDetailsRouteName = "employee-client-details-page";
const employeeClientSignupRouteName = "employee-client-signup-page";

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
};

const employeeNavbarLinks = [
  employeeClientManagementRouteName,
  employeeClientSignupRouteName,
];

const guestNavbarLinks = [];

export {
  productListRouteName,
  shoppingCartRouteName,
  employeeClientManagementRouteName,
  employeeClientDetailsRouteName,
  employeeClientSignupRouteName,
  routes,
  employeeNavbarLinks,
  guestNavbarLinks,
};
