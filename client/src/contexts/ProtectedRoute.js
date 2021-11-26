import { useContext } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "./AuthContextProvider";

function ProtectedRoute(props) {
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.loggedUser &&
      props.requiredRoles.includes(authContext.loggedUser.role) ? (
        <>{props.children}</>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

export default ProtectedRoute;
