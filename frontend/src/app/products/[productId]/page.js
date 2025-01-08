"use client";
import { useState, useEffect } from 'react';

export default function ProductDetails({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image || product.imageSrc}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>
          <div className="border-t border-b py-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600 pb-4">{product.description}</p>
            <h2 className="text-lg font-semibold mb-2 pt-4">Category</h2>
            <p className="text-gray-600">{product.category}</p>
          </div>

          
        </div>
      </div>
    </div>
  );
}
