import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, X, Check, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Game() {
  const [, setLocation] = useLocation();
  
  // Game State
  const [teams, setTeams] = useState<{id: number, name: string, score: number}[]>([]);
  const [questions, setQuestions] = useState<{id: number, text: string, answer: string}[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialization
  useEffect(() => {
    // Load data
    const storedTeams = JSON.parse(localStorage.getItem('challenge_teams') || '[]');
    const storedQuestions = JSON.parse(localStorage.getItem('challenge_questions') || '[]');
    
    if (storedTeams.length === 0 || storedQuestions.length === 0) {
      // Fallback defaults if user skipped setup
      setTeams([
        { id: 1, name: "الفريق الأول", score: 0 },
        { id: 2, name: "الفريق الثاني", score: 0 }
      ]);
      setQuestions([
        { id: 1, text: "ما هي عاصمة السعودية؟", answer: "الرياض" },
        { id: 2, text: "من هو هداف كأس العالم 2022؟", answer: "كيليان مبابي" },
        { id: 3, text: "كم عدد ألوان قوس قزح؟", answer: "7 ألوان" }
      ]);
    } else {
      setTeams(storedTeams.map((t: any) => ({...t, score: 0})));
      setQuestions(storedQuestions);
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      // Time's up sound effect logic here
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const handleAnswer = (correct: boolean) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (correct) {
      // Update score
      const newTeams = [...teams];
      newTeams[currentTeamIndex].score += 1;
      setTeams(newTeams);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b'] // Gold colors
      });
    }

    // Next question logic
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        // Switch team
        setCurrentTeamIndex(prev => (prev + 1) % teams.length);
        // Reset timer
        setTimeLeft(30);
        setShowAnswer(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const restartGame = () => {
    setGameFinished(false);
    setCurrentQuestionIndex(0);
    setCurrentTeamIndex(0);
    setTimeLeft(30);
    setTeams(teams.map(t => ({...t, score: 0})));
    setIsPlaying(false);
    setShowAnswer(false);
  };

  if (gameFinished) {
    const winner = [...teams].sort((a, b) => b.score - a.score)[0];
    const isTie = teams.every(t => t.score === winner.score);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-tajawal relative overflow-hidden">
        <div className="text-center space-y-8 z-10">
          <Trophy className="w-32 h-32 text-primary mx-auto animate-bounce" />
          <h1 className="text-5xl font-black text-white font-cairo mb-4">
            {isTie ? "تعادل!" : `الفائز: ${winner.name}`}
          </h1>
          
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {teams.map(team => (
              <Card key={team.id} className={`bg-card/50 border-primary/20 ${winner.id === team.id && !isTie ? 'ring-2 ring-primary' : ''}`}>
                <div className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-2">{team.name}</div>
                  <div className="text-4xl font-bold text-primary">{team.score}</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={restartGame} size="lg" className="bg-primary text-primary-foreground font-bold">
              <RotateCcw className="mr-2 w-5 h-5" /> لعبة جديدة
            </Button>
            <Button onClick={() => setLocation("/")} variant="outline" size="lg">
              الخروج
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentTeam = teams[currentTeamIndex];

  if (!currentQuestion) return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;

  return (
    <div className="min-h-screen flex flex-col p-4 font-tajawal relative">
      {/* Header / Scoreboard */}
      <div className="flex justify-between items-start mb-6 bg-card/30 p-4 rounded-2xl backdrop-blur-md border border-white/5">
        {teams.map((team, idx) => (
          <div 
            key={team.id} 
            className={`flex flex-col items-center px-6 py-2 rounded-xl transition-all duration-500 ${
              idx === currentTeamIndex 
                ? 'bg-primary/20 border border-primary/50 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.2)]' 
                : 'opacity-60'
            }`}
          >
            <span className={`text-sm font-medium ${idx === currentTeamIndex ? 'text-primary' : 'text-muted-foreground'}`}>
              {team.name}
            </span>
            <span className="text-3xl font-black font-mono">{team.score}</span>
          </div>
        ))}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full space-y-8">
        
        {/* Timer */}
        <div className="relative group">
          <div className={`absolute inset-0 bg-primary rounded-full blur-2xl opacity-20 transition-opacity duration-300 ${timeLeft <= 10 ? 'animate-pulse bg-destructive' : ''}`}></div>
          <div className={`
            w-40 h-40 rounded-full border-8 flex items-center justify-center bg-background relative z-10 shadow-2xl
            ${timeLeft <= 10 ? 'border-destructive text-destructive' : 'border-primary text-primary'}
            transition-colors duration-500
          `}>
            <span className="text-6xl font-black font-mono tracking-tighter">
              {timeLeft}
            </span>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
             {!isPlaying && timeLeft > 0 && timeLeft < 30 && (
                <span className="bg-background border border-border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Paused</span>
             )}
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <Card className="bg-card/80 border-primary/10 backdrop-blur-md overflow-hidden">
              <div className="h-2 bg-secondary w-full">
                <motion.div 
                  className="h-full bg-primary" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <div className="p-8 min-h-[240px] flex flex-col items-center justify-center text-center space-y-6">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                    سؤال {currentQuestionIndex + 1} من {questions.length}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight font-cairo">
                    {currentQuestion.text}
                  </h2>
                </div>

                {showAnswer && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-primary/10 text-primary px-6 py-3 rounded-lg font-bold text-xl border border-primary/20"
                  >
                    {currentQuestion.answer}
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {!isPlaying && timeLeft === 30 ? (
             <Button 
              className="col-span-4 h-16 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all"
              onClick={startGame}
            >
              <Timer className="mr-2 w-6 h-6" /> ابدأ المؤقت
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="h-14 text-lg border-primary/20 hover:bg-primary/10 hover:text-primary"
                onClick={toggleAnswer}
              >
                {showAnswer ? "إخفاء الإجابة" : "كشف الإجابة"}
              </Button>
              
              <Button 
                variant="secondary" 
                className="h-14 text-lg"
                onClick={isPlaying ? pauseGame : startGame}
              >
                {isPlaying ? "إيقاف مؤقت" : "استئناف"}
              </Button>
              
              <Button 
                className="h-14 text-lg bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => handleAnswer(false)}
              >
                <X className="mr-2 w-5 h-5" /> إجابة خاطئة
              </Button>
              
              <Button 
                className="h-14 text-lg bg-green-600 hover:bg-green-500 text-white"
                onClick={() => handleAnswer(true)}
              >
                <Check className="mr-2 w-5 h-5" /> إجابة صحيحة
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}