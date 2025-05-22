import KanbanBoard from "@/components/projects/kanban-board";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Tracker</h1>
          <p className="text-muted-foreground">
            Visualize and manage your project workflows.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </header>
      <KanbanBoard />
    </div>
  );
}
