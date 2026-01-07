import React from "react";
import clsx from "clsx";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  CardHeader,
  IconButton,
  Grid,
  SvgIcon,
  DialogContentText,
  useMediaQuery,
} from "@material-ui/core";
import { KeyboardBackspace as KeyboardBackspaceIcon } from "@material-ui/icons";
import useIsMobile from "../../hooks/useIsMobile";
import { useControlledDialogStyle } from "./styles";

const CloseIconCustom = (props) => (
  <SvgIcon
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    viewBox="0 0 384 512"
  >
    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
  </SvgIcon>
);

/**
 * A standard confirmation dialog that accepts a async confirmation callback
 *
 * @param {boolean} open
 * @param {string|React.Element} title
 * @param {string|React.Element} subheader
 * @param {string|React.Element} actions
 * @param {string|React.Element|JSX.Element} content
 * @param {function():Promise} confirmFn
 * @param {function(submitted: boolean, isBackgroundClick: boolean)} closeFn
 * @param {string} confirmText
 * @param {string} cancelText
 * @param {boolean} hideButtons
 * @param {string|React.Element} dialogActions
 * @param {boolean} allowBackdropOnConfirm
 * @param dialogContentRef
 * @param useDialogContentWrapper
 * @param dialogProps
 * @return {JSX.Element}
 * @constructor
 */
const ControlledDialog = ({
  open,
  loading: loadingState = false,
  title = "",
  subheader = "",
  actions,
  content,
  confirmFn,
  closeFn,
  confirmText = "Confirm",
  cancelText = "Cancel",
  hideButtons,
  dialogActions,
  allowBackdropOnConfirm,
  dialogContentRef = { current: null },
  useDialogContentWrapper = true,
  disableEscapeKeyDown = false,
  closeOnBackdrop = false,
  dialogProps = {},
  disableEnforceFocus = true,
}) => {
  const [loading, setLoading] = React.useState(false);
  const fullScreen = useIsMobile();
  const classes = useControlledDialogStyle();

  const FourKPlus = useMediaQuery("(min-width: 3840px)");
  const TwoKPlus = useMediaQuery("(min-width: 2560px) and (max-width: 3839px)");

  const actionsAndAboveMobile = actions && !fullScreen;

  let dialogWidth = "sm";
  if (FourKPlus) {
    dialogWidth = "lg";
  } else if (TwoKPlus) {
    dialogWidth = "md";
  }

  const contentWrapper = (children) => {
    if (useDialogContentWrapper) {
      return (
        <DialogContent
          ref={dialogContentRef}
          style={{
            scrollBehavior: "smooth",
            ...(dialogProps.containerStyles || {}),
          }}
        >
          {children}
        </DialogContent>
      );
    }

    return children;
  };

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      disableEscapeKeyDown={disableEscapeKeyDown}
      // This prop (disableEnforceFocus) resolves an issue of when modal opens and widgets are opened too, you cannot type anything in the widget inputs, reference https://github.com/mui/material-ui/issues/17497#issuecomment-533566692
      disableEnforceFocus={disableEnforceFocus}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          if (!closeOnBackdrop) {
            return;
          }
          if (loading && !allowBackdropOnConfirm) {
            return;
          }
        }
        closeFn(false, true);
      }}
      maxWidth={fullScreen ? false : dialogWidth}
      fullWidth
      {...dialogProps}
    >
      <Box display="flex" alignItems="center">
        {dialogProps.showBackArrow && (
          <KeyboardBackspaceIcon
            fontSize="medium"
            onClick={() => closeFn(false, false)}
            style={{ marginRight: 5, marginLeft: 16, cursor: "pointer" }}
          />
        )}
        <Box flexGrow={1}>
          <CardHeader
            title={
              <Typography
                variant="h5"
                className={clsx(classes.dialogTitle, {
                  [classes.dialogTitleWithOnlyCloseButton]: !actions,
                })}
                style={{
                  // if the view is grandView, then set the title calc(100dvw - 265px)
                  maxWidth:
                    dialogProps.view === "grandView"
                      ? "calc(100dvw - 265px)"
                      : actionsAndAboveMobile
                      ? "calc(600px - 265px)"
                      : "",
                }}
              >
                {title}
              </Typography>
            }
            subheader={subheader}
            action={
              <Grid container>
                {actions}
                {/* render the close icon on mobile devices or when allowCloseOnBackdrop is false */}
                {(fullScreen || !closeOnBackdrop) && (
                  <IconButton
                    onClick={() => closeFn(false, false)}
                    color="primary"
                    style={{ fontSize: 26 }}
                  >
                    <CloseIconCustom />
                  </IconButton>
                )}
              </Grid>
            }
          />
        </Box>
      </Box>
      {contentWrapper(
        <React.Fragment>
          {typeof content === "string" && (
            <DialogContentText>{content}</DialogContentText>
          )}
          {typeof content !== "string" && content}
        </React.Fragment>
      )}

      {(dialogActions || !hideButtons) && (
        <DialogActions>
          {dialogActions}
          {!hideButtons && (
            <div className={classes.footerContainer}>
              <Button
                onClick={() => closeFn(false, false)}
                color="default"
                disabled={loading}
              >
                {cancelText}
              </Button>
              {confirmFn && (
                <Button
                  onClick={() => {
                    setLoading(true);

                    confirmFn()
                      .then(() => {
                        closeFn(true, false);
                      })
                      .catch((error) => {
                        // Fake rejections to prevent unhandled promise rejection
                        console.log(error, "error");
                      })
                      .finally(() => setLoading(false));
                  }}
                  color="primary"
                  disabled={loading || loadingState}
                  autoFocus
                >
                  {!loading && !loadingState && confirmText}
                  {(loading || loadingState) && (
                    <CircularProgress size="1.5em" />
                  )}
                </Button>
              )}
            </div>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ControlledDialog;
