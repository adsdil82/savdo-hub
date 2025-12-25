import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminCategories } from "@/components/admin/AdminCategories";
import { ArrowLeft, LogOut, ShoppingBag, Tags, Loader2 } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Рухсат йўқ</h1>
          <p className="text-muted-foreground mb-6">
            Админ панелга кириш учун админ ҳуқуқлари керак
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Бош саҳифага қайтиш
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Бош саҳифа
            </Link>
            <h1 className="text-xl font-bold">Админ панел</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Чиқиш
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Товарлар
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tags className="h-4 w-4" />
              Категориялар
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
