import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const authSchema = z.object({
  email: z.string().email("Email манзил нотўғри"),
  password: z.string().min(6, "Парол камида 6 та белги"),
  fullName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Хатолик",
              description: "Email ёки парол нотўғри",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Хатолик",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }
        toast({
          title: "Муваффақият",
          description: "Тизимга кирдингиз",
        });
      } else {
        const { error } = await signUp(data.email, data.password, data.fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Хатолик",
              description: "Бу email аллақачон рўйхатдан ўтган",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Хатолик",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }
        toast({
          title: "Муваффақият",
          description: "Рўйхатдан ўтдингиз!",
        });
      }
      navigate("/");
    } catch (err) {
      toast({
        title: "Хатолик",
        description: "Нимадир нотўғри кетди",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Бош саҳифага қайтиш
        </Link>

        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? "Кириш" : "Рўйхатдан ўтиш"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Ҳисобингизга киринг"
                : "Янги ҳисоб яратинг"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Исм</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Исмингиз"
                      className="pl-10"
                      {...register("fullName")}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Парол</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    className="pl-10"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Юкланмоқда...
                  </>
                ) : isLogin ? (
                  "Кириш"
                ) : (
                  "Рўйхатдан ўтиш"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? "Ҳисобингиз йўқми? Рўйхатдан ўтинг"
                  : "Ҳисобингиз борми? Киринг"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
