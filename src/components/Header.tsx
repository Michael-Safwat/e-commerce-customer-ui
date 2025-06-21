import { Search, ShoppingBag, User, LogOut, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onCartOpen: () => void;
  cartItemCount: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Header = ({ onCartOpen, cartItemCount, searchQuery, onSearchChange }: HeaderProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-semibold text-gray-900">Store</h1>
            </Link>
          </div>

          {/* Search Bar */}
          {typeof searchQuery === 'string' && typeof onSearchChange === 'function' && (
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-full focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {isAuthenticated() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name || 'User'}</span>
                      <span className="text-sm text-gray-500">{user?.email}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex items-center gap-2 cursor-pointer">
                      <Key className="h-4 w-4" />
                      Login
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartOpen}
              className="relative hover:bg-gray-100"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
