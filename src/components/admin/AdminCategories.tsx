import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  DbCategory,
} from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const ICON_OPTIONS = [
  "Package",
  "Smartphone",
  "Shirt",
  "Home",
  "Dumbbell",
  "Sparkles",
  "Gift",
  "Car",
  "Book",
  "Music",
];

export function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "Package",
    sort_order: "0",
  });

  const resetForm = () => {
    setFormData({ name: "", icon: "Package", sort_order: "0" });
    setEditingCategory(null);
  };

  const openEditDialog = (category: DbCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || "Package",
      sort_order: String(category.sort_order || 0),
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      name: formData.name,
      icon: formData.icon,
      sort_order: parseInt(formData.sort_order) || 0,
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, ...categoryData });
        toast({ title: "Категория янгиланди" });
      } else {
        await createCategory.mutateAsync(categoryData);
        toast({ title: "Категория қўшилди" });
      }
      setIsOpen(false);
      resetForm();
    } catch (err) {
      toast({ title: "Хатолик", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Категорияни ўчиришни тасдиқланг")) return;

    try {
      await deleteCategory.mutateAsync(id);
      toast({ title: "Категория ўчирилди" });
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
        <h2 className="text-xl font-semibold">Категориялар ({categories?.length || 0})</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Категория қўшиш
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Категорияни таҳрирлаш" : "Янги категория"}
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
                <Label>Иконка</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {ICON_OPTIONS.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={formData.icon === icon ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Тартиб рақами</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createCategory.isPending || updateCategory.isPending}>
                {(createCategory.isPending || updateCategory.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editingCategory ? "Сақлаш" : "Қўшиш"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Иконка</TableHead>
              <TableHead>Номи</TableHead>
              <TableHead>Тартиб</TableHead>
              <TableHead className="text-right">Амаллар</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-mono text-sm">{category.icon}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.sort_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Категориялар йўқ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
