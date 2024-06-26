import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  changeStatusRequestedItem,
  getRequestedItems,
} from "../../api/loginapi";
import moment from "moment";
import AlertModal from "../../components/alertModal/AlertModal";

const RentedRequests = () => {
  const [rentedRequestedItems, setRentedRequestedItems] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [alertModal, setAlertModal] = useState(false);

  const handleGetRequestedItems = async () => {
    try {
      const res = await getRequestedItems();
      setRentedRequestedItems([...res?.rows]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetRequestedItems();
  }, []);

  const handleRejectOrAccept = async (params, id) => {
    try {
      const res = await changeStatusRequestedItem(params, id);
      handleGetRequestedItems();
      if (params.status === "reject") toast.success("Rejected succesfully");
      else toast.success("Accepted succesfully");
    } catch (e) {
      console.log(e);
    }
  };

  const onConfirm = () => {
    handleRejectOrAccept({ status: activeStatus.status }, activeStatus?.id);
    setAlertModal(false);
    setActiveStatus(null);
  };
  const onCancel = () => {
    setAlertModal(false);
    setActiveStatus(null);
  };

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Rented Products
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {rentedRequestedItems?.length ? (
              rentedRequestedItems?.map((product) => (
                <div key={product?.id} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <img
                      src={
                        product?.ItemImage?.imageUrl ||
                        "https://via.placeholder.com/300"
                      }
                      alt="product"
                      className="h-full w-full object-cover object-center group-hover:opacity-75 image-wrapper"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    {product?.title || "-"}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      ₹ {product?.rentalPrice}/-
                    </p>
                  </div>
                  {/* <p className="text-sm text-gray-600">
                    Requested by: {product?.ItemRequests?.userName}
                  </p> */}
                  <p className="text-sm text-gray-600">
                    Rental Period:{product?.rentalPeriod}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration:{" "}
                    {moment(product?.rentalStartDate)?.format("DD/MM/YY")} to{" "}
                    {moment(product?.rentalEndDate)?.format("DD/MM/YY")}
                  </p>
                  <div className="flex mt-2 justify-end">
                    <div
                      onClick={() => {
                        setActiveStatus({ status: "accept", id: product?.id });
                        setAlertModal(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="green"
                        className="size-10 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div
                      onClick={() => {
                        setActiveStatus({ status: "reject", id: product?.id });
                        setAlertModal(true);
                      }}
                    >
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="red"
                        className="size-10 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          {rentedRequestedItems?.length ? (
            <></>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  No Data Found
                </p>
                <p className="text-gray-500">
                  There is no data to display at the moment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {alertModal && (
        <AlertModal
          message={`Are you sure you want ${activeStatus?.status}?`}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

export default RentedRequests;
