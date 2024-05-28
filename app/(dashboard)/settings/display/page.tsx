import { Separator } from "@/components/ui/separator";
import { DisplayForm } from "./display-form";

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display</h3>
        <p className="text-sm text-muted-foreground">
          Customize your navigation menu by selecting which items to display.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  );
}
