import React from "react";
import clsx from "clsx";
import {
  Grid,
  Card,
  Box,
  SvgIcon,
  Tooltip,
  Typography
} from "@material-ui/core";
import { BookmarkBorder as BookmarkBorderIcon } from "@material-ui/icons";
import Paper from "../Mui/surfaces/Paper/Paper";
import { hasPermission } from "../../utils/access";
import { getBackofficeUser } from "../../store/app";
// import BookmarkModal from "../../containers/Dashboard/BookmarkedLinks/BookmarkModal";
import { usePageHeaderStyles } from "./styles";

/**
 * PageHeader Component
 *
 * Renders a header section with a title, action buttons, and an optional bookmark feature.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title] - Title of the page header
 * @param {Function} [props.renderTitle] - Function to render a custom title
 * @param {React.ReactNode} [props.actionButtons] - Action buttons to be displayed in the header
 * @param {Function} [props.renderActionButtons] - Function to render custom action buttons
 * @param {string} [props.className] - Additional class names for styling
 * @param {string} [props.actionClassName] - Additional class names for action button styling
 * @param {boolean} [props.allowBookmark=true] - Flag to enable/disable the bookmark feature
 *
 * @returns {JSX.Element} The rendered PageHeader component
 */
const PageHeader = ({
  title,
  renderTitle,
  actionButtons,
  renderActionButtons,
  className,
  actionClassName,
  allowBookmark = true,
  hasMargin = true
}) => {
  const classes = usePageHeaderStyles({ hasMargin });
  const [openBookmarkModal, setOpenBookmarkModal] = React.useState(false);

  const pageTitle = renderTitle ? (
    renderTitle()
  ) : (
    <Typography variant="h4" className={classes.greetingMessage}>
      {title}
    </Typography>
  );
  const pageActionButtons = renderActionButtons
    ? renderActionButtons()
    : actionButtons;

  const havePermissionToBookmark = () => {
    const user = getBackofficeUser();
    if (!user) {
      return false;
    }
    return hasPermission(user, "create_user_quick_links");
  };

  return (
    <Card component={Paper} className={clsx(classes.headerBox, className)}>
      <Box display="flex" alignItems="center" gridColumnGap={8}>
        {pageTitle}
        {/* {allowBookmark && havePermissionToBookmark() && (
          <>
            <Tooltip title="Bookmark Page">
              <span className={classes.bookmarkIconContainer}>
                <SvgIcon
                  onClick={() => setOpenBookmarkModal(true)}
                  component={BookmarkBorderIcon}
                  className={classes.bookmarkIcon}
                />
              </span>
            </Tooltip>
            <BookmarkModal
              open={openBookmarkModal}
              setOpen={setOpenBookmarkModal}
            />
          </>
        )} */}
      </Box>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        className={clsx(classes.cardButtons, actionClassName)}
      >
        {pageActionButtons}
      </Grid>
    </Card>
  );
};

export default PageHeader;
