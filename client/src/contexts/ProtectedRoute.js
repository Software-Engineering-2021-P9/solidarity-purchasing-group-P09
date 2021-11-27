import { useContext } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "./AuthContextProvider";

function ProtectedRoute(props) {
  const authContext = useContext(AuthContext);

  return (
    <>
      {props.requiredRoles.includes(authContext.currentUser?.role) ? (
        <>{props.children}</>
      ) : (
        <Redirect to='/' />
      )}
    </>
  );
}

export default ProtectedRoute;
