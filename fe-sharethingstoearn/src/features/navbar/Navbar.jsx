import { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../../api/loginapi";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../auth/AuthContext";
import Logo from "../../assests/logo.png";
import axiosInstance from "../../api/axiosInstance";
import { MutatingDots } from "react-loader-spinner";

const navData = [
  {
    name: "Your Profile",
    href: "/profile",
    icon: <UserIcon className="h-5 w-5 mr-1" />,
  },
  {
    name: "Rental Proudcts",
    href: "/rented-items",
    icon: <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />,
  },
  {
    name: "Your Products",
    href: "/user-items",
    icon: <HomeIcon className="h-5 w-5 mr-1" />,
  },
  {
    name: "Rental Requests",
    href: "/rental-requests",
    icon: <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />,
  },
  {
    name: "Sign out",
    href: "#",
    handleFunc: true,
    icon: <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, logout, profileDate } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const [userNavigation, setUserNavigation] = useState([...navData]);

  useEffect(() => {
    if (userData) {
      console.log("admin", userData);
      if (userData?.role === "Admin") {
        setUserNavigation([
          {
            name: "Your Profile",
            href: "/adminprofile",
            icon: <UserIcon className="h-5 w-5 mr-1" />,
          },
          {
            name: "Sign out",
            href: "#",
            handleFunc: true,
            icon: <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />,
          },
        ]);
      } else {
        console.log("else->");
        setUserNavigation([...navData]);
      }
    }
  }, [profileDate]);


  const fetchUserData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    axiosInstance.interceptors.request.use(
      function (config) {
        setLoading(true);
        return config;
      },
      function (error) {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      function (response) {
        setLoading(false);
        return response;
      },
      function (error) {
        setLoading(false);
        console.log("intercept", error);
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <header className="bg-white">
      {loading && (
        <>
          <div className="api-loading-wrapper">
            <MutatingDots
              visible={true}
              height="100"
              width="100"
              color="rgb(79 70 229 / var(--tw-bg-opacity))"
              secondaryColor="rgb(79 70 229 / var(--tw-bg-opacity))"
              radius="12.5"
              ariaLabel="mutating-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </>
      )}
      <nav
        className="mx-auto flex  items-center justify-between p-6 lg:px-8 border-b border-gray-200"
        aria-label="Global"
      >
        <div
          onClick={() => {
            navigate("/");
          }}
          className="flex lg:flex-1 align-items-center"
        >
          <div className="cursor-pointer">
            <img
              style={{ height: "32px" }}
              className=" w-auto"
              src={Logo}
              alt=""
            />
          </div>
          <h6 style={{ fontWeight: 700 }}> ShareThingsToEarn</h6>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {isAuthenticated && profileDate?.role === "User" && (
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                Categories
                <ChevronDownIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </PopoverButton>

              <PopoverPanel
                transition
                className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-44 overflow-hidden  bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="">
                  {categories?.length &&
                    categories.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 px-3 py-1 rounded-lg text-sm leading-6 hover:bg-gray-50"
                      >
                        <div className="flex-auto">
                          <Link
                            to="/products"
                            state={{ item }}
                            className="mt-1 text-gray-600"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </PopoverPanel>
            </Popover>

            <Link
              to="/products"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Products
            </Link>
          </PopoverGroup>
        )}

        {isAuthenticated && profileDate?.role === "Admin" && (
          <>
            <PopoverGroup className="hidden lg:flex lg:gap-x-12">
              <Link
                to="/users"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Users
              </Link>
              <Link
                to="/adminproducts"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Products
              </Link>
              <Link
                to="/rentals"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Rentals
              </Link>
            </PopoverGroup>
          </>
        )}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          {isAuthenticated ? (
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex max-w-xs items-center   text-sm ">
                  <UserIcon className="h-5 w-5 mr-1" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    {({ focus }) => (
                      <Link
                        to={item.href}
                        className={classNames(
                          focus ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700 d-flex align-items-center"
                        )}
                        onClick={() => {
                          if (item?.handleFunc) {
                            logout();
                          }
                        }}
                      >
                        {item?.icon}
                        {"  "} {item.name}
                      </Link>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          ) : (
            <div className="">
              <Link
                to="/login"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="flex lg:flex-1 align-items-center"
            >
              <div className="cursor-pointer">
                <img
                  style={{ height: "32px" }}
                  className=" w-auto"
                  src={Logo}
                  alt=""
                />
              </div>
              <h6 style={{ fontWeight: 700 }}> ShareThinsToEarn</h6>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {isAuthenticated && profileDate?.role === "Admin" && (
                <>
                  <div className="space-y-2 py-6">
                    <Link
                      to="/user"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Users
                    </Link>
                    <br />
                    <Link
                      to="/adminproducts"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Products
                    </Link>
                    <br />
                    <Link
                      to="/rentals"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Rentals
                    </Link>
                  </div>
                </>
              )}
              {isAuthenticated && profileDate?.role === "User" && (
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Categories
                          <ChevronDownIcon
                            className={classNames(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 space-y-2">
                          {categories?.length &&
                            categories.map((item) => (
                              <Link
                                key={item.name}
                                as="a"
                                to="/products"
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                {item.name}
                              </Link>
                            ))}
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                  <Link
                    to="/products"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Products
                  </Link>
                </div>
              )}
              <div className="py-6">
                {isAuthenticated ? (
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          <div className="d-flex align-items-center">
                            <UserIcon className="h-5 w-5 mr-1" />
                            {userData?.title || "Profile"}
                          </div>
                          <ChevronDownIcon
                            className={classNames(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 space-y-2">
                          {userNavigation?.length &&
                            userNavigation.map((item) => (
                              <Link
                                to={item.href}
                                key={item.id}
                                className={classNames(
                                  "block px-4 py-2 text-sm text-gray-700 d-flex align-items-center"
                                )}
                              >
                                {item?.icon}
                                {"  "} {item.name}
                              </Link>
                            ))}
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ) : (
                  <div className="">
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
