import React from "react";
import {
  Box,
  List,
  ListItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Typography,
  FormLabel,
  ListItemText,
  Divider,
} from "@material-ui/core";
import { Alert, Skeleton } from "@material-ui/lab";
import {
  ExitToApp as ExitToAppIcon,
  LibraryAdd as LibraryAddIcon,
  Phone as PhoneIcon,
} from "@material-ui/icons";
import { useQueueStyles } from "./styles";

const Queues = ({
  fetchLoading,
  joinQueueLoadingId,
  leaveQueueLoadingId,
  callQueueLoadingId,
  queueCount,
  availableQueues,
  onJoinQueue,
  onLeaveQueue,
  onCallQueue,
  error,
  isPhoneOffHook,
  userPhones,
  selectedPhoneId,
  onPhoneSelect,
}) => {
  const classes = useQueueStyles();
  const permission = true;
  // const user = useUser();
  // const permission = hasPermission(user, "participate_queues");

  const joinedQueue = availableQueues.filter(
    (queue) => queue.joined_phone && queue.on_hook
  );

  const markedAsOnHook = joinedQueue.length > 0;

  return (
    <Box className={classes.root}>
      {/* Content Area */}
      <div className={classes.content}>
        {!permission ? (
          <div className={classes.emptyState}>
            <div className={classes.emptyStateTitle}>
              You don't have permission to manage queues
            </div>
          </div>
        ) : (
          <>
            {/* Phone Selection Dropdown */}
            {userPhones.length > 0 && (
              <div className={classes.phoneDropdownContainer}>
                <FormControl fullWidth size="small">
                  <FormLabel className={classes.formLabel}>
                    Select Phone
                  </FormLabel>
                  <Select
                    variant="outlined"
                    value={selectedPhoneId || ""}
                    onChange={(e) => onPhoneSelect(e.target.value)}
                    displayEmpty
                    translate="yes"
                  >
                    <MenuItem value="" disabled>
                      Select a phone
                    </MenuItem>
                    {userPhones.map((phone) => (
                      <MenuItem key={phone.id} value={phone.id}>
                        {phone.name || phone.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {/* Queue Status */}
            {queueCount > 0 && (
              <Box className={classes.queueStatus} mt={2}>
                📞 Active in {queueCount} queue
                {queueCount > 1 ? "s" : ""}
              </Box>
            )}

            {/* Error Message */}
            {error && !fetchLoading && (
              <Alert severity="warning" className={classes.errorMessage}>
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {fetchLoading &&
              [1, 2, 3, 4, 5].map((v) => (
                <React.Fragment key={`loading_queue_participation_${v}`}>
                  <ListItem>
                    <ListItemText
                      primary={<Skeleton variant="text" />}
                      secondary={<Skeleton variant="text" />}
                    />
                  </ListItem>
                  {v !== 5 && <Divider />}
                </React.Fragment>
              ))}

            {/* Queue List */}
            {!fetchLoading && !error && availableQueues.length > 0 && (
              <div className={classes.listContainer}>
                <List className={classes.queueList}>
                  {availableQueues.map((queue) => {
                    const isJoined = !!queue.joined_phone;
                    const isJoinLoading = joinQueueLoadingId === queue.id;
                    const isLeaveLoading = leaveQueueLoadingId === queue.id;
                    const isCallLoading = callQueueLoadingId === queue.id;
                    const isAnyLoading =
                      isJoinLoading || isLeaveLoading || isCallLoading;

                    return (
                      <ListItem
                        key={`queue_entry_${queue.id}`}
                        className={`${classes.queueItemContainer} ${
                          isJoined ? classes.queueItemJoined : ""
                        }`}
                        alignItems="flex-start"
                      >
                        {/* Queue Content */}
                        <div className={classes.queueItemContent}>
                          <div className={classes.queueLabelContainer}>
                            <Typography className={classes.queueLabel}>
                              {queue.label}
                            </Typography>

                            {isJoined && (
                              <Chip
                                label="Joined"
                                size="small"
                                className={classes.joinedTag}
                              />
                            )}

                            <Chip
                              label={
                                queue.on_hook === true
                                  ? "On-Hook Only"
                                  : queue.on_hook === false
                                  ? "Off-Hook Only"
                                  : "Flexible"
                              }
                              size="small"
                              className={`${classes.queueStatusIndicator} ${
                                queue.on_hook === true
                                  ? "on-hook"
                                  : queue.on_hook === false
                                  ? "off-hook"
                                  : "flexible"
                              }`}
                            />
                          </div>

                          <Typography className={classes.queueCode}>
                            {queue.code}
                          </Typography>
                        </div>

                        {/* Action Buttons */}
                        <div className={classes.queueItemActions}>
                          {isJoined ? (
                            <Tooltip title="Leave Queue">
                              <span>
                                <IconButton
                                  className={`${classes.iconBtn} ${classes.joinedBtn}`}
                                  onClick={() => onLeaveQueue(queue)}
                                  disabled={isAnyLoading}
                                >
                                  {isLeaveLoading ? (
                                    <CircularProgress
                                      size={16}
                                      color="inherit"
                                      className={classes.staticSpinner}
                                    />
                                  ) : (
                                    <ExitToAppIcon />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <div className={classes.actionButtonsContainer}>
                              {/* Join Button */}
                              {(queue.on_hook === true ||
                                (queue.on_hook == null && !isPhoneOffHook)) && (
                                <Tooltip title="Join Queue (On-Hook)">
                                  <span>
                                    <IconButton
                                      className={`${classes.iconBtn} ${classes.availableBtn}`}
                                      onClick={() => onJoinQueue(queue)}
                                      disabled={isAnyLoading}
                                    >
                                      {isJoinLoading ? (
                                        <CircularProgress
                                          size={16}
                                          color="inherit"
                                        />
                                      ) : (
                                        <LibraryAddIcon />
                                      )}
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}

                              {/* Call Button */}
                              {(queue.on_hook === false ||
                                (queue.on_hook == null && isPhoneOffHook)) &&
                                !markedAsOnHook && (
                                  <Tooltip
                                    title={
                                      isPhoneOffHook
                                        ? "Join Queue (Off-Hook)"
                                        : "Call Queue (Off-Hook)"
                                    }
                                  >
                                    <span>
                                      <IconButton
                                        className={`${classes.iconBtn} ${
                                          isPhoneOffHook
                                            ? classes.availableBtn
                                            : classes.callBtn
                                        }`}
                                        onClick={() =>
                                          isPhoneOffHook
                                            ? onJoinQueue(queue)
                                            : onCallQueue(queue)
                                        }
                                        disabled={isAnyLoading}
                                      >
                                        {(
                                          isPhoneOffHook
                                            ? isJoinLoading
                                            : isCallLoading
                                        ) ? (
                                          <CircularProgress
                                            size={16}
                                            color="inherit"
                                          />
                                        ) : isPhoneOffHook ? (
                                          <LibraryAddIcon />
                                        ) : (
                                          <PhoneIcon />
                                        )}
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                )}
                            </div>
                          )}
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            )}

            {/* Empty State */}
            {!fetchLoading && !error && availableQueues.length === 0 && (
              <div className={classes.emptyState}>
                <LibraryAddIcon />
                <div className={classes.emptyStateTitle}>
                  No webphone queues available
                </div>
                <div className={classes.emptyStateSubtitle}>
                  Contact your administrator to set up queues
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Box>
  );
};

export default Queues;
