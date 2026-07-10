"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  // const { listingId } = useParams()

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get/${params.listingId}`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch listing: ${res.status}`);
        }

        const data = await res.json();

        if (data.success === false) {
          throw new Error(data.message || "Failed to fetch listing");
        }

        // Ensure all required fields are present with default values
        setFormData({
          imageUrls: data.imageUrls || [],
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          type: data.type || "",
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          regularPrice: data.regularPrice || 50,
          discountPrice: data.discountPrice || 0,
          offer: data.offer || false,
          parking: data.parking || false,
          furnished: data.furnished || false,
        });
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.listingId) {
      fetchListing();
    }
  }, [params.listingId]);

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

  const handleImageSubmit = async () => {
    if (files.length < 1 || files.length > 6) {
      setUploadError("Please upload between 1 and 6 images");
      return;
    }

    if (formData.imageUrls.length + files.length > 6) {
      setUploadError("Maximum 6 images allowed in total");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const uploadPromises = files.map(uploadToCloudinary);
      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch (err) {
      setUploadError("Image upload failed. Try again.");
      console.error("Upload error:", err);
    }

    setUploading(false);
    setFiles([]); // Clear file input
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

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await res.json();
    return data.secure_url;
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
        `${import.meta.env.VITE_API_URL}/api/listing/update/${params.listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update listing");
      }

      const data = await res.json();
      console.log(data);

      alert("Listing updated successfully!");
      navigate(`/listing/${params.listingId}`);
    } catch (error) {
      alert("Failed to update listing: " + error.message);
      console.error("Update error:", error);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#d7d9d0] via-[#cdd0c4] to-[#c1c4b5] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#b1b5a3]/30 p-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-[#686f4b]/30 border-t-[#686f4b] rounded-full animate-spin"></div>
              <span className="text-[#686f4b] text-lg font-semibold">
                Loading listing data...
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#d7d9d0] via-[#cdd0c4] to-[#c1c4b5] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#b1b5a3]/30 p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold mb-2">
                Error Loading Listing
              </h2>
              <p className="text-[#686f4b]">{error}</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#d7d9d0] via-[#cdd0c4] to-[#c1c4b5] py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#424b1e] to-[#2f380f] bg-clip-text text-transparent mb-4">
            Update Your Listing
          </h1>
          <p className="text-[#686f4b] text-base sm:text-lg max-w-2xl mx-auto px-4">
            Modify your property details and showcase it to potential buyers or
            renters
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-[#b1b5a3]/30 overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row">
            {/* LEFT SIDE */}
            <div className="flex-1 p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
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
              </div>

              <div className="space-y-4">
                <h3 className="text-[#424b1e] font-semibold text-lg">
                  Property Type
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex-1">
                    <input
                      type="checkbox"
                      checked={formData.type === "sale"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          type: prev.type === "sale" ? "" : "sale",
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center font-semibold ${
                        formData.type === "sale"
                          ? "bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white border-[#424b1e] shadow-lg"
                          : "bg-white/50 text-[#686f4b] border-[#b1b5a3]/30 hover:border-[#686f4b]/50"
                      }`}
                    >
                      For Sale
                    </div>
                  </label>

                  <label className="flex-1">
                    <input
                      type="checkbox"
                      checked={formData.type === "rent"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          type: prev.type === "rent" ? "" : "rent",
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center font-semibold ${
                        formData.type === "rent"
                          ? "bg-gradient-to-r from-[#686f4b] to-[#424b1e] text-white border-[#424b1e] shadow-lg"
                          : "bg-white/50 text-[#686f4b] border-[#b1b5a3]/30 hover:border-[#686f4b]/50"
                      }`}
                    >
                      For Rent
                    </div>
                  </label>
                </div>
              </div>

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

                  <div className="space-y-4">
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
                      Updating Listing...
                    </div>
                  ) : (
                    "Update Listing"
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
