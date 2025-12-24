import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { UZBEKISTAN_REGIONS, CartItem } from "@/types";
import { formatPrice } from "@/data/products";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, { message: "Исм камида 2 та ҳарфдан иборат бўлиши керак" })
    .max(50, { message: "Исм 50 та ҳарфдан ошмаслиги керак" }),
  phone: z
    .string()
    .regex(/^\+998[0-9]{9}$/, {
      message: "Телефон рақами +998XXXXXXXXX форматида бўлиши керак",
    }),
  region: z.string().min(1, { message: "Вилоятни танланг" }),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderForm({ open, onOpenChange }: OrderFormProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      phone: "+998",
      region: "",
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);

    try {
      // Send order to Telegram via edge function
      const { data: result, error } = await supabase.functions.invoke("send-telegram-order", {
        body: {
          customerName: data.customerName,
          phone: data.phone,
          region: data.region,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice,
        },
      });

      if (error) {
        console.error("Error sending order:", error);
        throw error;
      }

      console.log("Order sent successfully:", result);
      setIsSuccess(true);

      toast({
        title: "Заказ муваффақиятли юборилди!",
        description: "Сиз билан тез орада боғланамиз.",
      });

      // Clear cart and close modal after delay
      setTimeout(() => {
        clearCart();
        reset();
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "Хатолик юз берди",
        description: "Илтимос, қайта уриниб кўринг",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Ensure it starts with +998
    if (!value.startsWith("+998")) {
      value = "+998" + value.replace(/^\+?998?/, "");
    }
    
    // Only allow digits after +998
    value = "+998" + value.slice(4).replace(/\D/g, "").slice(0, 9);
    
    e.target.value = value;
    register("phone").onChange(e);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-scale-in">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Заказ қабул қилинди!
            </h3>
            <p className="text-muted-foreground">
              Раҳмат! Сиз билан тез орада боғланамиз.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Заказ бериш</DialogTitle>
          <DialogDescription>
            Маълумотларингизни тўлдиринг ва биз сиз билан боғланамиз
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Исмингиз *</Label>
            <Input
              id="customerName"
              placeholder="Исмингизни киритинг"
              {...register("customerName")}
              className={errors.customerName ? "border-destructive" : ""}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон рақами *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+998901234567"
              {...register("phone")}
              onChange={handlePhoneChange}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Region */}
          <div className="space-y-2">
            <Label>Вилоят *</Label>
            <Select onValueChange={(value) => setValue("region", value)}>
              <SelectTrigger
                className={errors.region ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Вилоятни танланг" />
              </SelectTrigger>
              <SelectContent>
                {UZBEKISTAN_REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.region && (
              <p className="text-sm text-destructive">{errors.region.message}</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-3 p-4 rounded-xl bg-secondary/50">
            <h4 className="font-medium">Заказ таркиби:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-semibold">Жами:</span>
              <span className="font-bold text-primary text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || items.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Юборилмоқда...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Заказни юбориш
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
