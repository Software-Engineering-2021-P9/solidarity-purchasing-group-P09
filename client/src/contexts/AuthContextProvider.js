import { createContext, useState, useEffect } from "react";
import { Row, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import { clientDetailsRouteName } from "../Routes";
import { getCurrentUser, loginUser, logoutUser } from "../services/ApiClient";
import UserRoles from "../services/models/UserRoles";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const history = useHistory();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const [authState, setAuthState] = useState({
    currentUser: null,
    loginUser: function (email, password) {
      return new Promise((resolve, reject) => {
        loginUser(email, password)
          .then((user) => {
            setAuthState((old) => {
              return { ...old, currentUser: user };
            });
            history.push("/");
            return resolve(user);
          })
          .catch((err) => {
            return reject(err.message);
          });
      });
    },
    logoutUser: function () {
      return new Promise((resolve, reject) => {
        if (!this.currentUser) {
          return resolve();
        }
        logoutUser()
          .then(() => {
            setAuthState((old) => {
              return {
                ...old,
                currentUser: null,
              };
            });
            history.push("/");
            return resolve();
          })
          .catch((err) => {
            setErrorToastMessage(err.message);
            setShowErrorToast(true);
            return reject();
          });
      });
    },
    getUserIconLink: function(){
      switch(this.currentUser?.role){
        case UserRoles.CLIENT:
          return clientDetailsRouteName;
        case UserRoles.EMPLOYEE:
        case UserRoles.FARMER:
        default:
          return "";
      }
    }
  });

  useEffect(() => {
    const fetchCurrentUser = () => {
      // Check if there already is a logged user.
      // If so, populate the authState with the data from the already logged user
      getCurrentUser()
        .then((currentUser) => {
          if (currentUser !== null) {
            setAuthState((old) => {
              return {
                ...old,
                currentUser: currentUser,
              };
            });
          }
          setIsAuthInitialized(true);
        })
        .catch((err) => {
          setErrorToastMessage(err.message);
          setShowErrorToast(true);
        });
    };

    if (!isAuthInitialized) fetchCurrentUser();
  }, [isAuthInitialized, history]);

  return (
    <>
      {!isAuthInitialized ? (
        <Row className='vh-100 justify-content-center align-content-center'>
          <Spinner animation='border' />
        </Row>
      ) : (
        <AuthContext.Provider value={authState}>
          {props.children}
        </AuthContext.Provider>
      )}

      <ErrorToast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        title='Error'
        message={errorToastMessage}
      />
    </>
  );
}

export { AuthContextProvider, AuthContext };
