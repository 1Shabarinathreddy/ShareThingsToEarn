import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/modal/Modal";
import { useLocation } from "react-router-dom";
import { getItems } from "../../api/loginapi";

export default function Products() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();
  const { item } = location.state || {};

  const [isOpenValue, setIsopen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleModal = () => {
    setIsopen((prev) => !prev);
  };

  const [items, setItems] = useState([]);

  const fetchItems = async (id) => {
    try {
      const data = await getItems(id);
      setItems([...data?.rows]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchItems(item?.id || null);
  }, [item]);

  return (
    <div className="bg-white">
      <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
        Earn from idle assets with ShareThingsFromRent
      </p>
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          className="relative z-40 lg:hidden"
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto  px-4 sm:px-6 lg:px-8">
          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            <div className="bg-white">
              <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {items?.length ? (
                    items?.map((product) => (
                      <div
                        key={product?.id}
                        onClick={() => {
                          setActiveItem(product);
                          handleModal();
                        }}
                        className="group"
                      >
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
                          {product?.title}
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          € {product?.rentalPrice}/-
                        </p>
                        <h3 className="text-sm text-gray-700">
                          Rental Period: {product?.rentalPeriod}
                        </h3>
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
                {items?.length ? (
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

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <div className="lg:col-span-12 border "></div>
            </div>
          </section>
        </main>
      </div>
      {isOpenValue && (
        <Modal
          isOpen={isOpenValue}
          handleModal={handleModal}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          fetchItems={fetchItems}
        />
      )}
    </div>
  );
}
