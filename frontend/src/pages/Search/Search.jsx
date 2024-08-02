import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItems from "../../components/ListingItems/ListingItems";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache", // Prevent caching
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData?.searchTerm);
    urlParams.set("type", sidebarData?.type);
    urlParams.set("offer", sidebarData?.offer);
    urlParams.set("parking", sidebarData?.parking);
    urlParams.set("furnished", sidebarData?.furnished);
    urlParams.set("sort", sidebarData?.sort);
    urlParams.set("order", sidebarData?.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings?.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/listing/get?${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache", // Prevent caching
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }

    setListings([...listings, ...data]);
  };
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term:{" "}
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="border outline-none rounded-lg p-3 w-full"
                value={sidebarData?.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="font-semibold">Type:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  checked={sidebarData?.type === "all"}
                  onChange={handleChange}
                />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  checked={sidebarData?.type === "rent"}
                  onChange={handleChange}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  checked={sidebarData?.type === "sale"}
                  onChange={handleChange}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  checked={sidebarData?.offer}
                  onChange={handleChange}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="font-semibold">Amenities:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  checked={sidebarData?.parking}
                  onChange={handleChange}
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  checked={sidebarData?.furnished}
                  onChange={handleChange}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <select
                id="sort_order"
                className="border outline-none rounded-lg p-3"
                onChange={handleChange}
                defaultValue={"created_at_desc"}
              >
                <option
                  value={
                    sidebarData?.offer
                      ? "discountPrice_desc"
                      : "regularPrice_desc"
                  }
                >
                  Price high to low
                </option>
                <option
                  value={
                    sidebarData?.offer
                      ? "discountPrice_asc"
                      : "regularPrice_asc"
                  }
                >
                  Price low to high
                </option>
                {/* <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to hight</option> */}
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
              Search
            </button>
          </form>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
            Listing results :
          </h1>
          <div className="p-7 flex flex-wrap gap-4">
            {!loading && listings?.length === 0 && (
              <p className="text-xl text-slate-700">No listings found!</p>
            )}
            {loading && (
              <p className="text-xl text-slate-700 text-center w-full">
                Loading...
              </p>
            )}

            {!loading &&
              listings &&
              listings?.map((listing) => {
                return <ListingItems key={listing?._id} listing={listing} />;
              })}
          </div>
          {showMore && (
            <button
              className="text-green-700 hover:underline p-7 text-center w-full"
              onClick={onShowMoreClick}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
