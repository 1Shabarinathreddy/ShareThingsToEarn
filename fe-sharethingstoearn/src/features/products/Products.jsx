import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Modal from "../../components/modal/Modal";
import { getItems } from "../../api/loginapi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Products() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [isOpenValue, setIsopen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleModal = () => {
    setIsopen((prev) => !prev);
  };

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems([...data?.rows]);
      console.log("user->", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="bg-white">
      <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
        Get free delivery on orders over $100
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
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto  px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900">
              Filters
            </h5>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href}>{category.name}</a>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3 border ">
                <div className="bg-white">
                  <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Products</h2>

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
                              ₹ {product?.rentalPrice}/-
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
              </div>
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
