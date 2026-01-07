import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  TextField,
  Typography,
  useTheme
} from "@material-ui/core";
import ControlledDialog from "../../../components/Control/ControlledDialog";
import { addAlert } from "../../../store/notifications";
import { backoffice } from "../../../settings/api";
import { useUser } from "../../../store/app";
import { useBookmarkModalStyles } from "./styles";

const getRootElement = () => document.getElementById("bookmark-modal");

const BookmarkModal = ({ open, setOpen, id, initialValues, afterUpdate }) => {
  const location = window.location;
  const theme = useTheme();
  const user = useUser();
  const classes = useBookmarkModalStyles();
  const nameFieldRef = React.useRef(null);
  const buttonRef = React.useRef(null);

  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
    }
  }, [initialValues]);

  const handleKeyUp = React.useCallback((event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      buttonRef.current?.click();
    }
  }, []);

  return (
    <>
      <ControlledDialog
        open={open}
        title={initialValues ? "Edit Bookmark Link" : "Bookmark Link"}
        closeFn={setOpen}
        hideButtons
        dialogProps={{
          onEntered: () => {
            nameFieldRef.current?.focus();
            // For enter key press submit event
            const bookmarkModal = getRootElement();
            bookmarkModal.addEventListener("keyup", handleKeyUp);
          },
          onExited: () => {
            // Remove listener on unmount
            const bookmarkModal = getRootElement();
            bookmarkModal?.removeEventListener?.("keyup", handleKeyUp);
          }
        }}
        content={
          <div className={classes.root} id="bookmark-modal">
            <TextField
              inputRef={nameFieldRef}
              label="Link Name"
              variant="standard"
              required
              placeholder="Link name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Link Description"
              required
              variant="standard"
              multiline
              minRows={5}
              placeholder="Enter link description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Box>
              <Box sx={{ color: theme.palette.primary.main }}>Quick Link:</Box>
              <Typography variant="caption" className={classes.caption}>
                {initialValues?.link ||
                  `${location.pathname}${location.search || ""}`}
              </Typography>
            </Box>
          </div>
        }
        dialogActions={
          <DialogActions className={classes.dialogActions}>
            <div className={classes.footerContainer}>
              <Button onClick={() => setOpen(false)} color="default">
                Cancel
              </Button>
              <Button
                ref={buttonRef}
                onClick={async () => {
                  if (!name || !description) {
                    addAlert("Please fill in all fields", {
                      variant: "error"
                    });
                    return;
                  }
                  setLoading(true);
                  try {
                    const payload = {
                      name,
                      description,
                      app_name: initialValues
                        ? initialValues?.app_name
                        : process.env.REACT_APP_NAME,
                      link: initialValues
                        ? initialValues?.link
                        : `${location.pathname}${location.search || ""}`,
                      client: user?.client_id
                    };

                    if (initialValues) {
                      await backoffice.put(
                        `/api/user_quick_links/${id}`,
                        payload
                      );
                      afterUpdate?.(payload);
                    } else {
                      await backoffice.post("/api/user_quick_links", payload);
                    }

                    addAlert(
                      initialValues
                        ? "Link updated successfully!"
                        : "Link bookmarked successfully!",
                      {
                        variant: "success"
                      }
                    );
                    setOpen(false);
                  } catch (error) {
                    addAlert(
                      initialValues
                        ? error?.response?.data?._root?.[0] ||
                            "Failed to update link"
                        : error?.response?.data?._root?.[0] ||
                            "Failed to bookmark link",
                      {
                        variant: "error"
                      }
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
                color="primary"
                disabled={loading}
                autoFocus
              >
                {!loading && "Confirm"}
                {loading && <CircularProgress size="1.5em" />}
              </Button>
            </div>
          </DialogActions>
        }
      />
    </>
  );
};

export default BookmarkModal;
