import React from "react";
import {
  PlayArrow as PlayArrowIcon,
  Done as DoneIcon,
  CloudUpload as CloudUploadIcon,
} from "@material-ui/icons";
import { Typography, Tooltip, IconButton, Grid } from "@material-ui/core";
import RequestButton from "./RequestButton";
import FileUploadDialog from "./FileUploadDialog";
import { addAlert } from "../../../store/notifications";

const STATUS_COMPLETED = "completed";
const STATUS_STARTED_NOT_COMPLETED = "not_completed";
const STATUS_NOT_STARTED = "not_started";

const STATUS_UPLOADED = "uploaded";
const STATUS_PENDING = "pending";

const AttachmentUploadButton = ({ attachment, onFileSelected = () => {} }) => {
  const fileInputRef = React.useRef();

  const attachmentUploadHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    onFileSelected(file);

    event.target.value = null;
  };

  return (
    <>
      <Tooltip title={`${attachment.name}`}>
        <IconButton
          onClick={() => fileInputRef.current.click()}
          style={{ marginRight: 10 }}
        >
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>
      <input
        key={`attachment_input_${attachment.id}`}
        ref={fileInputRef}
        type="file"
        onChange={attachmentUploadHandler}
        accept={attachment?.accepts || ""}
        style={{ display: "none" }}
      />
    </>
  );
};

/**
 *
 * @param efts Employee Funnel Task Subscription
 * @param attachments
 * @param status
 * @param onStatusChange
 * @param showUploadButtons
 * @param onActionSuccess
 * @param onUploadSuccess
 * @param onActionFailed
 * @param showCompletedMessage
 * @param isProgressMode
 * @param props
 * @return {*[]}
 * @constructor
 */
const TaskActionButton = ({
  efts,
  attachments = [],
  status,
  onStatusChange = () => {},
  showUploadButtons = false,
  onActionSuccess = () => {},
  onUploadSuccess = () => {},
  onActionFailed = () => {},
  showCompletedMessage: inList = false,
  isProgressMode = false,
  ...props
}) => {
  const res = [];
  const [internalState, setInternalState] = React.useState(status);
  const [isAllRequiredAttachmentsUploaded, setAllRequiredAttachmentsUploaded] =
    React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [selectedAttachment, setSelectedAttachment] = React.useState(null);

  React.useEffect(() => {
    onStatusChange(internalState);
  }, [internalState]);

  React.useEffect(() => {
    if (attachments && attachments.length > 0) {
      const requiredFieldCount = attachments.filter(
        (attachment) => attachment.required === true
      ).length;

      let done = 0;
      attachments.forEach((attachment) => {
        if (attachment.required && attachment.status === STATUS_UPLOADED) {
          done++;
        }
      });

      if (done === requiredFieldCount) {
        setAllRequiredAttachmentsUploaded(true);
      } else {
        setAllRequiredAttachmentsUploaded(false);
      }
    } else {
      setAllRequiredAttachmentsUploaded(true);
    }
  }, [attachments]);

  if (isProgressMode) {
    if (internalState === STATUS_NOT_STARTED) {
      return (
        <Typography variant="caption" color="textSecondary">
          NOT STARTED
        </Typography>
      );
    }

    if (internalState === STATUS_STARTED_NOT_COMPLETED) {
      return (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-end"
        >
          <Typography variant="caption" color="textSecondary">
            NOT COMPLETED
          </Typography>
          {attachments && attachments.length > 0 && (
            <Typography variant="caption" color="textSecondary">
              All requirement attachments{" "}
              <strong>
                {isAllRequiredAttachmentsUploaded ? "uploaded" : "not uploaded"}
              </strong>
            </Typography>
          )}
        </Grid>
      );
    }

    if (internalState === STATUS_COMPLETED) {
      return (
        <Typography variant="caption" color="textSecondary">
          TASK COMPLETED
        </Typography>
      );
    }

    return "";
  }

  if (internalState === STATUS_NOT_STARTED && efts["is_startable"]) {
    res.push(
      <RequestButton
        key={`${efts.id}_start_action`}
        style={{ marginLeft: "auto" }}
        variant="outlined"
        color="primary"
        startIcon={<PlayArrowIcon />}
        method="POST"
        endpoint={`/tasking/${efts.id}/start`}
        onSuccess={(res) => {
          onActionSuccess(res);
          setInternalState(STATUS_STARTED_NOT_COMPLETED);
        }}
        onFailed={(e) => {
          onActionFailed(e);
          addAlert(
            `Opps! ${efts.task_funnel_subscription.task.name} is not startable!`,
            {
              variant: "error",
            }
          );
        }}
        {...props}
      >
        Start
      </RequestButton>
    );
  }

  if (
    internalState === STATUS_STARTED_NOT_COMPLETED ||
    efts["is_completable"]
  ) {
    if (showUploadButtons) {
      const attachments = efts?.attachments || [];

      if (attachments && attachments.length > 0) {
        attachments.forEach((attachment) => {
          if (attachment.status === STATUS_PENDING) {
            res.push(
              <AttachmentUploadButton
                key={`${efts.id}_attachment_${attachment.id}`}
                attachment={attachment}
                onFileSelected={(file) => {
                  setSelectedAttachment(attachment);
                  setSelectedFile(file);
                }}
              />
            );
          }
        });
      }

      res.push(
        <FileUploadDialog
          key={`${efts.id}_file_upload_confirmation_dialog`}
          file={selectedFile}
          taskId={efts.id}
          attachment={selectedAttachment}
          onSuccessful={onUploadSuccess}
          closeFn={() => {
            setSelectedFile(null);
            setSelectedAttachment(null);
          }}
        />
      );
    }

    // TODO
    // res.push(
    //   <Typography variant="caption" color="textSecondary">
    //     Please upload all required files
    //   </Typography>
    // );

    if (internalState !== STATUS_COMPLETED) {
      res.push(
        <Tooltip
          key={`${efts.id}_complete_action`}
          title={
            !isAllRequiredAttachmentsUploaded
              ? "Please upload all required files"
              : ""
          }
        >
          <RequestButton
            style={{ marginLeft: "auto" }}
            variant="outlined"
            color="primary"
            startIcon={<DoneIcon />}
            method="POST"
            endpoint={`/tasking/${efts.id}/complete`}
            onSuccess={(res) => {
              onActionSuccess(res);
              setInternalState(STATUS_COMPLETED);
            }}
            disabled={!isAllRequiredAttachmentsUploaded}
            onFailed={(e) => {
              onActionFailed(e);
              addAlert(
                `Opps! ${efts.task_funnel_subscription.task.name} is not complete!`,
                {
                  variant: "error",
                }
              );
            }}
            {...props}
          >
            Complete
          </RequestButton>
        </Tooltip>
      );
    }
  }

  if (internalState === STATUS_COMPLETED && inList) {
    res.push(
      <Typography
        key={`${efts.id}_complete_message`}
        variant="caption"
        color="textSecondary"
      >
        TASK COMPLETED
      </Typography>
    );
  }

  return res;
};

export default TaskActionButton;
