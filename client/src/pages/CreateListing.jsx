"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "", // either 'sale' or 'rent'
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    if (!res.ok) throw new Error("Failed to upload image");
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageSubmit = async () => {
    if (files.length < 1 || files.length > 6) {
      setUploadError("Please upload between 1 and 6 images");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      setFiles([]);
    } catch (err) {
      setUploadError("Image upload failed. Try again.");
      console.error(err);
    }

    setUploading(false);
  };

  const handleRemoveImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      alert("Please select Sale or Rent");
      return;
    }
    if (formData.imageUrls.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listing/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create listing");
      }
      const data = await res.json();
      alert("Listing created successfully!");
      navigate(`/listing/${data._id}`);
    } catch (err) {
      alert("Failed to create listing: " + err.message);
    }
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#d7d9d0] via-[#cdd0c4] to-[#c1c4b5] py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#424b1e] to-[#2f380f] bg-clip-text text-transparent mb-4">
            Create a Listing
          </h1>
          <p className="text-[#686f4b] text-base sm:text-lg max-w-2xl mx-auto px-4">
            Add your property details and showcase it to potential buyers or
            renters
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-[#b1b5a3]/30 overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row">
            {/* LEFT SIDE */}
            <div className="flex-1 p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
              {/* Property Name */}
              <div className="space-y-2">
                <label className="text-[#424b1e] font-semibold text-sm uppercase tracking-wide">
                  Property Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter property name"
                  className="w-full p-3 sm:p-4 border-2 border-[#b1b5a3]/30 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#686f4b] focus:ring-4 focus:ring-[#686f4b]/20 transition-all duration-300 text-[#2f380f] placeholder-[#868c6f]"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[#424b1e] font-semibold text-sm uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="4"
                  className="w-full p-3 sm:p-4 border-2 border-[#b1b5a3]/30 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#686f4b] focus:ring-4 focus:ring-[#686f4b]/20 transition-all duration-300 text-[#2f380f] placeholder-[#868c6f] resize-none"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-[#424b1e] font-semibold text-sm uppercase tracking-wide">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Property address"
                  className="w-full p-3 sm:p-4 border-2 border-[#b1b5a3]/30 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#686f4b] focus:ring-4 focus:ring-[#686f4b]/20 transition-all duration-300 text-[#2f380f] placeholder-[#868c6f]"
                  required
                />
              </div>

              {/* Property Type */}
              <div className="space-y-4">
                <h3 className="text-[#424b1e] font-semibold text-lg">
                  Property Type
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {["sale", "rent"].map((t) => (
                    <label key={t} className="flex-1">
                      <input
                        type="checkbox"
                        checked={formData.type === t}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            type: prev.type === t ? "" : t,
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center font-semibold ${
                          formData.type === t
                            ? "bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white border-[#424b1e] shadow-lg"
                            : "bg-white/50 text-[#686f4b] border-[#b1b5a3]/30 hover:border-[#686f4b]/50"
                        }`}
                      >
                        {t === "sale" ? "For Sale" : "For Rent"}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-[#424b1e] font-semibold text-lg">
                  Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {["parking", "furnished", "offer"].map((id) => (
                    <label key={id} className="group cursor-pointer">
                      <input
                        type="checkbox"
                        id={id}
                        checked={formData[id]}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-center text-sm font-medium ${
                          formData[id]
                            ? "bg-[#686f4b] text-white border-[#686f4b] shadow-md"
                            : "bg-white/50 text-[#686f4b] border-[#b1b5a3]/30 group-hover:border-[#686f4b]/50"
                        }`}
                      >
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="text-[#424b1e] font-semibold text-lg">
                  Property Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    "bedrooms",
                    "bathrooms",
                    "regularPrice",
                    "discountPrice",
                  ].map((id) => {
                    const isPrice =
                      id === "regularPrice" || id === "discountPrice";
                    return (
                      <div key={id} className="space-y-2">
                        <label className="text-[#424b1e] font-medium text-sm">
                          {id === "bedrooms"
                            ? "Bedrooms"
                            : id === "bathrooms"
                              ? "Bathrooms"
                              : id === "regularPrice"
                                ? "Regular Price"
                                : "Discounted Price"}
                          {isPrice && (
                            <span className="text-[#868c6f] text-xs ml-1">
                              ($/month)
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          id={id}
                          min={isPrice ? 50 : 1}
                          max={isPrice ? 1000000 : 10}
                          value={formData[id]}
                          onChange={handleChange}
                          className="w-full p-3 border-2 border-[#b1b5a3]/30 rounded-lg bg-white/50 backdrop-blur-sm focus:border-[#686f4b] focus:ring-4 focus:ring-[#686f4b]/20 transition-all duration-300 text-[#2f380f]"
                          required
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-[#cdd0c4]/30 to-[#b1b5a3]/30 xl:border-l border-t xl:border-t-0 border-[#b1b5a3]/30">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[#424b1e] font-semibold text-lg">
                    Property Images
                  </h3>
                  <p className="text-[#686f4b] text-sm">
                    Upload 1-6 high-quality images. The first image will be used
                    as the cover photo.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                      className="flex-1 p-3 border-2 border-[#b1b5a3]/30 rounded-lg bg-white/50 backdrop-blur-sm focus:border-[#686f4b] transition-all duration-300 text-[#2f380f] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#686f4b] file:text-white file:cursor-pointer"
                      type="file"
                      accept="image/*"
                      multiple
                    />
                    <button
                      type="button"
                      onClick={handleImageSubmit}
                      disabled={uploading}
                      className="px-6 py-3 bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                      {uploadError}
                    </div>
                  )}
                </div>

                {formData.imageUrls.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[#424b1e] font-medium">
                      Uploaded Images ({formData.imageUrls.length}/6)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(url)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 text-lg font-bold"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-[#424b1e] text-white text-xs px-2 py-1 rounded">
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full p-4 bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Listing...
                    </div>
                  ) : (
                    "Create Listing"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
