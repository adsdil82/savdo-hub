import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { CartItem } from "@/components/CartItem";
import { OrderForm } from "@/components/OrderForm";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";

const Cart = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [orderFormOpen, setOrderFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Харид қилишга қайтиш
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Саватча
            {totalItems > 0 && (
              <span className="ml-2 text-muted-foreground font-normal text-lg">
                ({totalItems} та)
              </span>
            )}
          </h1>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Тозалаш
            </Button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl bg-card shadow-card space-y-6">
                <h2 className="text-lg font-semibold">Заказ маълумоти</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Маҳсулотлар:</span>
                    <span>{totalItems} та</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Сумма:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Етказиб бериш:</span>
                    <span className="text-primary">Бепул</span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Жами:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <Button
                  variant="cart"
                  size="lg"
                  className="w-full"
                  onClick={() => setOrderFormOpen(true)}
                >
                  Заказ бериш
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Телеграм орқали тасдиқлаш
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Саватча бўш</h2>
            <p className="text-muted-foreground mb-6">
              Маҳсулотларни кўриб чиқинг ва саватчага қўшинг
            </p>
            <Link to="/">
              <Button size="lg">
                Харид қилишни бошлаш
              </Button>
            </Link>
          </div>
        )}
      </main>

      <OrderForm open={orderFormOpen} onOpenChange={setOrderFormOpen} />
    </div>
  );
};

export default Cart;
