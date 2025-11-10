import React, { useState, useEffect } from "react";
import useFetch from "Hooks/useFetch";
import { DotsLoader, IsError } from "Components/RequestHandler";
import Container from "Components/Container/Container";
import ProductRequestModal from "./components/ProductRequestModal";
import image from "assests/4.jpg";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Use useFetch for categories
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    fetchData: fetchCategories,
  } = useFetch();

  // Use separate useFetch for products
  const {
    data: productsData,
    loading: productLoading,
    error: productError,
    fetchData: fetchProducts,
  } = useFetch();

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories("/product-categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set the first category as active when categories load
  useEffect(() => {
    if (
      categoriesData?.data &&
      categoriesData.data.length > 0 &&
      !activeCategory
    ) {
      setActiveCategory(categoriesData.data[0]);
      fetchProducts(`/products/category/${categoriesData.data[0]._id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesData]);

  // Update products when productsData changes
  useEffect(() => {
    if (productsData?.data) {
      setProducts(productsData.data);
    }
  }, [productsData]);

  // Handle category tab click
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    fetchProducts(`/products/category/${category._id}`);
  };

  // Empty states component
  const EmptyProductState = () => (
    <div className="text-center py-8 px-4 max-w-sm mx-auto">
      <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-800 mb-2">
        No Products Available
      </h2>
      <p className="text-gray-500 text-sm">
        There are no products in this category yet
      </p>
    </div>
  );

  // Product Card Component
  const ProductCard = ({ product }) => {
    // Just log the product without causing side effects
    return (
      <div className="bg-white rounded-xl lg:rounded-2xl ">
        {/* Product Image */}
        <div className="">
          <img
            src={image}
            alt={product.name}
            className="w-full lg:h-[350px] object-cover rounded-2xl lg:rounded-[64px]"
          />
        </div>

        {/* Product Content */}
        <div className="p-4">
          {/* Product Title */}
          <div className="flex items-center justify-center gap-x-3 text-xl sm:text-2xl">
            <h3 className="font-semibold">{product.name}</h3>

            {/* Product Price */}
            <p className="text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </p>
          </div>

          {/* Product Description */}
          <div className="mb-4">
            <p className="text-base sm:text-lg lg:text-2xl text-center italic">
              {product.description}
            </p>
          </div>

          {/* Request Product Button */}
          <button
            className="w-full mt-3   lg:mt-6 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-200"
            onClick={() => setSelectedProduct(product)}
          >
            Request Product
          </button>
        </div>
      </div>
    );
  };

  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <DotsLoader />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div>
        <IsError message={categoriesError.message} />
      </div>
    );
  }

  if (!categoriesData?.data || categoriesData.data.length === 0) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center py-8 px-4 max-w-sm mx-auto">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            No Product Categories Available
          </h2>
          <p className="text-gray-500 text-sm">Check back soon for products</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-6 sm:my-secondary md:my-primary lg:my-large">
      {/* Sidebar with title and description */}
      <div>
        <h1 className="text-primary text-3xl sm:text-4xl lg:text-5xl w-full lg:w-[60%] lg:ml-auto">
          Shop the <span className="text-secondary italic">Way</span> Collection
        </h1>

        <div className="flex flex-col lg:flex-row mt-6 lg:mt-12">
          <div className="w-full lg:w-[30%] flex flex-row flex-wrap sm:flex-col justify-center lg:justify-start gap-2 sm:gap-3 mb-6 lg:mb-8">
            {/* All Category Tab */}
            <button
              key="all"
              onClick={() => {
                const allCategory = { _id: "all", title: "All" };
                setActiveCategory(allCategory);
                fetchProducts(`/products`);
              }}
              className={`text-base sm:text-lg lg:text-xl transition-all w-max relative pl-4 px-3 py-1 ${
                activeCategory?._id === "all"
                  ? "text-secondary"
                  : "text-primary"
              }`}
            >
              All
            </button>

            {/* Regular Category Tabs */}
            {categoriesData.data.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryChange(category)}
                className={`text-base sm:text-lg lg:text-xl transition-all w-max relative pl-4 px-3 py-1 ${
                  activeCategory?._id === category._id
                    ? "text-secondary"
                    : "text-primary"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
          <p className="w-full lg:w-[60%] lg:ml-auto text-base sm:text-lg lg:text-2xl text-primary lg:pr-32">
            At Way, our team curates a thoughtful selection of ceramics, art,
            goods and crafts handpicked to bring you the best artisanal
            treasures
          </p>
        </div>
      </div>

      <div>
        {productLoading ? (
          <div className="flex justify-center items-center py-20">
            <DotsLoader />
          </div>
        ) : productError ? (
          <IsError message={productError} />
        ) : products.length === 0 ? (
          <EmptyProductState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-16 mt-12 lg:mt-0">
            {products.map((product, index) => (
              <div key={product._id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Request Modal */}
      {selectedProduct && (
        <ProductRequestModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => {
            // Close the modal after success (with a small delay for animation)
            setTimeout(() => setSelectedProduct(null), 2000);
          }}
        />
      )}
    </Container>
  );
};

export default Shop;
