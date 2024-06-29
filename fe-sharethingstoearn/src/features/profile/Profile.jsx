import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { editProfile, getProfile } from "../../api/loginapi";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState({});

  const handleGetProfile = async () => {
    try {
      const response = await getProfile();
      setUser({
        name: response?.userName,
        email: response?.email || "",
        phone: response?.phoneNumber,
        address: response?.address || "",
        image: response?.image || "",
        pincode: response?.pinCode || "",
        country: response?.country || "",
        dateOfBirth: response?.dateOfBirth
          ? new Date(response.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  useEffect(() => {
    handleGetProfile();
  }, []);
  const [errors, setErrors] = useState({});

  const handleProfile = async (formDataToSend, id) => {
    try {
      const payload = {
        userName: user?.name,
        email: user?.email,
        phoneNumber: user?.phone,
        dateOfBirth: user?.dateOfBirth,
        address: user?.address,
        country: user?.country,
        pinCode: user?.pincode,
      };
      const data = await editProfile(payload);
      toast.success("Profile saved succesfully");
      console.log("user->", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!user?.name) {
      errors.name = "Name is required";
    }
    if (!user?.email) {
      errors.email = "Email is required";
    }
    if (!user?.phone) {
      errors.phone = "Phone number is required";
    }
    if (!user?.address) {
      errors.address = "Address is required";
    }
    if (!user?.country) {
      errors.country = "Country is required";
    }
    if (!user?.pincode) {
      errors.pincode = "Pincode is required";
    }
    if (!user?.dateOfBirth) {
      errors.pincode = "Date Of Birth is required";
    }
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      handleProfile();
    }
  };

  const handleProfilePictureUpload = (event) => {
    setProfilePicture(URL.createObjectURL(event.target.files[0]));
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="flex flex-col items-center lg:items-center lg:w-1/3 mb-6 lg:mb-0">
            <img
              src={profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-40 h-40 rounded-full mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              id="profilePicture"
            />
            <label
              htmlFor="profilePicture"
              className="mt-6 flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 text-base py-1 px-6 font-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Upload Profile Picture
            </label>
          </div>

          {/* User Information */}
          <div className="flex-grow">
            <div className="mb-6">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                defaultValue={user?.name}
                className={`mt-1 block w-full p-2 border rounded ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                defaultValue={user?.email}
                className={`mt-1 block w-full p-2 border rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                defaultValue={user?.phone}
                className={`mt-1 block w-full p-2 border rounded ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors?.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Date Of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleChange}
                defaultValue={user?.dateOfBirth}
                className={`mt-1 block w-full p-2 border rounded ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors?.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                defaultValue={user?.address}
                className={`mt-1 block w-full p-2 border rounded ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors?.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                onChange={handleChange}
                defaultValue={user?.country}
                className={`mt-1 block w-full p-2 border rounded ${
                  errors.country ? "border-red-500" : ""
                }`}
              />
              {errors?.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Pincode</label>
              <input
                type="text"
                name="pincode"
                onChange={handleChange}
                defaultValue={user?.pincode}
                className={`mt-1 block w-full p-2 border rounded ${
                  errors?.pincode ? "border-red-500" : ""
                }`}
              />
              {errors?.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
