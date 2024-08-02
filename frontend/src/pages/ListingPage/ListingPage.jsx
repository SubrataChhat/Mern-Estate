import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../../components/Contact/Contact";

const ListingPage = () => {
  const params = useParams();
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setError(false);
        const res = await fetch(`/api/listing/get/${params?.listingId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache", // Prevent caching
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params?.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing?.imageUrls.map((url) => {
              return (
                <SwiperSlide key={url}>
                  <div
                    className="h-[500px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div
            className="fixed top-[10%] right-[2%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <FaShare className="text-slate-500" />
          </div>
          {copied && (
            <p className="fixed top-[15%] right-[4%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-7xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing?.name} - ₹{" "}
              {listing?.offer
                ? listing?.discountPrice.toLocaleString("en-IN")
                : listing?.regularPrice.toLocaleString("en-IN")}
              {listing?.type === "rent" && "/ month"}
            </p>
            <p className="flex items-center my-1 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing?.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing?.offer && (
                <p className="bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ₹{" "}
                  {(
                    +listing?.regularPrice - +listing?.discountPrice
                  ).toLocaleString("en-IN")}
                  <span className="px-1">Off</span>
                </p>
              )}
            </div>
            <p className="text-slate-600">
              <span className="font-semibold text-black">Description - </span>
              {listing?.description}
            </p>
            <ul className="my-1 flex flex-wrap items-center gap-4 sm:gap-8 font-semibold text-sm">
              <li className="flex items-center text-green-700 gap-2 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing?.bedrooms > 1
                  ? `${listing?.bedrooms} beds`
                  : `${listing?.bedrooms} bed`}
              </li>
              <li className="flex items-center text-green-700 gap-2 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing?.bathrooms > 1
                  ? `${listing?.bathrooms} baths`
                  : `${listing?.bathrooms} bath`}
              </li>
              {listing?.parking ? (
                <li className="flex items-center text-green-700 gap-2 whitespace-nowrap">
                  <FaParking className="text-lg" />
                  {listing?.parking ? "Parking spot" : "No Parking"}
                </li>
              ) : (
                <li className="flex items-center text-red-700 gap-2 whitespace-nowrap">
                  <FaParking className="text-lg" />
                  {listing?.parking ? "Parking spot" : "No Parking"}
                </li>
              )}
              {listing?.furnished ? (
                <li className="flex items-center text-green-700 gap-2 whitespace-nowrap">
                  <FaChair className="text-lg" />
                  {listing?.furnished ? "Furnished" : "Unfurnished"}
                </li>
              ) : (
                <li className="flex items-center text-red-700 gap-2 whitespace-nowrap">
                  <FaChair className="text-lg" />
                  {listing?.furnished ? "Furnished" : "Unfurnished"}
                </li>
              )}
            </ul>
            {currentUser &&
              listing.userRef !== currentUser?._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default ListingPage;
