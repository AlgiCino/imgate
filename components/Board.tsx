'use client';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Header from './Header';

interface Project {
  id: string;
  title: string;
  developer: string;
  location: string;
  price: string;
  image: string;
  status?: string;
}

interface Column {
  id: string;
  title: string;
  projectIds: string[];
}

interface BoardState {
  projects: { [key: string]: Project };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

const initialColumns = {
  'interested': { id: 'interested', title: 'Interested', projectIds: [] },
  'shortlisted': { id: 'shortlisted', title: 'Shortlisted', projectIds: [] },
  'contacted': { id: 'contacted', title: 'Contacted', projectIds: [] },
  'visiting': { id: 'visiting', title: 'Visiting', projectIds: [] },
};

export default function Board() {
  const [boardState, setBoardState] = useState<BoardState>({
    projects: {},
    columns: initialColumns,
    columnOrder: ['interested', 'shortlisted', 'contacted', 'visiting'],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoardState();
    loadProjects();
  }, []);

  const loadBoardState = () => {
    const saved = localStorage.getItem('boardState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBoardState(prev => ({ ...prev, columns: parsed.columns || initialColumns }));
      } catch (error) {
        console.error('Failed to load board state:', error);
      }
    }
  };

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/dubai/projects');
      if (res.ok) {
        const data = await res.json();
        const projectsMap: { [key: string]: Project } = {};
        (data.projects || []).forEach((p: Project) => {
          projectsMap[p.id] = p;
        });
        setBoardState(prev => ({ ...prev, projects: projectsMap }));
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBoardState = (state: BoardState) => {
    localStorage.setItem('boardState', JSON.stringify({ columns: state.columns }));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const startColumn = boardState.columns[source.droppableId];
    const endColumn = boardState.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newProjectIds = Array.from(startColumn.projectIds);
      newProjectIds.splice(source.index, 1);
      newProjectIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        projectIds: newProjectIds,
      };

      const newState = {
        ...boardState,
        columns: {
          ...boardState.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoardState(newState);
      saveBoardState(newState);
      return;
    }

    const startProjectIds = Array.from(startColumn.projectIds);
    startProjectIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      projectIds: startProjectIds,
    };

    const endProjectIds = Array.from(endColumn.projectIds);
    endProjectIds.splice(destination.index, 0, draggableId);
    const newEndColumn = {
      ...endColumn,
      projectIds: endProjectIds,
    };

    const newState = {
      ...boardState,
      columns: {
        ...boardState.columns,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      },
    };

    setBoardState(newState);
    saveBoardState(newState);
  };

  const addToBoard = (projectId: string, columnId: string) => {
    const column = boardState.columns[columnId];
    if (column.projectIds.includes(projectId)) return;

    const newProjectIds = [...column.projectIds, projectId];
    const newColumn = {
      ...column,
      projectIds: newProjectIds,
    };

    const newState = {
      ...boardState,
      columns: {
        ...boardState.columns,
        [newColumn.id]: newColumn,
      },
    };

    setBoardState(newState);
    saveBoardState(newState);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-gold mx-auto mb-4"></div>
            <p className="text-white/60">Loading board...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-8">Project Board</h1>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boardState.columnOrder.map((columnId) => {
                const column = boardState.columns[columnId];
                const projects = column.projectIds.map((id) => boardState.projects[id]).filter(Boolean);

                return (
                  <div key={column.id} className="glass-strong rounded-2xl p-4">
                    <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[500px] space-y-3 ${
                            snapshot.isDraggingOver ? 'bg-white/5 rounded-lg' : ''
                          }`}
                        >
                          {projects.map((project, index) => (
                            <Draggable key={project.id} draggableId={project.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`glass rounded-lg p-3 ${
                                    snapshot.isDragging ? 'opacity-50' : ''
                                  }`}
                                >
                                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                                    {project.title}
                                  </h3>
                                  <p className="text-xs text-white/70 mb-1">{project.developer}</p>
                                  <p className="text-xs text-brand-gold">{project.price}</p>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
