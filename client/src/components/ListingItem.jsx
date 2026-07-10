import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white/90 border border-[#b1b5a3]/40 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl w-full">
      <Link to={`/listing/${listing._id}`}>
        {/* Image */}
        <img
          src={
            listing.imageUrls?.length > 0
              ? listing.imageUrls[0]
              : "https://cms-assets.themuse.com/media/lead/_1200x630_crop_center-center_82_none/what-is-real-estate.png?mtime=1721326416"
          }
          onError={(e) => {
            e.target.src =
              "https://cms-assets.themuse.com/media/lead/_1200x630_crop_center-center_82_none/what-is-real-estate.png?mtime=1721326416";
          }}
          alt="listing cover"
          className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Info Section */}
        <div className="p-4 flex flex-col gap-3">
          <p className="truncate text-lg font-semibold text-[#424b1e]">
            {listing.name}
          </p>

          <div className="flex items-center gap-2">
            <MdLocationOn className="h-5 w-5 text-[#686f4b]" />
            <p className="text-sm text-gray-700 truncate">{listing.address}</p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          <p className="text-lg font-semibold text-[#424b1e] mt-2">
            $
            {(listing.offer
              ? listing.discountPrice
              : listing.regularPrice
            )?.toLocaleString("en-US") ?? "N/A"}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="flex gap-6 text-[#686f4b] font-medium text-sm">
            <div>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </div>
            <div>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
