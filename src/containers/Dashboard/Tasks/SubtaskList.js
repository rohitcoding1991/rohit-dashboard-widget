import React from "react";
import { useHistory } from "react-router-dom";
import { List } from "@material-ui/core";
import SubtaskListItem from "./SubtaskListItem";

const funnelTypes = {
  onboarding: "onboarding",
  offboarding: "offboarding",
  mission: "missions"
};

const backendFunnelTypesToFEType = (beType) => funnelTypes[beType];

/**
 * @param task
 * @param subtasks
 * @param onUploadSuccess
 * @param isProgressMode
 * @return {JSX.Element|null}
 * @constructor
 */
const SubtaskList = ({
  task,
  subtasks,
  onUploadSuccess = () => {},
  isProgressMode = false
}) => {
  const history = useHistory();

  /**
   * Task is Funnel
   * Subtask is Funnel Task
   *
   * @param task
   * @param subtask
   */
  const onClickHandler = (task, subtask) => {
    if (!subtask) {
      throw "impossible";
    }
    const taskMainPath = backendFunnelTypesToFEType(task.funnel.type);

    if (isProgressMode) {
      history.push(`/${taskMainPath}/progress/${task.id}/${subtask.id}`);
    } else {
      history.push(`/${taskMainPath}/${task.id}/${subtask.id}`);
    }
  };

  if (!subtasks) {
    return null;
  }

  if (subtasks && subtasks.length === 0) {
    return null;
  }

  return (
    <List>
      {subtasks.map((subtask, i) => {
        return (
          <SubtaskListItem
            key={`Key_${i}_${subtask.id}`}
            subtask={subtask}
            onUploadSuccess={onUploadSuccess}
            onClick={() => onClickHandler(task, subtask)}
            isProgressMode={isProgressMode}
          />
        );
      })}
    </List>
  );
};

export default SubtaskList;
