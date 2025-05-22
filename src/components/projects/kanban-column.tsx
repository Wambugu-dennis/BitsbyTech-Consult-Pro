import type { ProjectTask, ProjectStatusValue } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KanbanCard from "./kanban-card";
import { ScrollArea } from "../ui/scroll-area";

interface KanbanColumnProps {
  title: ProjectStatusValue;
  tasks: ProjectTask[];
}

export default function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          {title}
          <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">{tasks.length}</span>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-4 h-full p-4 pt-0">
          {tasks.length > 0 ? (
            tasks.map(task => <KanbanCard key={task.id} task={task} />)
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks in this stage.</p>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
