
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import styles from "./index.module.css";

export const KanbanBoard = ({
  onDragEnd,
  children,
}) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event) => {
    if (event.over === null) {
      return;
    }

    onDragEnd(event);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          {children}
        </DndContext>
      </div>
    </div>
  );
};

export const KanbanBoardSkeleton = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};
