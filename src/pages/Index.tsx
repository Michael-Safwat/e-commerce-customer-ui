import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import Footer from '../components/Footer';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const PRODUCTS_PER_PAGE = 6;

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { items, total, itemCount, backendCart, addToCartBackend, removeFromCartBackend, fetchCartBackend } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch cart from backend on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartBackend();
    }
  }, [isAuthenticated, fetchCartBackend]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let result;
      
      if (searchQuery.trim()) {
        // Search by name
        result = await productService.searchProductsByName(
          searchQuery, 
          currentPage, 
          PRODUCTS_PER_PAGE
        );
      } else if (selectedCategory !== 'all') {
        // Filter by category
        result = await productService.getProductsByCategory(
          selectedCategory, 
          currentPage, 
          PRODUCTS_PER_PAGE
        );
      } else {
        // Get all products
        result = await productService.getAllProducts(currentPage, PRODUCTS_PER_PAGE);
      }

      setProducts(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    setCurrentPage(0); // Reset to first page when filters change
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={itemCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {selectedCategory === 'all' ? 'All Products' : 
                   selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </h2>
                <p className="text-gray-600">
                  {totalElements} product{totalElements !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading products...</span>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-red-500 text-lg">{error}</p>
                  <button 
                    onClick={fetchProducts}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}

              {/* No Products Found */}
              {!isLoading && !error && products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && !error && totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                          className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                          className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        total={total}
        onRemoveItem={(productId) => {
          // Find the cart item by product ID and remove it
          const cartItem = backendCart?.items.find(item => item.product.id.toString() === productId);
          if (cartItem) {
            removeFromCartBackend(cartItem.id);
          }
        }}
      />
    </div>
  );
};

export default Index;
