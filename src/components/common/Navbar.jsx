import React, { useEffect } from "react";
import logo from "../../assets/Logo//Logo-Small-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { apiConnector } from "../../services/apiconnector";
import { courseEndpoints } from "../../services/apis";
import { useState } from "react";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { BsChevronDown } from "react-icons/bs"


const Navbar = () => {
  //console.log("Printing base url: ", process.env.REACT_APP_BASE_URL);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [ssubLinks, setSsubLinks] = useState([]);

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector(
        "GET",
        courseEndpoints.COURSE_CATEGORIES_API
      );
      //console.log("Printing Sublinks result:", result);
      setSsubLinks(result.data.data);
    } catch (error) {
      //console.log("Could not fetch the category list");
    }
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
              location.pathname !== "/" ? "bg-richblack-800" : ""
            } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Image */}
        <Link to="/" className="flex gap-1 items-center">
          <img src={logo} width={50} height={40} loading="lazy" alt="" />
          <h2 className="text-3xl text-white sm:opacity-0">SoloStudy</h2>
        </Link>

        {/* Nav Links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className={`relative flex items-center gap-2 group ${ matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"}`}>
                    <p>{link.title}</p>
                    <BsChevronDown/>

                    {/* recatangle box */}
                    <div
                      className="invisible absolute left-[50%] top-[50%] z-[1000] 
                      flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg
                       bg-richblack-5 p-4 text-richblack-900 opacity-0 
                       transition-all duration-150 group-hover:visible
                        group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                    >
                      {/* triangle box */}
                      <div
                        className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"
                      ></div>

                      {ssubLinks.length ? (
                        ssubLinks.map((subLink, index) => (
                          <Link
                            to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                            key={index}
                            className="rounded-lg bg-transparent text-black text-xl py-4 pl-4 hover:bg-richblack-50"
                          >
                            <p>{subLink.name}</p>{" "}
                            <hr className="w-full h-4 text-caribbeangreen-100"></hr>
                            
                          </Link>
                        ))
                      ) : (
                        <div>
                          <p className="text-center">No Courses Found</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login/SignUp/Dashboard */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className=" text-white text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && (
            <div>
              <ProfileDropDown />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

