import { useMemo } from "react";

import {
  useDelete,
  useList,
  useNavigation,
  useUpdate,
  useUpdateMany,
} from "@refinedev/core";

import { ClearOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import {
  KanbanAddCardButton,
  KanbanAddStageButton,
  KanbanBoard,
  KanbanBoardSkeleton,
  KanbanColumn,
  KanbanColumnSkeleton,
  KanbanItem,
  ProjectCardMemo,
  ProjectCardSkeleton,
} from "../components";
import { KANBAN_TASK_STAGES_QUERY, KANBAN_TASKS_QUERY } from "./queries";

export const KanbanPage = ({ children }) => {
  const { create, edit, replace } = useNavigation();

  const { data: stages, isLoading: isLoadingStages } = useList({
    resource: "taskStages",
    pagination: {
      mode: "off",
    },
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: KANBAN_TASK_STAGES_QUERY,
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useList({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    queryOptions: {
      enabled: !!stages,
    },
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: KANBAN_TASKS_QUERY,
    },
  });

  const taskStages = useMemo(() => {
    if (!tasks?.data || !stages?.data)
      return {
        unassignedStage: [],
        stages: [],
      };

    const unassignedStage = tasks.data.filter((task) => task.stageId === null);

    const grouped = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }));

    return {
      unassignedStage,
      stages: grouped,
    };
  }, [tasks, stages]);

  const { mutate: updateTask } = useUpdate({
    resource: "tasks",
    successNotification: false,
    mutationMode: "optimistic",
  });
  const { mutate: updateManyTask } = useUpdateMany({
    resource: "tasks",
    successNotification: false,
  });
  const { mutate: deleteStage } = useDelete();

  const handleOnDragEnd = (event) => {
    let stageId = event.over?.id ?? null;
    const taskId = event.active.id;
    const taskStageId = event.active.data.current.stageId;

    if (taskStageId === stageId) {
      return;
    }

    if (stageId === "unassigned") {
      stageId = null;
    }

    updateTask({
      id: taskId,
      values: {
        stageId: stageId,
      },
    });
  };

  const handleAddStage = () => {
    create("taskStages", "replace");
  };

  const handleEditStage = ({ stageId }) => {
    edit("taskStages", stageId);
  };

  const handleDeleteStage = ({ stageId }) => {
    deleteStage({
      resource: "taskStage",
      id: stageId,
      successNotification: () => ({
        key: "delete-stage",
        type: "success",
        message: "Successfully deleted stage",
        description: "Successful",
      }),
    });
  };

  const handleAddCard = ({ stageId }) => {
    const path =
      stageId === "unassigned"
        ? "create"
        : `create?stageId=${stageId}`;

    replace(path);
  };

  const handleClearCards = ({ taskIds }) => {
    updateManyTask({
      ids: taskIds,
      values: {
        stageId: null,
      },
    });
  };

  const getContextMenuItems = (column) => {
    const hasItems = column.tasks.length > 0;

    const items = [
      {
        label: "Edit status",
        key: "1",
        icon: <EditOutlined />,
        onClick: () => handleEditStage({ stageId: column.id }),
      },
      {
        label: "Clear all cards",
        key: "2",
        icon: <ClearOutlined />,
        disabled: !hasItems,
        onClick: () =>
          handleClearCards({
            taskIds: column.tasks.map((task) => task.id),
          }),
      },
      {
        danger: true,
        label: "Delete status",
        key: "3",
        icon: <DeleteOutlined />,
        disabled: hasItems,
        onClick: () => handleDeleteStage({ stageId: column.id }),
      },
    ];

    return items;
  };

  const isLoading = isLoadingTasks || isLoadingStages;

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <KanbanBoard onDragEnd={handleOnDragEnd}>
        <KanbanColumn
          id={"unassigned"}
          title={"unassigned"}
          count={taskStages.unassignedStage.length || 0}
          onAddClick={() => handleAddCard({ stageId: "unassigned" })}
        >
          {taskStages.unassignedStage.map((task) => (
            <KanbanItem
              key={task.id}
              id={task.id}
              data={{ ...task, stageId: "unassigned" }}
            >
              <ProjectCardMemo {...task} />
            </KanbanItem>
          ))}
          {!taskStages.unassignedStage.length && (
            <KanbanAddCardButton
              onClick={() => handleAddCard({ stageId: "unassigned" })}
            />
          )}
        </KanbanColumn>
        {taskStages.stages.map((column) => {
          const contextMenuItems = getContextMenuItems(column);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
              contextMenuItems={contextMenuItems}
              onAddClick={() => handleAddCard({ stageId: column.id })}
            >
              {isLoading && <ProjectCardSkeleton />}
              {!isLoading &&
                column.tasks.map((task) => (
                  <KanbanItem
                    key={task.id}
                    id={task.id}
                    data={{
                      ...task,
                      stageId: column.id,
                    }}
                  >
                    <ProjectCardMemo {...task} />
                  </KanbanItem>
                ))}
              {!column.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          );
        })}
        <KanbanAddStageButton onClick={handleAddStage} />
      </KanbanBoard>
      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardSkeleton>
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanColumnSkeleton key={index} type="project">
          {Array.from({ length: itemCount }).map((_, itemIndex) => (
            <ProjectCardSkeleton key={itemIndex} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardSkeleton>
  );
};
