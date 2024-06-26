import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { bookItem } from "../../api/loginapi";
import moment from "moment";
import { toast } from "react-toastify";

export default function Modal({
  isOpen,
  handleModal,
  activeItem,
  setActiveItem,
  fetchItems,
}) {
  const [requestData, setRequestData] = useState({});
  console.log("active Item->", activeItem);

  const handleBookItemApi = async (payload) => {
    try {
      const res = await bookItem(payload);
      console.log("response->", res);
      toast.success("Requested successfully");
      setActiveItem(null);
      fetchItems();
      handleModal();
    } catch (e) {
      console.log("error->", e);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRequest = () => {
    console.log("first->", requestData);
    if (!requestData?.rentalStartDate) {
      toast.error("Rental Start Date is required");
      return;
    }
    if (!requestData?.rentalEndDate) {
      toast.error("Rental End Date is required");
      return;
    }

    const payload = {
      itemId: activeItem?.id,
      rentalStartDate: requestData?.rentalStartDate,
      rentalEndDate: requestData?.rentalEndDate,
      notes: requestData?.notes,
    };

    handleBookItemApi(payload);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
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
                    src={activeItem?.ItemImage}
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
                    <h3 id="information-heading" className="sr-only">
                      Product information
                    </h3>

                    <p className="text-2xl text-gray-900">
                      ₹ {activeItem?.rentalPrice}/day
                    </p>
                  </section>

                  <section aria-labelledby="options-heading" className="mt-10">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>

                    <form>
                      <fieldset aria-label="Choose a color">
                        <legend className="text-sm font-medium text-gray-900">
                          Description
                        </legend>
                        <p className="text-sm text-gray-600">
                          {activeItem?.description ||
                            " Nam nec tellus a odio tincidunt auctor a ornare odio.Sed non mauris vitae erat consequat auctor eu in elit.Class aptent taciti sociosqu ad litora torquent per"}
                        </p>
                      </fieldset>
                      <div className="mb-4 mt-4 d-flex gap-5">
                        <p className="text-sm text-gray-600">
                          <span className="text-sm font-medium text-gray-900">
                            Availability:
                          </span>{" "}
                          {formatDate(activeItem?.availabilityStartDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="text-sm font-medium text-gray-900">
                            End Date:
                          </span>{" "}
                          {formatDate(activeItem?.availabilityEndDate)}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="text-sm font-medium text-gray-900">
                            Rental Period:
                          </span>
                          {activeItem?.rentalPeriod}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="text-sm font-medium text-gray-900">
                            Location:
                          </span>
                          {activeItem?.location}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="text-sm font-medium text-gray-900">
                            Contact:
                          </span>{" "}
                          {activeItem?.User?.userName}, Ph No.{" "}
                          {activeItem?.User?.phoneNumber}
                        </p>
                      </div>
                      <div className="row">
                        <div className="mb-4 col-sm-12 col-md-6">
                          <label
                            htmlFor="rentalStartDate"
                            className="block text-sm text-gray-700 font-medium mb-2"
                          >
                            Rental Start Date
                          </label>
                          <input
                            type="date"
                            id="rentalStartDate"
                            name="rentalStartDate"
                            min={moment().format("YYYY-MM-DD")}
                            max={moment(activeItem?.availabilityEndDate).format(
                              "YYYY-MM-DD"
                            )}
                            value={requestData?.rentalStartDate || null}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div className="mb-4 col-sm-12 col-md-6">
                          <label
                            htmlFor="rentalEndDate"
                            className="block text-sm text-gray-700 font-medium mb-2"
                          >
                            Rental Start Date
                          </label>
                          <input
                            type="date"
                            id="rentalEndDate"
                            name="rentalEndDate"
                            value={requestData?.rentalEndtDate || null}
                            onChange={handleChange}
                            max={moment(activeItem?.availabilityEndDate).format(
                              "YYYY-MM-DD"
                            )}
                            min={moment().format("YYYY-MM-DD")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="notes"
                          className="block text-sm text-gray-700 font-medium mb-2"
                        >
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={requestData?.notes || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          rows="2"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleRequest}
                        className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Request to Rent
                      </button>
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
