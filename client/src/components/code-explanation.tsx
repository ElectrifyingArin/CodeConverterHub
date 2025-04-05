import { useState } from "react";
import { ConvertCodeResponse } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeExplanationProps {
  explanation: ConvertCodeResponse["explanation"] | null;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function CodeExplanation({
  explanation,
  expanded,
  onToggleExpand,
}: CodeExplanationProps) {
  const [activeTab, setActiveTab] = useState("step-by-step");
  const { toast } = useToast();

  const copyExplanation = () => {
    if (!explanation) return;
    
    let content = "";
    if (activeTab === "step-by-step") {
      content = explanation.stepByStep
        .map(step => `${step.title}\n${step.explanation}`)
        .join("\n\n");
    } else if (activeTab === "high-level") {
      content = explanation.highLevel;
    } else if (activeTab === "language-differences") {
      content = explanation.languageDifferences;
    }
    
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Explanation has been copied to your clipboard",
    });
  };

  if (!explanation) return null;

  return (
    <Card className="bg-white dark:bg-slate-800 rounded-lg shadow">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-medium">Code Conversion Explanation</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleExpand} 
            className="text-xs px-2 py-1 h-auto rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            {expanded ? "Compact View" : "Full View"}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyExplanation} 
            className="h-7 w-7 p-1 text-slate-500 hover:text-primary" 
            title="Copy explanation"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="step-by-step" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-slate-200 dark:border-slate-700 px-4 w-full justify-start rounded-none">
          <TabsTrigger value="step-by-step" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
            Step-by-Step
          </TabsTrigger>
          <TabsTrigger value="high-level" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
            High-Level Summary
          </TabsTrigger>
          <TabsTrigger value="language-differences" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
            Language Differences
          </TabsTrigger>
        </TabsList>
        
        <div className={`p-4 overflow-auto ${expanded ? '' : 'max-h-96'}`}>
          <TabsContent value="step-by-step" className="mt-0 space-y-4">
            {explanation.stepByStep.map((step, index) => (
              <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                <h5 className="font-medium text-sm mb-2 text-primary">{step.title}</h5>
                <div className="flex flex-col md:flex-row gap-4 text-sm">
                  <div className="flex-1">
                    <div className="font-mono text-xs mb-2 bg-white dark:bg-slate-800 p-2 rounded">{step.sourceCode}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs mb-2 bg-white dark:bg-slate-800 p-2 rounded">{step.targetCode}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {step.explanation}
                </p>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="high-level" className="mt-0">
            <div className="prose dark:prose-invert max-w-none">
              <p>{explanation.highLevel}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="language-differences" className="mt-0">
            <div className="prose dark:prose-invert max-w-none">
              <p>{explanation.languageDifferences}</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
