import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#d7d9d0] to-[#cdd0c4] text-[#424b1e]">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-[#424b1e]">Estate </span>
              <span className="text-[#686f4b]">Hub</span>
            </h3>
            <p className="text-[#686f4b] leading-relaxed">
              Your trusted partner in finding the perfect home. We make real
              estate dreams come true with personalized service and expert
              guidance.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/100077588075894"
                className="text-[#868c6f] hover:text-[#424b1e] transition-colors duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/riha_shahzadi/"
                className="text-[#868c6f] hover:text-[#424b1e] transition-colors duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/riha-shahzadi/"
                className="text-[#868c6f] hover:text-[#424b1e] transition-colors duration-300"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#424b1e]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-[#686f4b] hover:text-[#424b1e] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#686f4b] hover:text-[#424b1e] transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-[#686f4b] hover:text-[#424b1e] transition-colors duration-300"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-[#686f4b] hover:text-[#424b1e] transition-colors duration-300"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#424b1e]">Services</h4>
            <ul className="space-y-2">
              <li className="text-[#686f4b]">Property Sales</li>
              <li className="text-[#686f4b]">Property Rentals</li>
              <li className="text-[#686f4b]">Property Management</li>
              <li className="text-[#686f4b]">Investment Consulting</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#424b1e]">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-[#868c6f]" />
                <span className="text-[#686f4b]">
                  123 Real Estate St, City, State 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-[#868c6f]" />
                <span className="text-[#686f4b]">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-[#868c6f]" />
                <span className="text-[#686f4b]">info@estatehub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#b1b5a3] mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#868c6f] text-sm">
            © {new Date().getFullYear()} Estate Hub. All rights reserved.
          </p>
          <p className="text-[#868c6f] text-sm">
            Built by{" "}
            <a
              href="https://riha-shahzadi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#424b1e] hover:text-[#686f4b] transition-colors duration-300"
            >
              CodingWithRiha
            </a>
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-[#868c6f] hover:text-[#424b1e] text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[#868c6f] hover:text-[#424b1e] text-sm transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
