import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeConverter } from "@/components/code-converter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Code Converter</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Convert code between 15+ programming languages with detailed explanations.
          </p>
        </div>
        
        <CodeConverter />
      </main>
      
      <SiteFooter />
    </div>
  );
}
