/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { addItem, editItem, getCategories } from "../../api/loginapi";
import { toast } from "react-toastify";

const product = {
  name: "Basic Tee 6-Pack ",
  price: "192",
  rating: 3.9,
  reviewCount: 117,
  href: "#",
  imageSrc:
    "https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg",
  imageAlt: "Two each of gray, white, and black shirts arranged on table.",
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "XXL", inStock: true },
    { name: "XXXL", inStock: false },
  ],
};

const options = [{ value: 1, label: "saran" }];

const initialFormData = {
  title: "",
  description: "",
  rentalPrice: "",
  rentalPeriod: "",
  availabilityStartDate: "",
  availabilityEndDate: "",
  location: "",
  notes: "",
  image: null,
};

const initialFormErrors = {
  title: "",
  description: "",
  rentalPrice: "",
  rentalPeriod: "",
  availabilityStartDate: "",
  availabilityEndDate: "",
  location: "",
  image: "",
};

export default function EditProductModal({
  isOpen,
  handleModal,
  handleFetchUserProducts,
}) {
  //   const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState(isOpen?.product);

  console.log("product->", isOpen?.product, formData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error message when user starts typing
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("file->", file);
    setFormData({ ...formData, image: file });
  };

  const addProduct = async (formDataToSend) => {
    try {
      const data = await addItem(formDataToSend);
      toast.success("Added new product");
      setFormData(initialFormData);
      setFormErrors(initialFormErrors);
      handleFetchUserProducts();
      handleModal();
      console.log("user->", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const editProduct = async (formDataToSend, id) => {
    try {
      // formDataToSend.append("file", formData.image);
      const data = await editItem(formDataToSend, id);
      toast.success("Succedully saved product");
      setFormData(initialFormData);
      setFormErrors(initialFormErrors);
      handleFetchUserProducts();
      handleModal();
      console.log("user->", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation
    let errors = {};
    let isValid = true;

    // Basic validation example (you can customize based on your requirements)
    if (!formData?.title?.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData?.description?.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    if (!formData?.rentalPrice) {
      errors.rentalPrice = "Rental Price is required";
      isValid = false;
    }

    if (!formData?.rentalPeriod?.trim()) {
      errors.rentalPeriod = "Rental Period is required";
      isValid = false;
    }

    if (!formData?.availabilityStartDate?.trim()) {
      errors.availabilityStartDate = "Availability Start Date is required";
      isValid = false;
    }

    if (!formData?.availabilityEndDate?.trim()) {
      errors.availabilityEndDate = "Availability End Date is required";
      isValid = false;
    }

    if (!formData?.location?.trim()) {
      errors.location = "Location is required";
      isValid = false;
    }

    if (!formData?.image) {
      errors.image = "Image is required";
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("categoryId", formData.categoryId);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("rentalPrice", formData.rentalPrice);
    formDataToSend.append("rentalPeriod", formData.rentalPeriod);
    formDataToSend.append(
      "availabilityStartDate",
      formData.availabilityStartDate
    );
    formDataToSend.append("availabilityEndDate", formData.availabilityEndDate);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("notes", formData.notes);
    formDataToSend.append("file", formData.image);
    console.log("formdata->", formData);
    if (isOpen.mode === "new") addProduct(formDataToSend);
    else editProduct(formDataToSend, isOpen?.product?.id);
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      console.log("user->", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Dialog
      className="relative z-10"
      open={!!isOpen?.isOpen}
      onClose={() => {
        setFormData(initialFormData);
        setFormErrors(initialFormErrors);
        handleModal();
      }}
    >
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
                  {formData?.image ? (
                    <img
                      src={
                        formData?.image?.size
                          ? URL.createObjectURL(formData?.image)
                          : formData?.image
                      }
                      alt="product"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div
                      className="flex justify-center items-center bg-gray-300 animate-pulse"
                      style={{ height: "450px" }}
                    >
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7h4l3 5h4l3-5h4M5 19h14M5 13h14M7 13V5h10v8"
                        />
                      </svg>
                    </div>
                  )}
                  {/* <div
                    className="mt-1 d-flex bg-white"
                    style={{ border: "2px solid white" }}
                  >
                    <div className="m-2">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        width={60}
                        className="object-cover object-cente"
                      />
                    </div>
                    <div className="m-2">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        width={60}
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="m-2">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        width={60}
                        className="object-cover object-center"
                      />
                    </div>
                  </div> */}
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <form
                      onSubmit={handleSubmit}
                      className="bg-white p-8 pt-0 rounded-lg  w-full max-w-lg"
                    >
                      <h2 className="text-2xl font-bold mb-6">
                        {isOpen?.mode === "new"
                          ? "Add Product"
                          : "Edit Product"}
                      </h2>

                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData?.title || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {formErrors?.title && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.title}
                          </p>
                        )}
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="categoryId"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Category
                        </label>
                        <select
                          value={formData?.categoryId || ""}
                          name="categoryId"
                          id="categoryId"
                          onChange={handleChange}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select</option>
                          {categories?.map((option) => (
                            <option key={option?.id} value={option?.id}>
                              {option?.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData?.description || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          rows="4"
                          required
                        />
                        {formErrors?.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.description}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="rentalPrice"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Rental Price
                        </label>
                        <input
                          type="number"
                          id="rentalPrice"
                          name="rentalPrice"
                          value={formData?.rentalPrice || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {formErrors?.rentalPrice && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.rentalPrice}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="rentalPeriod"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Rental Period
                        </label>
                        <input
                          type="text"
                          id="rentalPeriod"
                          name="rentalPeriod"
                          value={formData?.rentalPeriod || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {formErrors?.rentalPeriod && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.rentalPeriod}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="availabilityStartDate"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Availability Start Date
                        </label>
                        <input
                          type="date"
                          id="availabilityStartDate"
                          name="availabilityStartDate"
                          value={formData?.availabilityStartDate || null}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {formErrors?.availabilityStartDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.availabilityStartDate}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="availabilityEndDate"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Availability End Date
                        </label>
                        <input
                          type="date"
                          id="availabilityEndDate"
                          name="availabilityEndDate"
                          value={formData?.availabilityEndDate || null}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {formErrors?.availabilityEndDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.availabilityEndDate}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="location"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData?.location || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {formErrors?.location && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.location}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="notes"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData?.notes || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          rows="4"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="image"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Upload Image
                        </label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          onChange={handleImageChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {formErrors?.image && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.image}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {isOpen?.mode === "new"
                          ? "Add Product"
                          : "Edit Product"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
