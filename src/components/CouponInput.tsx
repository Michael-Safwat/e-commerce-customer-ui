import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '../hooks/use-toast';

interface CouponInputProps {
  total: number;
  onDiscount: (discount: number) => void;
}

const validCoupons: Record<string, number> = {
  SAVE10: 0.10, // 10% off
  SAVE20: 0.20, // 20% off
};

const CouponInput = ({ total, onDiscount }: CouponInputProps) => {
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (validCoupons[code]) {
      setDiscount(validCoupons[code]);
      setCouponError('');
      onDiscount(validCoupons[code]);
      toast({
        title: "Coupon Applied",
        description: `Coupon "${code}" applied!`,
      });
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code.');
      onDiscount(0);
    }
  };

  return (
    <div>
      <label className="block font-semibold mb-2">Apply Coupon</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1 min-w-0"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
        />
        <Button
          type="button"
          className="bg-blue-600 text-white whitespace-nowrap"
          onClick={handleApplyCoupon}
        >
          Apply
        </Button>
      </div>
      {couponError && (
        <div className="text-red-600 text-sm mt-2">{couponError}</div>
      )}
      {discount > 0 && (
        <div className="text-green-600 text-sm mt-2">Coupon applied!</div>
      )}
    </div>
  );
};

export default CouponInput;