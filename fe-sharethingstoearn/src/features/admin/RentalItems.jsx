import React, { useEffect, useState } from "react";
import { getAllRentedItems, returnItem } from "../../api/loginapi";
import moment from "moment";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";

const RentedItems = () => {
  const [rentedItems, setRentedItems] = useState([]);
  const { profileDate } = useAuth();
  const handleStatus = (type) => {
    let alertColorClasses = "";
    switch (type) {
      case "approved":
        alertColorClasses =
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20";
        break;
      case "reject":
        alertColorClasses =
          "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10";
        break;
      case "pending":
        alertColorClasses =
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20";
        break;
      default:
        alertColorClasses =
          "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10";
    }
    return alertColorClasses;
  };

  const handleGetRentedItems = async () => {
    try {
      const res = await getAllRentedItems();
      setRentedItems([...res?.rows]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetRentedItems();
  }, []);

  const handleReturn = async (id) => {
    try {
      await returnItem(id);
      handleGetRentedItems();
      toast.success("Returned succesfully");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Rentals</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {rentedItems?.length ? (
              rentedItems?.map((product) => (
                <div key={product?.id} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <img
                      src={
                        product?.Item?.ItemImage?.imageUrl ||
                        "https://via.placeholder.com/300"
                      }
                      alt="product"
                      className="h-full w-full object-cover object-center group-hover:opacity-75 image-wrapper"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    {product?.Item?.title ||
                      "sjcjsdkj v sfv dfjn vfj vj ejhv reh vejr kjw fj ref erj erj jer jv erj"}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      € {product?.Item?.rentalPrice}/-
                    </p>
                    <div className="flex justify-end">
                      <span class={` ${handleStatus(product?.status)}`}>
                        {product?.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Duration:{" "}
                    {moment(product?.rentalStartDate)?.format("DD/MM/YY")} to{" "}
                    {moment(product?.rentalEndDate)?.format("DD/MM/YY")}
                  </p>

                  {profileDate?.role !== "Admin" && (
                    <button
                      type="button"
                      onClick={() => {
                        handleReturn(product?.id);
                      }}
                      className="mt-6 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-1 text-base font-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Return
                    </button>
                  )}
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          {rentedItems?.length ? (
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
    </div>
  );
};

export default RentedItems;
