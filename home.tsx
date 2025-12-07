import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Trophy, Mic } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center space-y-8 max-w-md w-full"
      >
        <div className="space-y-2">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Trophy className="w-24 h-24 text-primary relative z-10" />
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white drop-shadow-2xl font-cairo">
            تحدي <span className="text-primary text-glow">المعلومات</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            اختبر معلوماتك، نافس أصدقاءك، وتحدى الوقت
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 box-glow">
          <CardContent className="p-6 space-y-4">
            <Button 
              size="lg" 
              className="w-full text-xl font-bold h-16 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
              onClick={() => setLocation("/game")}
              data-testid="button-start-game"
            >
              <Play className="ml-2 w-6 h-6" />
              ابدأ التحدي
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full text-lg font-semibold h-14 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
              onClick={() => setLocation("/setup")}
              data-testid="button-setup"
            >
              <Settings className="ml-2 w-5 h-5" />
              إعداد الأسئلة والفرق
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Mic className="w-4 h-4" />
            مؤثرات صوتية
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            نظام نقاط
          </span>
        </div>
      </motion.div>
    </div>
  );
}