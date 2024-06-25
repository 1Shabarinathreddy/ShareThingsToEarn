import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import EditProductModal from "./EditProductModal";
import AlertModal from "../../components/alertModal/AlertModal";
import { deleteItem, getUserProducts } from "../../api/loginapi";
import PageNotFound from "../pagenotfound/PageNotFound";
import { toast } from "react-toastify";

const products = [
  {
    id: 1,
    title: "Earthen Bottle",
    href: "#",
    rentalPrice: "$48",
    ItemImage:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 2,
    name: "Nomad Tumbler",
    href: "#",
    rentalPrice: "$35",
    ItemImage:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    rentalPrice: "$89",
    ItemImage:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },

  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    rentalPrice: "$89",
    ItemImage:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    rentalPrice: "$89",
    ItemImage:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
];

const UserProducts = () => {
  const [isOpenValue, setIsopen] = useState({ isOpen: false });

  const [alertModal, setAlertModal] = useState(false);
  const [userProducts, setUserProducts] = useState([]);

  const handleDeleteItem = async () => {
    try {
      const res = await deleteItem(alertModal?.id);
      console.log("esponse->", res);
      toast.success("Deleted successfully");
      handleFetchUserProducts();
      setAlertModal(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  const onConfirm = () => {
    handleDeleteItem();
  };

  const onCancel = () => {
    setAlertModal(false);
  };

  const handleModal = () => {
    setIsopen({ isOpen: false });
  };

  const handleFetchUserProducts = async () => {
    try {
      const data = await getUserProducts();
      setUserProducts(data.rows);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    handleFetchUserProducts();
  }, []);

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
            <button
              type="button"
              onClick={() => {
                setIsopen({ isOpen: true, mode: "new" });
              }}
              className="mt-6 flex  items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {userProducts?.length ? (
              userProducts?.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1">
                    <img
                      src={
                        product?.ItemImage?.imageUrl ||
                        "https://via.placeholder.com/300"
                      }
                      alt="product"
                      className="object-cover object-center h-full w-full group-hover:opacity-75 image-wrapper"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    {product?.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {product?.rentalPrice}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <div
                        onClick={() => {
                          setIsopen({
                            isOpen: true,
                            product: {
                              id: product?.id,
                              title: product?.title,
                              description: product?.description,
                              categoryId: product?.Category?.id,
                              rentalPrice: product.rentalPrice,
                              rentalPeriod: product?.rentalPeriod,
                              availabilityStartDate: new Date(
                                product?.availabilityStartDate
                              )
                                .toISOString()
                                .split("T")[0],
                              availabilityEndDate: new Date(
                                product?.availabilityEndDate
                              )
                                .toISOString()
                                .split("T")[0],
                              location: product?.location,
                              notes: product?.notes,
                              image:
                                product?.ItemImage?.imageUrl ||
                                "https://via.placeholder.com/300",
                            },
                            mode: "edit",
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="blue"
                          className="w-6 h-6 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </div>
                      <div
                        onClick={() => {
                          setAlertModal({ isOpen: true, id: product?.id });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="red"
                          className="w-6 h-6 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>

          {userProducts?.length ? (
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
      {isOpenValue?.isOpen && (
        <EditProductModal
          isOpen={isOpenValue}
          handleModal={handleModal}
          handleFetchUserProducts={handleFetchUserProducts}
        />
      )}
      {!!alertModal?.isOpen && (
        <AlertModal message={""} onConfirm={onConfirm} onCancel={onCancel} />
      )}
    </div>
  );
};

export default UserProducts;