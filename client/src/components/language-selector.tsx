import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedLanguages } from "@/lib/supported-languages";
import { Label } from "@/components/ui/label";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  excludeValue?: string;
}

export function LanguageSelector({
  value,
  onChange,
  label,
  excludeValue,
}: LanguageSelectorProps) {
  const id = useId();
  
  // Filter out the excluded value if provided
  const filteredLanguages = excludeValue 
    ? supportedLanguages.filter(lang => lang.id !== excludeValue)
    : supportedLanguages;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {filteredLanguages.map((language) => (
            <SelectItem key={language.id} value={language.id}>
              {language.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
