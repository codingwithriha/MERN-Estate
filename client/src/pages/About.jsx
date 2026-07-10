import { Link } from "react-router-dom"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7d9d0] to-[#cdd0c4] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white p-12 rounded-2xl shadow-xl mb-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">About Estate Hub</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your trusted partner in finding the perfect property
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#9ea38c] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-[#424b1e]">Our Mission</h2>
            </div>
            <p className="text-[#686f4b] leading-relaxed">
              Estate Hub is a leading real estate agency that specializes in helping clients buy, sell, and rent
              properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing
              exceptional service and making the buying and selling process as smooth as possible.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#9ea38c] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-[#424b1e]">Our Commitment</h2>
            </div>
            <p className="text-[#686f4b] leading-relaxed">
              Our mission is to help our clients achieve their real estate goals by providing expert advice,
              personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell,
              or rent a property, we are here to help you every step of the way.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#c1c4b5] to-[#b1b5a3] rounded-2xl p-8 shadow-lg mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-[#424b1e]">Our Expert Team</h2>
          </div>
          <p className="text-[#424b1e] leading-relaxed text-lg">
            Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are
            committed to providing the highest level of service to our clients. We believe that buying or selling a
            property should be an exciting and rewarding experience, and we are dedicated to making that a reality for
            each and every one of our clients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-[#9ea38c] hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-xl font-bold text-[#424b1e] mb-3">Premium Properties</h3>
            <p className="text-[#686f4b]">Curated selection of the finest properties in prime locations</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-[#9ea38c] hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-xl font-bold text-[#424b1e] mb-3">Expert Guidance</h3>
            <p className="text-[#686f4b]">Professional advice from experienced real estate specialists</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-[#9ea38c] hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-xl font-bold text-[#424b1e] mb-3">Fast Service</h3>
            <p className="text-[#686f4b]">Quick and efficient processes to get you into your dream home</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-xl text-white/90 mb-6">Let our expert team help you navigate the real estate market</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-[#424b1e] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105 inline-block"
              >
                Browse Properties
              </Link>
             <a
  href="mailto:info@estatehub.com"
  className="bg-[#9ea38c] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#868c6f] transition-colors shadow-lg transform hover:scale-105 inline-block"
>
  Contact Us
</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
