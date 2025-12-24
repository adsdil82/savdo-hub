import { Product } from "@/types";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const isInCart = items.some((item) => item.id === product.id);
  const cartItem = items.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-card card-hover bg-card">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quick Add Button - appears on hover */}
        <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="cart"
            size="lg"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full backdrop-blur-sm"
          >
            {isAdding ? (
              <>
                <Check className="h-5 w-5 animate-scale-in" />
                Қўшилди!
              </>
            ) : isInCart ? (
              <>
                <ShoppingCart className="h-5 w-5" />
                Яна қўшиш ({cartItem?.quantity})
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Саватчага қўшиш
              </>
            )}
          </Button>
        </div>

        {/* Category Badge */}
        {isInCart && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full animate-scale-in">
            {cartItem?.quantity} та
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <h3 className="font-medium text-foreground line-clamp-2 leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          
          {/* Mobile Add Button */}
          <Button
            variant="icon"
            size="icon-sm"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="md:hidden"
          >
            {isAdding ? (
              <Check className="h-4 w-4 animate-scale-in" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
