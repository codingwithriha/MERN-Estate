"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserSuccess,
  updateUserAvatar,
} from "../redux/user/userSlice"
import { getDatabase, ref, update } from "firebase/database"
import { app } from "../firebase"

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState("")
  const [avatar, setAvatar] = useState(currentUser.avatar || "")
  const [isEditing, setIsEditing] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userListings, setUserListings] = useState([])

  const [formData, setFormData] = useState({
    username: currentUser.username || "",
    email: currentUser.email || "",
    password: "",
  })

  const db = getDatabase(app)

  useEffect(() => {
    setAvatar(currentUser.avatar || "")
  }, [currentUser.avatar])

  const saveAvatarUrlToFirebase = async (userId, avatarUrl) => {
    const userRef = ref(db, "users/" + userId)
    try {
      await update(userRef, { avatar: avatarUrl })
      console.log("Avatar URL saved to Firebase Realtime Database")
    } catch (err) {
      console.error("Firebase update error:", err)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadError("")
    setUploading(true)
    setUploadProgress(0)

    if (!file.type.startsWith("image/")) {
      setUploading(false)
      setUploadError("Please upload a valid image file (JPG, PNG, JPEG, etc.)")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploading(false)
      setUploadError("Image file is too large. Please choose a file smaller than 10MB.")
      return
    }

    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", file)
    cloudinaryFormData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    try {
      console.log("Starting image upload to Cloudinary...")
      console.log("File details:", { name: file.name, size: file.size, type: file.type })

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        cloudinaryFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadProgress(percentCompleted)
            console.log(`Upload progress: ${percentCompleted}%`)
          },
        }
      )

      const imageUrl = res.data.secure_url
      console.log("Upload completed successfully! URL:", imageUrl)
      
      // Update local state
      dispatch(updateUserAvatar(imageUrl))
      setAvatar(imageUrl)

      // Save to Firebase Realtime Database
      if (currentUser._id) {
        await saveAvatarUrlToFirebase(currentUser._id, imageUrl)
      }

      // Update via your API endpoint
      try {
        const apiRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ avatar: imageUrl }),
        })

        if (apiRes.ok) {
          console.log("API update completed successfully")
        }
      } catch (apiError) {
        console.warn("API update failed, but Cloudinary upload successful:", apiError)
      }

      setUploadError("")
      
      // Clear progress after 3 seconds
      setTimeout(() => {
        setUploadProgress(0)
      }, 3000)

    } catch (error) {
      console.error("Upload failed:", error)
      setUploadError("Upload failed. Please try again.")
      setAvatar(currentUser.avatar || "")
    } finally {
      setUploading(false)
    }
  }

  const handleEditable = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updatedData = { ...formData }
      if (updatedData.password === "") {
        delete updatedData.password
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      })

      const data = await res.json()

      if (!res.ok || data.success === false) {
        alert("Update failed: " + (data.message || res.statusText))
        return
      }

      alert("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Update error:", error)
      alert("An error occurred while updating the profile.")
    }
  }

  const handleDeleteUser = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?")
    if (!confirmed) return

    try {
      dispatch(deleteUserStart())
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
      alert("Account deleted successfully!")
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signout`, {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }

      dispatch(signOutUserSuccess())
      navigate("/signin")
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/listings/${currentUser._id}`, {
        credentials: "include",
      })
      const data = await res.json()
      if (data.success === false) {
        setShowListingError(true)
        return
      }
      setUserListings(data)
    } catch (error) {
      console.log(error.message)
      setShowListingError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()
      if (data.success === false) {
        return
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleImageClick = () => {
    // Only allow photo change when editing is enabled
    if (!uploading && fileRef.current && isEditing) {
      console.log("Triggering file input click")
      fileRef.current.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7d9d0] to-[#cdd0c4] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white p-8 rounded-t-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-center">My Profile</h1>
          <p className="text-center text-white/80 mt-2">Manage your account and listings</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center mb-6">
              <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleUpload}
                key={`file-input-${Date.now()}`}
              />
              <div className="relative group">
                <img
                  key={`avatar-${avatar}-${Date.now()}`}
                  onClick={handleImageClick}
                  src={avatar || currentUser?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  onError={(e) => {
                    console.log("Image load error, using fallback")
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }}
                  alt="profile"
                  className={`rounded-full h-32 w-32 object-cover border-4 border-[#9ea38c] shadow-lg transition-all duration-300 ${
                    uploading || !isEditing 
                      ? "cursor-not-allowed opacity-70" 
                      : "cursor-pointer group-hover:border-[#686f4b]"
                  }`}
                />
                {isEditing && !uploading && (
                  <div
                    className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <span className="text-white font-semibold text-sm text-center px-2 pointer-events-none">
                      Change Photo
                    </span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{uploadProgress}%</span>
                  </div>
                )}
                {!isEditing && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Enable edit mode to change photo
                    </div>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mt-4 w-full max-w-xs">
                  <div className="bg-[#cdd0c4] rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#686f4b] to-[#424b1e] h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-[#424b1e] font-semibold mt-2">Uploading... {uploadProgress}%</p>
                </div>
              )}

              {!uploading && uploadProgress > 0 && !uploadError && (
                <div className="mt-4 text-center">
                  <p className="text-green-600 font-semibold bg-green-100 px-4 py-2 rounded-lg border border-green-300">
                    Profile picture uploaded 
                  </p>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 text-center max-w-md">
                  <p className="text-red-600 font-semibold bg-red-100 px-4 py-2 rounded-lg border border-red-300">
                    {uploadError}
                  </p>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="mt-2 text-sm text-[#686f4b] hover:text-[#424b1e] underline"
                    >
                      Try uploading again
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#424b1e] font-semibold mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  value={formData.username}
                  onChange={handleEditable}
                  disabled={!isEditing}
                  className="w-full border-2 border-[#9ea38c] p-4 rounded-lg focus:border-[#686f4b] focus:outline-none transition-colors bg-white/80 backdrop-blur-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-[#424b1e] font-semibold mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  value={formData.email}
                  onChange={handleEditable}
                  disabled={!isEditing}
                  className="w-full border-2 border-[#9ea38c] p-4 rounded-lg focus:border-[#686f4b] focus:outline-none transition-colors bg-white/80 backdrop-blur-sm disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#424b1e] font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="New Password (leave blank to keep current)"
                id="password"
                value={formData.password}
                onChange={handleEditable}
                disabled={!isEditing}
                className="w-full border-2 border-[#9ea38c] p-4 rounded-lg focus:border-[#686f4b] focus:outline-none transition-colors bg-white/80 backdrop-blur-sm disabled:bg-gray-100"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 bg-gradient-to-r from-[#9ea38c] to-[#686f4b] text-white rounded-lg p-4 uppercase hover:from-[#686f4b] hover:to-[#424b1e] transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>

              {isEditing && (
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 uppercase hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                >
                  Save Changes
                </button>
              )}
            </div>

            <Link
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-lg uppercase text-center hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
              to={"/create-listing"}
            >
              Create New Listing
            </Link>
          </form>

          <div className="flex justify-between mt-8 pt-6 border-t border-[#9ea38c]">
            <button
              onClick={handleDeleteUser}
              className="text-red-600 hover:text-red-800 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-300"
            >
              Delete Account
            </button>
            <button
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-800 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-300"
            >
              Sign Out
            </button>
          </div>

          <button
            onClick={handleShowListings}
            className="w-full text-xl mt-6 bg-gradient-to-r from-[#b1b5a3] to-[#9ea38c] text-[#424b1e] p-4 rounded-lg font-semibold hover:from-[#9ea38c] hover:to-[#686f4b] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Show My Listings
          </button>

          {showListingError && (
            <p className="text-red-600 mt-4 text-center bg-red-100 p-3 rounded-lg">
              Error loading listings. Please try again.
            </p>
          )}

          {userListings && userListings.length > 0 && (
            <div className="mt-8">
              <div className="bg-white from-[#c1c4b5] to-[#b1b5a3] p-6 rounded-lg mb-6">
                <h2 className="text-center text-2xl font-bold text-[#424b1e]">Your Property Listings</h2>
              </div>

              <div className="grid gap-4">
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white/60 backdrop-blur-sm border border-[#9ea38c] rounded-lg p-4 flex justify-between items-center gap-4 hover:bg-white/80 transition-all duration-300 shadow-lg"
                  >
                    <Link to={`/listing/${listing._id}`} className="flex items-center gap-4">
                      <img
                        src={listing.imageUrls[0] || "/placeholder.svg"}
                        alt="listing cover"
                        className="h-16 w-16 object-cover rounded-lg border-2 border-[#9ea38c]"
                      />
                      <div>
                        <p className="text-[#424b1e] font-semibold hover:text-[#686f4b] transition-colors">
                          {listing.name}
                        </p>
                        <p className="text-[#686f4b] text-sm">Click to view details</p>
                      </div>
                    </Link>

                    <div className="flex gap-2">
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}