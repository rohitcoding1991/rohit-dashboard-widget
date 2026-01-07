import React from "react";
import {
  IconButton,
  Tooltip,
  Typography,
  ButtonBase,
  Grid,
  Box,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Bookmark as BookmarkIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import BookmarkModal from "../../containers/Dashboard/BookmarkedLinks/BookmarkModal";
import { hasPermission } from "../../utils/access";
import { getBackofficeUser } from "../../store/app";
import ControlledDialog from "../Control/ControlledDialog";
import { useBookmarkedLinkStyles } from "./style";

const BookmarkedLink = ({
  link,
  handleView,
  deleteLoading,
  handleDelete,
  afterUpdate = (data) => {},
}) => {
  const classes = useBookmarkedLinkStyles();
  const user = getBackofficeUser();

  const [edit, setEdit] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const popoverId = open ? "more-options-popover" : undefined;

  const hasEditPermission = user
    ? hasPermission(user, "edit_user_quick_links")
    : false;
  const hasDeletePermission = user
    ? hasPermission(user, "delete_user_quick_links")
    : false;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonBase
        className={classes.root}
        onClick={() => {
          if (!open) {
            handleView(link);
          }
        }}
      >
        <Box className={classes.link}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <BookmarkIcon className={classes.linkIcon} />
            <Tooltip title={link.name}>
              <Typography
                component="h2"
                align={"center"}
                className={classes.linkTitle}
              >
                {link.name}
              </Typography>
            </Tooltip>
            <Tooltip title={link.description}>
              <Typography
                variant="subtitle2"
                align={"center"}
                className={`${classes.linkHelper} connexio_quick_link_description`}
              >
                {link.description ? link.description : <br />}
              </Typography>
            </Tooltip>
          </Grid>

          {(hasEditPermission || hasDeletePermission) && (
            <div className={classes.moreIcons}>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  setAnchorEl(event.currentTarget);
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <List classes={{ root: classes.listContainer }}>
                  {hasEditPermission && (
                    <ListItem
                      button
                      onClick={(event) => {
                        event.stopPropagation();
                        setEdit(true);
                        handleClose();
                      }}
                    >
                      <ListItemIcon classes={{ root: classes.iconContainer }}>
                        <EditIcon fontSize="small" className={classes.edit} />
                      </ListItemIcon>
                      <ListItemText primary="Edit" className={classes.edit} />
                    </ListItem>
                  )}
                  {hasDeletePermission && (
                    <ListItem
                      button
                      onClick={(event) => {
                        event.stopPropagation();
                        setConfirmDelete(true);
                        handleClose();
                      }}
                    >
                      <ListItemIcon classes={{ root: classes.iconContainer }}>
                        <DeleteIcon
                          fontSize="small"
                          className={classes.delete}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Delete"
                        className={classes.delete}
                      />
                    </ListItem>
                  )}
                </List>
              </Popover>
            </div>
          )}
        </Box>
      </ButtonBase>

      {/* Edit Bookmark */}
      {edit && (
        <BookmarkModal
          id={link.id}
          open={edit}
          setOpen={setEdit}
          initialValues={link}
          afterUpdate={afterUpdate}
        />
      )}

      {/* Delete Confirm */}
      <ControlledDialog
        loading={deleteLoading}
        open={confirmDelete}
        title={`Delete Link - ${link.name}`}
        content={`Are you sure want to remove link ${link.name}? This action cannot be undone.`}
        closeFn={() => setConfirmDelete(false)}
        confirmFn={() => {
          return handleDelete(link);
        }}
      />
    </>
  );
};

export default BookmarkedLink;
