
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  isLoading?: boolean;
}

export const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  isLoading 
}: TaskCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  console.log('TaskCard render - Task ID:', task.id, 'Completed:', task.completed);

  const handleToggleComplete = () => {
    console.log('Toggle complete clicked - Task ID:', task.id, 'Current completed:', task.completed, 'New completed:', !task.completed);
    onToggleComplete(task.id, !task.completed);
  };

  return (
    <Card className={`transition-all duration-200 ${
      task.completed 
        ? 'opacity-70 bg-muted/50 border-green-500 border-2' 
        : ''
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.description && (
          <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-gray-600'}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${task.completed ? 'text-muted-foreground' : 'text-gray-500'}`}>
            Entrega: {formatDate(task.dueDate)}
          </span>
          
          {task.completed && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Concluída
            </span>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          {!task.completed && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={handleToggleComplete}
                disabled={isLoading}
                className="h-8"
              >
                <Check className="h-4 w-4 mr-1" />
                Concluir
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(task)}
                disabled={isLoading}
                className="h-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="h-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
