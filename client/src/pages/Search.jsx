"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import ListingItem from "../components/ListingItem"

export default function Search() {
  const location = useLocation()
  const navigate = useNavigate()

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt", // FIXED
    order: "desc",
  })

  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    const typeFromUrl = urlParams.get("type")
    const parkingFromUrl = urlParams.get("parking")
    const furnishedFromUrl = urlParams.get("furnished")
    const offerFromUrl = urlParams.get("offer")
    const sortFromUrl = urlParams.get("sort")
    const orderFromUrl = urlParams.get("order")

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      })
    }

    const fetchListings = async () => {
      setLoading(true)
      setShowMore(false)
      const searchQuery = urlParams.toString()
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?${searchQuery}`)
      const data = await res.json()
      if (data.length > 8) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
      setListings(data)
      setLoading(false)
    }

    fetchListings()
  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
      setSidebardata({ ...sidebardata, type: e.target.id })
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value })
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
      })
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at"

      const order = e.target.value.split("_")[1] || "desc"

      setSidebardata({ ...sidebardata, sort, order })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set("searchTerm", sidebardata.searchTerm)
    urlParams.set("type", sidebardata.type)
    urlParams.set("parking", sidebardata.parking)
    urlParams.set("furnished", sidebardata.furnished)
    urlParams.set("offer", sidebardata.offer)
    urlParams.set("sort", sidebardata.sort)
    urlParams.set("order", sidebardata.order)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length
    const startIndex = numberOfListings
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex", startIndex)
    const searchQuery = urlParams.toString()
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?${searchQuery}`)
    const data = await res.json()
    if (data.length < 9) {
      setShowMore(false)
    }
    setListings([...listings, ...data])
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-full lg:w-90 xl:w-96 p-3 sm:p-4 lg:p-5 border-b-2 lg:border-r-2 lg:border-b-0 lg:min-h-screen bg-gray-50">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#424b1e] mb-2">Search Filters</h2>
          <div className="w-16 h-1 bg-[#686f4b] rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#424b1e] text-lg">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search properties..."
              className="border-2 border-gray-300 rounded-lg p-2.5 w-full focus:border-[#686f4b] focus:outline-none transition-colors bg-white text-[#424b1e] text-lg"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <label className="font-semibold text-[#424b1e] text-lg block mb-3">Property Type:</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="all"
                  className="w-4 h-4 accent-[#686f4b]"
                  onChange={handleChange}
                  checked={sidebardata.type === "all"}
                />
                <span className="text-[#424b1e] font-medium text-sm">Rent & Sale</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-4 h-4 accent-[#686f4b]"
                  onChange={handleChange}
                  checked={sidebardata.type === "rent"}
                />
                <span className="text-[#424b1e] font-medium text-sm">Rent</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-4 h-4 accent-[#686f4b]"
                  onChange={handleChange}
                  checked={sidebardata.type === "sale"}
                />
                <span className="text-[#424b1e] font-medium text-sm">Sale</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-4 h-4 accent-[#686f4b]"
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span className="text-[#424b1e] font-medium text-sm">Offer</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <label className="font-semibold text-[#424b1e] text-lg block mb-3">Amenities:</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-4 h-4 accent-[#686f4b]"
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span className="text-[#424b1e] font-medium text-sm">Parking</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-4 h-4 accent-[#686f4b]"
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span className="text-[#424b1e] font-medium text-sm">Furnished</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#424b1e] text-lg">Sort by:</label>
            <select
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              id="sort_order"
              className="border-2 border-gray-300 rounded-lg p-2.5 focus:border-[#686f4b] focus:outline-none transition-colors bg-white text-[#424b1e] text-lg"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-[#686f4b] text-white p-4 rounded-lg hover:bg-[#424b1e] transition-colors duration-300 font-semibold shadow-lg text-sm">
            Search Properties
          </button>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        <div className="bg- text-white p-4 sm:p-6 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#686f4b]">Search Results</h1>
          <p className="text-[#686f4b]/90 mt-2 text-sm sm:text-base">Find your perfect property</p>
        </div>

        <div className="p-4 sm:p-6 lg:p-7">
          {!loading && listings.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#686f4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <p className="text-xl sm:text-2xl text-[#424b1e] font-semibold mb-2">No properties found!</p>
                <p className="text-[#686f4b] text-sm sm:text-base">Try adjusting your search filters to find more properties</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#686f4b]/20 border-t-[#686f4b] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl sm:text-2xl text-[#424b1e] font-semibold">Loading properties...</p>
                <p className="text-[#686f4b] mt-2 text-sm sm:text-base">Please wait while we find the best matches</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {!loading &&
              listings &&
              listings.map((listing) => (
                <div key={listing._id} className="w-full">
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                    <ListingItem listing={listing} />
                  </div>
                </div>
              ))}
          </div>

          {showMore && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={onShowMoreClick}
                className="bg-[#686f4b] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-[#424b1e] transition-colors duration-300 font-semibold shadow-lg text-sm sm:text-base"
              >
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}