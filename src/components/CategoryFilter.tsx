import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Grid3X3, 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  Sparkles,
  LucideIcon 
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Grid3X3,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
};

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Grid3X3;
        const isActive = selectedCategory === category.id;
        
        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "secondary"}
            size="sm"
            onClick={() => onSelectCategory(category.id)}
            className={`flex-shrink-0 gap-2 ${
              isActive ? "" : "hover:bg-accent"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{category.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
