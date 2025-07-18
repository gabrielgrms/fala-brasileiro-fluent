import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { Task, CreateTaskRequest } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();

  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks();

  const handleCreateTask = (data: CreateTaskRequest) => {
    createTask(data, {
      onSuccess: () => {
        toast({
          title: "Sucesso!",
          description: "Tarefa criada com sucesso.",
        });
        setIsFormOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Erro ao criar tarefa: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdateTask = (data: CreateTaskRequest) => {
    if (!editingTask) return;
    
    updateTask(
      { id: editingTask.id, updates: data },
      {
        onSuccess: () => {
          toast({
            title: "Sucesso!",
            description: "Tarefa atualizada com sucesso.",
          });
          setEditingTask(undefined);
        },
        onError: (error) => {
          toast({
            title: "Erro",
            description: "Erro ao atualizar tarefa: " + error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      deleteTask(id, {
        onSuccess: () => {
          toast({
            title: "Sucesso!",
            description: "Tarefa deletada com sucesso.",
          });
        },
        onError: (error) => {
          toast({
            title: "Erro",
            description: "Erro ao deletar tarefa: " + error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleToggleComplete = (id: string, status: 'pendente' | 'concluida') => {
    toggleComplete(id, status);
    toast({
      title: status === 'concluida' ? "Tarefa concluída!" : "Tarefa reaberta",
      description: status === 'concluida' 
        ? "Parabéns por concluir a tarefa!" 
        : "Tarefa marcada como pendente.",
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Erro ao carregar tarefas</h2>
          <p>Verifique se sua API está rodando e tente novamente.</p>
          <p className="text-sm mt-2">Erro: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciador de Tarefas</h1>
            <p className="text-muted-foreground mt-1">
              {tasks.length === 0 
                ? "Nenhuma tarefa encontrada" 
                : `${tasks.length} tarefa${tasks.length !== 1 ? 's' : ''} encontrada${tasks.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando tarefas...</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Você ainda não tem nenhuma tarefa. Que tal criar a primeira?
            </p>
            <Button onClick={() => setIsFormOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira tarefa
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                isLoading={isUpdating || isDeleting}
              />
            ))}
          </div>
        )}

        <TaskForm
          isOpen={isFormOpen || !!editingTask}
          onClose={handleCloseForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
          isLoading={isCreating || isUpdating}
        />
      </div>
    </div>
  );
};

export default Index;
