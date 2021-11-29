import React, { useContext, useEffect, useState } from "react";

import { useHistory, useParams } from "react-router";
import { getAvailableNavbarLinks } from "../Routes";

import { Col, Container, Image, Row, Spinner } from "react-bootstrap";

import ActionConfirmationModal from "../ui-components/ActionConfirmationModal/ActionConfirmationModal";
import Divider from "../ui-components/Divider/Divider";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import {
  getNextWeekProductAvailability,
  getProductByID,
  setNextWeekProductAvailability,
} from "../services/ApiClient";

import { AuthContext } from "../contexts/AuthContextProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "../ui-components/Title.css";
import ProductDetails from "../ui-components/ProductDetails/ProductDetails";
import ImageService from "../services/ImageService/ImageService";
import ProductAvailabilityDetails from "../ui-components/ProductAvailabilityDetails/ProductAvailabilityDetails";
import ProductAvailabilityForm from "../ui-components/ProductAvailabilityForm/ProductAvailabilityForm";

function ProductDetailsPage(props) {
  const params = useParams();
  const productID = params.id;

  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [isInitialized, setIsInitialized] = useState(false);
  const [mustReload, setMustReload] = useState(false);
  const [requestError, setRequestError] = useState("");

  const [product, setProduct] = useState(null);
  const [nextWeekAvailability, setNextWeekAvailability] = useState(null);

  const [actionConfirmationModalMessage, setActionConfirmationModalMessage] =
    useState("");
  const [actionConfirmationModalCallback, setActionConfirmationModalCallback] =
    useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!productID) {
      history.push("/");
    }

    const loadData = () =>
      Promise.all([
        getProductByID(productID),
        getNextWeekProductAvailability(productID),
      ])
        .then(([product, nextWeekProductAvailability]) => {
          setProduct(product);
          setNextWeekAvailability(nextWeekProductAvailability);
          setIsInitialized(true);
          setMustReload(false);
        })
        .catch((err) =>
          setRequestError("Failed to fetch data: " + err.message)
        );

    loadData();
  }, [productID, history, mustReload]);

  function onSetNextWeekProductAvailabilitySubmit(data) {
    setActionConfirmationModalMessage(
      `Are you sure you want confirm the availability for the next week?`
    );
    setActionConfirmationModalCallback(() => () => {
      setIsActionLoading(true);
      setNextWeekProductAvailability(
        productID,
        data.price,
        data.packaging,
        data.quantity
      )
        .catch((err) =>
          setRequestError(
            "Failed to set next week availability: " + err.message
          )
        )
        .finally(() => {
          setMustReload(true);
          setIsActionLoading(false);
          onActionConfirmationModalHide();
        });
    });
  }

  function onActionConfirmationModalHide() {
    setActionConfirmationModalMessage("");
    setActionConfirmationModalCallback(null);
  }

  function buildCurrentWeekAvailabilitySection() {
    return (
      <>
        {product?.productAvailability ? (
          <Row className='pt-3'>
            <ProductAvailabilityDetails
              availability={product?.productAvailability}
            />
          </Row>
        ) : (
          <h4 className='title text-center'>No availability set</h4>
        )}
      </>
    );
  }

  function buildNextWeekAvailabilitySection() {
    return (
      <>
        {nextWeekAvailability ? (
          <Row className='pt-3'>
            <ProductAvailabilityDetails availability={nextWeekAvailability} />
          </Row>
        ) : (
          <>
            <Container className='pt-3'>
              <ProductAvailabilityForm
                isLoading={isActionLoading}
                onSubmit={onSetNextWeekProductAvailabilitySubmit}
              />
            </Container>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <NavbarComponent
        links={getAvailableNavbarLinks(authContext.currentUser)}
        loggedUser={authContext.currentUser}
        userIconLink={authContext.getUserIconLink()}
      />

      {!isInitialized ? (
        <Container className='pt-5 d-flex justify-content-center'>
          <Spinner variant='dark' animation='border' />
        </Container>
      ) : (
        <>
          <Row>
            <h1 className='title'>{product.name}</h1>
          </Row>
          <Row className='pt-2 pb-3'>
            <Col
              xs='12'
              sm='12'
              md='5'
              className='d-flex justify-content-center pb-3'>
              <Image
                style={{ width: "270px" }}
                src={ImageService.returnImageByCategory(product.category)}
                rounded
              />
            </Col>
            <Col xs='12' sm='12' md='6'>
              <ProductDetails product={product} />
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs='12' md='6' className='pb-3'>
              <Row>
                <h2 className='subtitle'>Current Week Availability</h2>
              </Row>
              {buildCurrentWeekAvailabilitySection()}
            </Col>
            <Divider className='d-block d-md-none' />
            <Col xs='12' md='6' className='pb-3'>
              <Row>
                <h2 className='subtitle'>Next Week Availability</h2>
              </Row>
              {buildNextWeekAvailabilitySection()}
            </Col>
          </Row>
        </>
      )}

      <ErrorToast
        errorMessage={requestError}
        onClose={() => setRequestError("")}
      />
      <ActionConfirmationModal
        show={actionConfirmationModalMessage}
        onHide={onActionConfirmationModalHide}
        message={actionConfirmationModalMessage}
        onConfirm={actionConfirmationModalCallback}
        onCancel={onActionConfirmationModalHide}
        isLoading={isActionLoading}
      />
    </>
  );
}

export { ProductDetailsPage };
