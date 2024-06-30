import { React } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../assests/logo.png";
import moment from "moment";

export default function ListOfUsersForIte({ isOpen, handleModal, activeItem }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Dialog className="relative z-10" open={isOpen} onClose={handleModal}>
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                onClick={() => handleModal(false)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                  <img
                    src={activeItem?.ItemImage?.imageUrl || Logo}
                    alt="product"
                    className="object-cover object-center"
                  />
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                    {activeItem?.title}
                  </h2>

                  <section
                    aria-labelledby="information-heading"
                    className="mt-2"
                  >
                    <p className="text-2xl text-gray-900">
                      € {activeItem?.rentalPrice}/day
                    </p>
                  </section>
                  <section aria-labelledby="options-heading" className="mt-10">
                    <form>
                      <fieldset aria-label="Choose a color">
                        <legend className="text-sm font-medium text-gray-900">
                          Description
                        </legend>
                        <p className="text-sm text-gray-600">
                          {activeItem?.description || "-"}
                        </p>
                      </fieldset>
                      <div className="mb-2 mt-2 d-flex gap-5">
                        <p className="text-sm text-gray-600">
                          <span className="text-md font-medium text-gray-900">
                            Availability:
                          </span>{" "}
                          {formatDate(activeItem?.availabilityStartDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="text-md font-medium text-gray-900">
                            End Date:
                          </span>{" "}
                          {formatDate(activeItem?.availabilityEndDate)}
                        </p>
                      </div>

                      <div className="mb-2 d-flex gap-5">
                        <p className="text-sm text-gray-600">
                          <span className="text-md font-medium text-gray-900">
                            Rental Period:{" "}
                          </span>
                          {activeItem?.rentalPeriod}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="text-md font-medium text-gray-900">
                          Location:{" "}
                        </span>
                        {activeItem?.location}
                      </p>
                      <div className="mt-2 mb-2 text-sm text-gray-600">
                        Requested User Notes:{" "}
                        {activeItem?.ItemRequests?.[0]?.notes || "-"}
                      </div>
                      <p className="text-sm text-gray-600">
                        Requested User Dates:{" "}
                        {moment(
                          activeItem?.ItemRequests?.[0]?.rentalStartDate
                        )?.format("DD/MM/YY")}{" "}
                        to{" "}
                        {moment(
                          activeItem?.ItemRequests?.[0]?.rentalEndDate
                        )?.format("DD/MM/YY")}
                      </p>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
