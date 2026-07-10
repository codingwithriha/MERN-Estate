"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth"

export default function SignUp() {
  const [formData, setFormdata] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
 

  const handleSubmit = async (e) => {
    e.preventDefault() 
    setLoading(true)
    console.log(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      // console.log(data); // Optional: Log the response from backend
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate("/sign-in")
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }
  // console.log(formData);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7d9d0] via-[#cdd0c4] to-[#c1c4b5] flex items-center justify-center p-3">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[#b1b5a3]/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#424b1e] mb-2">Create Account</h1>
          <p className="text-[#686f4b] text-lg">Join our real estate community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#424b1e] font-medium mb-2">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full p-4 border-2 border-[#b1b5a3]/30 rounded-xl focus:border-[#868c6f] focus:ring-2 focus:ring-[#868c6f]/20 transition-all duration-300 bg-white/80"
                id="username"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[#424b1e] font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 border-2 border-[#b1b5a3]/30 rounded-xl focus:border-[#868c6f] focus:ring-2 focus:ring-[#868c6f]/20 transition-all duration-300 bg-white/80"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[#424b1e] font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full p-4 border-2 border-[#b1b5a3]/30 rounded-xl focus:border-[#868c6f] focus:ring-2 focus:ring-[#868c6f]/20 transition-all duration-300 bg-white/80"
                id="password"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#424b1e] to-[#686f4b] text-white p-4 rounded-xl font-semibold text-lg hover:from-[#2f380f] hover:to-[#424b1e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#b1b5a3]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#686f4b]">Or continue with</span>
            </div>
          </div>

          <OAuth />
        </form>

        <div className="text-center mt-8 p-4 bg-[#d7d9d0]/30 rounded-xl">
          <p className="text-[#686f4b]">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-[#424b1e] font-semibold hover:text-[#2f380f] transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
