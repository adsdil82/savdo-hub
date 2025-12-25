import { useState } from "react";
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  DbProduct,
} from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatPrice } from "@/data/products";

export function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category_id: "",
    description: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      image: "",
      category_id: "",
      description: "",
      is_active: true,
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: DbProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      image: product.image || "",
      category_id: product.category_id || "",
      description: product.description || "",
      is_active: product.is_active ?? true,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      price: parseInt(formData.price) || 0,
      image: formData.image || null,
      category_id: formData.category_id || null,
      description: formData.description || null,
      is_active: formData.is_active,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
        toast({ title: "Товар янгиланди" });
      } else {
        await createProduct.mutateAsync(productData);
        toast({ title: "Товар қўшилди" });
      }
      setIsOpen(false);
      resetForm();
    } catch (err) {
      toast({ title: "Хатолик", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Товарни ўчиришни тасдиқланг")) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Товар ўчирилди" });
    } catch (err) {
      toast({ title: "Хатолик", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Товарлар ({products?.length || 0})</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Товар қўшиш
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Товарни таҳрирлаш" : "Янги товар"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Номи *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Нархи (сўм) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Расм URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Категория</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(v) => setFormData({ ...formData, category_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Танланг" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Тавсиф</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Фаол</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>
                {(createProduct.isPending || updateProduct.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editingProduct ? "Сақлаш" : "Қўшиш"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Расм</TableHead>
              <TableHead>Номи</TableHead>
              <TableHead>Нархи</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Фаол</TableHead>
              <TableHead className="text-right">Амаллар</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.category?.name || "-"}</TableCell>
                <TableCell>
                  <Switch
                    checked={product.is_active ?? false}
                    onCheckedChange={(checked) =>
                      updateProduct.mutate({ id: product.id, is_active: checked })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Товарлар йўқ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
