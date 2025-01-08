"use client";
import Link from "next/link";
import {useState, useEffect} from "react";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setError(null);
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search?name=${searchQuery}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    setSearchResults(data.products);
                    setError(null);
                } else {
                    throw new Error("Expected JSON response");
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setError("An error occurred while searching products");
                setSearchResults([]);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Trigger search logic if needed
    };

    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link href="/">
                        Shoppe
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex items-center space-x-6">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    <Link href="/products" className="hover:underline">
                        Products
                    </Link>
                    <Link href="/about-us" className="hover:underline">
                        About Us
                    </Link>
                </nav>

                {/* Search Bar */}
                <div className="relative group">
                    <form className="flex items-center bg-white rounded-md px-2 py-1" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-48 px-2 py-1 text-black focus:outline-none"
                        />
                        <button type="submit" className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                            Search
                        </button>
                    </form>
                    <div className="absolute bg-white text-black w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {error && (
                            <div className="px-4 py-2 text-red-500">
                                {error}
                            </div>
                        )}
                        {!error && searchResults.length === 0 && searchQuery && (
                            <div className="px-4 py-2">
                                No products found
                            </div>
                        )}
                        {searchResults.map((result, index) => (
                            <li key={index} className="px-4 py-2 hover:bg-gray-200">
                                <Link href={`/products/${result._id}`}>
                                    {result.name}
                                    <div className="text-sm text-gray-500">{result.price}</div>
                                    <div>
                                        <img src={result.image} alt={result.name} className="w-10 h-10"/>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </div>
                </div>

                {/* Login Icon */}
                <Link href="/login">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6 ml-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7V3m0 0a4 4 0 00-8 0v4m8 0H8m6 0v7m0 4h4m-4 0H8m4-4v4m0 4H8a4 4 0 01-4-4v-7a4 4 0 014-4h8a4 4 0 014 4v7a4 4 0 01-4 4z"
                        />
                    </svg>
                </Link>
            </div>
        </header>
    );
};

export default Header;