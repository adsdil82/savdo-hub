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
import { UZBEKISTAN_REGIONS } from "@/types";
import { formatPrice } from "@/data/products";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const orderSchema = z.object({
  customerName: z.string().min(2, "Исм камида 2 та ҳарф"),
  phone: z.string().regex(/^\+998\d{9}$/, "Телефон формати нотўғри"),
  region: z.string().min(1, "Вилоятни танланг"),
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
    reset,
    formState: { errors },
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
      const res = await fetch("http://localhost:3001/send-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: data.customerName,
          phone: data.phone,
          region: data.region,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      setIsSuccess(true);

      toast({
        title: "Заказ юборилди",
        description: "Сиз билан тез орада боғланамиз",
      });

      setTimeout(() => {
        clearCart();
        reset();
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast({
        title: "Хатолик",
        description: "Заказ юборилмади, қайта уриниб кўринг",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("998")) value = "998";
    value = "+998" + value.slice(3, 12);
    e.target.value = value;
    register("phone").onChange(e);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold">Заказ қабул қилинди</h3>
          <p className="text-muted-foreground mt-2">
            Раҳмат! Сиз билан боғланамиз
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Заказ бериш</DialogTitle>
          <DialogDescription>
            Маълумотларни тўлдиринг
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div>
            <Label>Исм *</Label>
            <Input {...register("customerName")} />
            {errors.customerName && (
              <p className="text-destructive text-sm">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <Label>Телефон *</Label>
            <Input {...register("phone")} onChange={handlePhoneChange} />
            {errors.phone && (
              <p className="text-destructive text-sm">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label>Вилоят *</Label>
            <Select onValueChange={(v) => setValue("region", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Танланг" />
              </SelectTrigger>
              <SelectContent>
                {UZBEKISTAN_REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.region && (
              <p className="text-destructive text-sm">
                {errors.region.message}
              </p>
            )}
          </div>
          {/* Order items list */}
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


          <div className="p-4 bg-secondary/40 rounded-lg">
            <div className="flex justify-between font-semibold">
              <span>Жами:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Юборилмоқда
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Заказни юбориш
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
