"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, AlertTriangle, RefreshCcw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function ClickDaySimulator() {
  const t = useTranslations("ClickDayPage");
  const locale = useLocale();
  const [gameState, setGameState] = useState<
    "IDLE" | "PLAYING" | "WON" | "LOST"
  >("IDLE");
  const [timeLeft, setTimeLeft] = useState(30);

  const formSchema = z.object({
    fullName: z.string().min(2, t("errName")),
    passport: z.string().min(6, t("errPassport")),
    email: z.string().email(t("errEmail")),
    country: z.string().min(2, t("errCountry")),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Timer Logic
  useEffect(() => {
    if (gameState !== "PLAYING") return;
    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGameState("LOST");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState("PLAYING");
    setTimeLeft(30);
    form.reset();
  };

  const onSubmit = () => {
    setGameState("WON");
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Timer className="text-red-600" /> {t("title")}
        </h1>
        <p className="text-slate-600">{t("subtitle")}</p>
      </div>

      {/* GAME CARD */}
      <Card
        className={`border-2 transition-all ${
          gameState === "PLAYING"
            ? "border-red-500 shadow-red-100 shadow-lg"
            : "border-slate-200"
        }`}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("appForm")}</CardTitle>
            {gameState === "PLAYING" && (
              <span className="text-2xl font-mono font-bold text-red-600">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            )}
          </div>
          {gameState === "PLAYING" && (
            <Progress
              value={(timeLeft / 30) * 100}
              className="h-2 bg-slate-100"
              indicatorClassName="bg-red-500"
            />
          )}
        </CardHeader>
        <CardContent>
          {gameState === "IDLE" && (
            <div className="text-center py-10 space-y-4">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
              <p className="font-medium text-lg">{t("readyToRace")}</p>
              <Button
                onClick={startGame}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {t("startSim")}
              </Button>
            </div>
          )}

          {gameState === "PLAYING" && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 animate-in fade-in"
            >
              <div className="grid gap-2">
                <Input
                  placeholder={t("fullName")}
                  {...form.register("fullName")}
                  disabled={false}
                />
                <Input
                  placeholder={t("passport")}
                  {...form.register("passport")}
                />
                <Input
                  placeholder={t("email")}
                  type="email"
                  {...form.register("email")}
                />
                <Input
                  placeholder={t("country")}
                  {...form.register("country")}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {t("submit")}
              </Button>
            </form>
          )}

          {gameState === "LOST" && (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-50">
              <div className="text-6xl">❌</div>
              <h3 className="text-2xl font-bold text-slate-900">
                {t("quotaExceeded")}
              </h3>
              <p className="text-slate-600">{t("tooSlow")}</p>
              <Button onClick={startGame} variant="outline" className="gap-2">
                <RefreshCcw className="h-4 w-4" /> {t("tryAgain")}
              </Button>
            </div>
          )}

          {gameState === "WON" && (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-50">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-900">
                {t("appSubmitted")}
              </h3>
              <p className="text-slate-600">
                {t("beatTimer", { seconds: timeLeft })}
              </p>
              <Link href={`/${locale}`} className="block">
                <Button className="w-full">{t("returnDashboard")}</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
