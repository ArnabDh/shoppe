import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Shoppe</h3>
          <p>Your one-stop shop for all your needs. Discover amazing products at unbeatable prices!</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Quick Links</h3>
          <ul>
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:underline">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Contact Us</h3>
          <p>123 Market Street</p>
          <p>Cityville, USA</p>
          <p>Email: support@shopeasy.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .733.592 1.325 1.325 1.325h11.494v-9.294h-3.123v-3.622h3.123v-2.671c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.463.098 2.793.143v3.24l-1.918.001c-1.505 0-1.796.715-1.796 1.762v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.733 0 1.325-.592 1.325-1.325v-21.35c0-.733-.592-1.325-1.325-1.325z" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c-5.462 0-9.837 4.375-9.837 9.837 0 4.992 3.657 9.128 8.437 9.837v-6.944h-2.54v-2.72h2.54v-2.072c0-2.506 1.492-3.89 3.775-3.89 1.094 0 2.238.196 2.238.196v2.46h-1.26c-1.243 0-1.63.773-1.63 1.562v1.744h2.773l-.443 2.72h-2.33v6.944c4.78-.709 8.437-4.845 8.437-9.837 0-5.462-4.375-9.837-9.837-9.837z" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-4.411 0-8 3.589-8 8 0 3.528 2.306 6.533 5.437 7.534v-5.337h-1.609v-2.197h1.609v-1.66c0-1.645.996-2.556 2.466-2.556.7 0 1.299.053 1.473.077v1.705h-1.011c-.791 0-1.046.499-1.046 1.022v1.265h2.094l-.275 2.197h-1.819v5.337c3.131-1.001 5.437-4.006 5.437-7.534 0-4.411-3.589-8-8-8z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Shoppe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
