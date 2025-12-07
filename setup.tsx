import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock storage helper (in a real app this would be a context or persistent store)
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getFromStorage = (key: string, defaultVal: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

export default function Setup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [teams, setTeams] = useState<{id: number, name: string}[]>([
    { id: 1, name: "الفريق الأول" },
    { id: 2, name: "الفريق الثاني" }
  ]);

  const [questions, setQuestions] = useState<{id: number, text: string, answer: string}[]>([]);

  useEffect(() => {
    const savedTeams = getFromStorage('challenge_teams', teams);
    const savedQuestions = getFromStorage('challenge_questions', [
      { id: 1, text: "ما هي عاصمة السعودية؟", answer: "الرياض" },
      { id: 2, text: "من هو هداف كأس العالم 2022؟", answer: "كيليان مبابي" },
      { id: 3, text: "كم عدد ألوان قوس قزح؟", answer: "7 ألوان" }
    ]);
    
    setTeams(savedTeams);
    setQuestions(savedQuestions);
  }, []);

  const addTeam = () => {
    if (teams.length >= 4) {
      toast({ title: "تنبيه", description: "الحد الأقصى 4 فرق", variant: "destructive" });
      return;
    }
    setTeams([...teams, { id: Date.now(), name: `فريق ${teams.length + 1}` }]);
  };

  const removeTeam = (id: number) => {
    if (teams.length <= 1) return;
    setTeams(teams.filter(t => t.id !== id));
  };

  const updateTeamName = (id: number, name: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, name } : t));
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: "", answer: "" }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: 'text' | 'answer', value: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleSave = () => {
    saveToStorage('challenge_teams', teams);
    saveToStorage('challenge_questions', questions);
    toast({ title: "تم الحفظ", description: "تم حفظ الإعدادات بنجاح" });
    setLocation("/");
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto font-tajawal">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary font-cairo">إعدادات التحدي</h1>
        <Button variant="ghost" onClick={() => setLocation("/")}>
          العودة للرئيسية <ArrowRight className="mr-2 w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/50 p-1 rounded-xl">
          <TabsTrigger value="teams" className="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">الفرق والمتسابقين</TabsTrigger>
          <TabsTrigger value="questions" className="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">بنك الأسئلة</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">قائمة الفرق</h2>
                <Button onClick={addTeam} variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                  <Plus className="w-4 h-4 ml-2" /> إضافة فريق
                </Button>
              </div>
              
              <div className="grid gap-4">
                {teams.map((team, index) => (
                  <div key={team.id} className="flex gap-2 items-end animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid w-full gap-1.5">
                      <Label>اسم الفريق {index + 1}</Label>
                      <Input 
                        value={team.name} 
                        onChange={(e) => updateTeamName(team.id, e.target.value)}
                        className="bg-background/50 border-primary/20 focus-visible:ring-primary"
                      />
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => removeTeam(team.id)}
                      disabled={teams.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card className="bg-card/50 border-primary/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">الأسئلة ({questions.length})</h2>
                <Button onClick={addQuestion} variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                  <Plus className="w-4 h-4 ml-2" /> سؤال جديد
                </Button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {questions.map((q, index) => (
                  <div key={q.id} className="p-4 rounded-lg border border-primary/10 bg-background/30 space-y-3 relative group hover:border-primary/30 transition-all">
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => removeQuestion(q.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-primary/80">السؤال {index + 1}</Label>
                      <Textarea 
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                        placeholder="أدخل نص السؤال هنا..."
                        className="bg-background/50 resize-none border-primary/10 focus-visible:ring-primary min-h-[60px]"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-sm">الإجابة الصحيحة</Label>
                      <Input 
                        value={q.answer}
                        onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                        placeholder="الإجابة..."
                        className="bg-background/50 border-primary/10 h-9"
                      />
                    </div>
                  </div>
                ))}
                
                {questions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-primary/10 rounded-xl">
                    لا توجد أسئلة بعد. أضف سؤالك الأول!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-6 left-6 right-6 max-w-4xl mx-auto">
        <Button 
          size="lg" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg shadow-lg shadow-primary/20"
          onClick={handleSave}
          data-testid="button-save-setup"
        >
          <Save className="ml-2 w-5 h-5" />
          حفظ وبدء اللعب
        </Button>
      </div>
    </div>
  );
}