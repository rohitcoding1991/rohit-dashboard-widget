import React from "react";
import {
  ListItemText,
  ListItem,
  ListItemSecondaryAction,
} from "@material-ui/core";
import TaskActionButton from "./TaskActionButton";

const SubtaskListItem = ({
  subtask,
  onClick,
  onUploadSuccess = () => {},
  isProgressMode = false,
}) => {
  const [status, setStatus] = React.useState(subtask.status);

  return (
    <React.Fragment>
      <ListItem button onClick={onClick}>
        <ListItemText
          primary={subtask.task_funnel_subscription.task.name}
          secondary={subtask.task_funnel_subscription.task.description}
        />
        <ListItemSecondaryAction>
          <TaskActionButton
            efts={subtask}
            attachments={subtask?.attachments || []}
            status={status}
            onActionSuccess={onClick}
            onUploadSuccess={onUploadSuccess}
            onStatusChange={setStatus}
            showUploadButtons={true}
            showCompletedMessage={true}
            isProgressMode={isProgressMode}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
};

export default SubtaskListItem;
