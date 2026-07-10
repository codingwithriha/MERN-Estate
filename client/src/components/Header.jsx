"use client"

import { FaSearch, FaBars, FaTimes } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    if (searchTerm) urlParams.set("searchTerm", searchTerm)
    navigate(`/search?${urlParams.toString()}`)
    setMenuOpen(false)
  }

  const handlePropertiesClick = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("type", "all")
    navigate(`/search?${urlParams.toString()}`)
    setMenuOpen(false)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl)
  }, [location.search])

  return (
    <header className="bg-gradient-to-r from-[#d7d9d0] via-[#cdd0c4] to-[#c1c4b5] shadow-lg border-b border-[#b1b5a3]/30 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        
        {/* Logo */}
        <Link to="/" className="group flex-shrink-0">
          <h1 className="font-bold text-xl sm:text-2xl transition-all duration-500 ease-out group-hover:scale-105 group-hover:drop-shadow-lg">
            <span className="text-[#424b1e]">Estate </span>
            <span className="text-[#686f4b]">Hub</span>
          </h1>
        </Link>

        {/* Search Form (hidden on very small screens) */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex bg-white/95 backdrop-blur-lg p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl items-center shadow-lg border border-[#b1b5a3]/50 transition-all duration-500 ease-out hover:bg-white group mx-2 sm:mx-4"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-28 sm:w-40 md:w-56 lg:w-72 text-[#2f380f] placeholder-[#686f4b]/70 font-medium px-1 sm:px-2 text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="ml-1 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-[#b1b5a3]/20 transition-all duration-300">
            <FaSearch className="text-[#686f4b]" />
          </button>
        </form>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-4 lg:gap-8 items-center">
          <Link to="/" className="group">
            <li className="text-[#424b1e] hover:text-[#2f380f] transition-colors text-sm lg:text-base">Home</li>
          </Link>
          <Link to="/about" className="group">
            <li className="text-[#424b1e] hover:text-[#2f380f] transition-colors text-sm lg:text-base">About</li>
          </Link>
          <li
            onClick={handlePropertiesClick}
            className="cursor-pointer text-[#424b1e] hover:text-[#2f380f] text-sm lg:text-base"
          >
            Properties
          </li>
          <Link to={currentUser ? "/profile" : "/sign-in"} className="group">
            {currentUser ? (
              <img
                src={
                  currentUser?.avatar?.trim()
                    ? currentUser.avatar
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                alt="profile"
                className="w-9 h-9 lg:w-11 lg:h-11 rounded-full object-cover border-2 border-[#424b1e]/80 hover:border-[#2f380f] transition-all"
              />
            ) : (
              <li className="text-[#424b1e] hover:text-[#2f380f] text-sm lg:text-base">Sign in</li>
            )}
          </Link>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#b1b5a3]/30 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes className="text-xl text-[#424b1e]" /> : <FaBars className="text-xl text-[#424b1e]" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg border-t border-[#b1b5a3]/40">
          {/* Search visible on mobile here */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-b border-[#b1b5a3]/30">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent focus:outline-none text-[#2f380f] placeholder-[#686f4b]/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch className="text-[#686f4b]" />
            </button>
          </form>

          {/* Links */}
          <ul className="flex flex-col gap-4 p-4">
            <Link to="/" onClick={() => setMenuOpen(false)}><li>Home</li></Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}><li>About</li></Link>
            <li onClick={handlePropertiesClick}>Properties</li>
            <Link to={currentUser ? "/profile" : "/sign-in"} onClick={() => setMenuOpen(false)}>
              {currentUser ? "Profile" : "Sign in"}
            </Link>
          </ul>
        </div>
      )}
    </header>
  )
}
