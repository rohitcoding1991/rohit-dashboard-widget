import React from "react";
import { DialogContentText } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { uploadFile } from "../../../services/tasks";
import ControlledDialog from "../../../components/Control/ControlledDialog";
import NestedBox from "../../../components/NestedBox/NestedBox";
import { getApi, ModuleNames } from "../../../utils/modules";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import { SubtaskListItemStyle } from "./style";

const getFileType = (accepted) => {
  const [type] = accepted.split("/");
  return type || "default";
};

const FilePreview = ({ file, attachment }) => {
  const classes = SubtaskListItemStyle();
  const type = getFileType(file.type);
  const fileUrl = URL.createObjectURL(file);

  const content = () => {
    return file.name;
  };

  return (
    <NestedBox p={2} className={classes.previewBox}>
      {content(type)}
    </NestedBox>
  );
};

/**
 *
 * @param file
 * @param title
 * @param taskId
 * @param attachment
 * @param closeFn
 * @param onSuccessful
 * @return {JSX.Element}
 * @constructor
 */
const FileUploadDialog = ({
  file,
  taskId,
  attachment,
  closeFn = () => {},
  onSuccessful = () => {},
}) => {
  const advertisedPages = useAdvertisedPages();
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => setErrorMessage(null), [file]);

  return (
    <ControlledDialog
      open={!!file}
      title={`${attachment && attachment.name} - File Upload`}
      content={
        file && (
          <React.Fragment>
            {errorMessage && (
              <Alert severity="error" style={{ marginBottom: 10 }}>
                <AlertTitle>{errorMessage}</AlertTitle>
                <strong>{file.name}</strong> could not be uploaded
              </Alert>
            )}
            {file && <FilePreview file={file} attachment={attachment} />}
            <DialogContentText>
              Do you want to upload <strong>{file.name}</strong>
            </DialogContentText>
          </React.Fragment>
        )
      }
      confirmText="Upload"
      closeFn={closeFn}
      confirmFn={() => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            resolve(event.target.result);
          };

          reader.onerror = (err) => {
            reject(err);
          };

          return reader.readAsDataURL(file);
        }).then((base64) => {
          const app = getApi(advertisedPages, ModuleNames.EmployeePortal);
          return uploadFile(
            taskId,
            file.name,
            base64,
            attachment.restriction_id,
            app
          )
            .then((res) => {
              setErrorMessage(null);
              onSuccessful(res);
              return res;
            })
            .catch((e) => {
              setErrorMessage(e?.message);
              return Promise.reject(e);
            });
        });
      }}
    />
  );
};

export default FileUploadDialog;
