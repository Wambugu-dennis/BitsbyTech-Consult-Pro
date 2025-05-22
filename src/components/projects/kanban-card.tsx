import type { ProjectTask } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KanbanCardProps {
  task: ProjectTask;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium">{task.title}</CardTitle>
        {task.description && (
          <CardDescription className="text-xs line-clamp-2">{task.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2 text-xs text-muted-foreground">
        {task.assignee && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://placehold.co/40x40.png?text=${task.assignee.substring(0,1)}`} alt={task.assignee} data-ai-hint="avatar person" />
              <AvatarFallback>{task.assignee.substring(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{task.assignee}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            <span>Due: {task.dueDate}</span>
          </div>
        )}
      </CardContent>
      {/* Example of a simple footer, could be used for tags or priority */}
      {/* <CardFooter className="p-4 pt-0">
        <Badge variant="outline">UX</Badge>
      </CardFooter> */}
    </Card>
  );
}
