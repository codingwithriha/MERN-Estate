"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, EffectFade } from "swiper/modules"
import SwiperCore from "swiper"
import "swiper/css/bundle"
import "swiper/css/effect-fade"
import ListingItem from "../components/ListingItem"

export default function Home() {
  const [recentListings, setRecentListings] = useState([]) // Featured Properties
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])

  SwiperCore.use([Navigation, Autoplay, EffectFade])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Featured Properties - Latest added listings
        const recentRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?sort=createdAt&order=desc&limit=4`
        )
        const recentData = await recentRes.json()
        setRecentListings(recentData)

        // Recent Offers
        const offerRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?offer=true&sort=createdAt&order=desc&limit=4`
        )
        const offerData = await offerRes.json()
        setOfferListings(offerData)

        // Rent Listings
        const rentRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=rent&sort=createdAt&order=desc&limit=4`
        )
        const rentData = await rentRes.json()
        setRentListings(rentData)

        // Sale Listings
        const saleRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=sale&sort=createdAt&order=desc&limit=4`
        )
        const saleData = await saleRes.json()
        setSaleListings(saleData)
      } catch (error) {
        console.log(error)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7d9d0] to-[#cdd0c4]">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fillOpacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          ></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-[#2f380f] font-medium text-sm">
                <div className="w-2 h-2 bg-green-950 rounded-full animate-pulse"></div>
                <span>Trusted by 10,000+ clients</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#2f380f] leading-tight">
                  Find your next{" "}
                  <span className="relative inline-block">
                    <span className="text-[#424b1e] relative z-10 animate-pulse">
                      perfect
                    </span>
                  </span>
                  <br />
                  place with ease
                </h1>
                <p className="text-lg sm:text-xl text-[#2f380f]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Discover exceptional properties with Estate Hub. From
                  luxury homes to cozy apartments, we have the perfect place
                  waiting for you.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  to={"/search"}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Start Your Search
                  </span>
                </Link>

                <Link
                  to={"/about"}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#686f4b] text-[#2f380f] font-semibold rounded-2xl hover:bg-[#686f4b] hover:text-white transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#2f380f]">
                    500+
                  </div>
                  <div className="text-sm text-[#686f4b]">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#2f380f]">
                    50+
                  </div>
                  <div className="text-sm text-[#686f4b]">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#2f380f]">
                    24/7
                  </div>
                  <div className="text-sm text-[#686f4b]">Support</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative order-first lg:order-last">
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop"
                  alt="Hero Property"
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED PROPERTIES */}
      <div className="relative py-16 lg:py-20 bg-gradient-to-b from-[#cdd0c4] to-[#c1c4b5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f380f] mb-4">
              Featured Properties
            </h2>
            <p className="text-lg sm:text-xl text-[#686f4b] max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional properties
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <Swiper
              navigation
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              effect="fade"
              className="h-[400px] sm:h-[500px] lg:h-[600px]"
            >
              {recentListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div
                    style={{
                      background: `url(${listing.imageUrls?.[0]}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                    className="h-full relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                      <h3 className="text-2xl lg:text-4xl font-bold mb-2">
                        {listing.name}
                      </h3>
                      <p className="opacity-90 mb-4">{listing.address}</p>
                      <Link
                        to={`/listing/${listing._id}`}
                        className="bg-white text-[#424b1e] px-6 py-3 rounded-2xl font-semibold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* MAIN SECTIONS */}
      <div className="bg-gradient-to-br from-[#d7d9d0] to-[#cdd0c4]">
        {/* 🚀 Fixed spacing: only top/bottom padding, no extra bottom margin */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20 py-16 lg:py-20">
          
          {/* ✅ Recent Offers */}
          {offerListings.length > 0 && (
            <Section
              title="Recent Offers"
              subtitle="Don't miss out on these amazing deals"
              link="/search?offer=true"
              listings={offerListings}
            />
          )}

          {/* ✅ For Rent */}
          {rentListings.length > 0 && (
            <Section
              title="For Rent"
              subtitle="Find your perfect rental home"
              link="/search?type=rent"
              listings={rentListings}
            />
          )}

          {/* ✅ For Sale */}
          {saleListings.length > 0 && (
            <Section
              title="For Sale"
              subtitle="Discover properties for sale"
              link="/search?type=sale"
              listings={saleListings}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ✅ Reusable Section Component */
function Section({ title, subtitle, link, listings }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#d7d9d0] via-white to-[#cdd0c4] rounded-3xl p-6 lg:p-8 shadow-xl border border-[#c1c4b5] hover:shadow-2xl transition-all duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-10 gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2f380f] mb-2">
            {title}
          </h2>
          <p className="text-[#686f4b] font-medium">{subtitle}</p>
        </div>
        <Link
          to={link}
          className="bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white px-8 py-4 rounded-2xl font-semibold"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
