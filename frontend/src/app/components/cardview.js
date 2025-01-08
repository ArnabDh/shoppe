"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

async function fetchProductDetails() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.statusText}`);
      }
  
      const product = await response.json();
      return product;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
}

export default function CardView() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProductDetails();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Products</h2>
  
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product._id} className="group relative">
                <Link href={`/products/${product._id}`}>
                  <img
                    alt={product.name}
                    src={product.image || product.imageSrc}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <span className="absolute inset-0" />
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}