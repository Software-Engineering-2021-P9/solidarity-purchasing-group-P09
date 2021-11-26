import { createContext, useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { guestNavbarLinks } from "../Routes";

const AuthContext = createContext();

const UserRoles = {
  CLIENT: "client",
  EMPLOYEE: "employee",
  FARMER: "farmer",
};

function AuthContextProvider(props) {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const [authState, setAuthState] = useState({
    loggedUser: null,
    loginUser: (email, password) => {
      // Add user login api call here
    },
    logoutUser: () => {
      // Add user logout api call here
    },
  });

  useEffect(() => {
    const getCurrentUser = () => {
      // Call getCurrentUser api here and check if there already is a logged user.
      // If so, populate the authState witht the data from the already logged user
      setAuthState((oldState) => {
        return {
          ...oldState,
          loggedUser: {
            id: "ciaone",
            role: UserRoles.CLIENT,
          },
        };
      });
      setIsAuthInitialized(true);
    };

    if (!isAuthInitialized) getCurrentUser();
  }, [isAuthInitialized]);

  return (
    <>
      {!isAuthInitialized ? (
        <Spinner />
      ) : (
        <AuthContext.Provider value={authState}>
          {props.children}
        </AuthContext.Provider>
      )}
    </>
  );
}

export { AuthContextProvider, UserRoles, AuthContext };
