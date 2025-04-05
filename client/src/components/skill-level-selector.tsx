import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SkillLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SkillLevelSelector({
  value,
  onChange,
}: SkillLevelSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Explanation Level</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="beginner" id="beginner" />
          <Label htmlFor="beginner" className="font-normal">Beginner</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="intermediate" id="intermediate" />
          <Label htmlFor="intermediate" className="font-normal">Intermediate</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="advanced" id="advanced" />
          <Label htmlFor="advanced" className="font-normal">Advanced</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
