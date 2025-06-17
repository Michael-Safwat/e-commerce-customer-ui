
import { categories } from '../data/products';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

const FilterSidebar = ({ 
  selectedCategory, 
  onCategoryChange, 
  priceRange, 
  onPriceRangeChange 
}: FilterSidebarProps) => {
  const priceRanges = [
    { label: 'All Prices', min: 0, max: 1000 },
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: 1000 },
  ];

  return (
    <div className="w-64 bg-white p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                selectedCategory === category.id 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <Button
              key={`${range.min}-${range.max}`}
              variant={
                priceRange[0] === range.min && priceRange[1] === range.max 
                  ? "default" 
                  : "ghost"
              }
              className={`w-full justify-start text-left ${
                priceRange[0] === range.min && priceRange[1] === range.max
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onPriceRangeChange([range.min, range.max])}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
