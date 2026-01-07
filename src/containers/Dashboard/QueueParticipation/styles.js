import { makeStyles } from "@material-ui/styles";

export const useQueueStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  phoneDropdownContainer: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1.5)
  },
  queueStatus: {
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    padding: theme.spacing(1, 2),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    fontSize: 14,
    color: theme.palette.primary.dark,
    fontWeight: 500,
    boxShadow: "0 2px 4px rgba(33, 150, 243, 0.15)",
    margin: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(0.5)
  },
  errorMessage: {
    margin: theme.spacing(1, 2)
  },
  listContainer: {
    flex: 1,
    overflow: "auto",
    backgroundColor: theme.palette.background.paper
  },
  queueList: {
    padding: 0
  },
  queueItemContainer: {
    padding: theme.spacing(1.5, 2),
    transition: "all 0.2s ease-in-out",
    borderBottom: `1px solid ${theme.palette.divider}`,
    "&:last-child": {
      borderBottom: "none"
    }
  },
  queueItemJoined: {
    background: "linear-gradient(135deg, #f8fff8, #e8f5e8)",
    borderLeft: "4px solid #28a745"
  },
  queueItemContent: {
    flex: 1,
    minWidth: 0,
    marginRight: theme.spacing(2)
  },
  queueLabelContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: theme.spacing(0.5)
  },
  queueLabel: {
    fontWeight: 400,
    fontSize: 16,
    color: theme.palette.text.primary
  },
  queueCode: {
    fontSize: 12,
    color: theme.palette.text.secondary
  },
  queueItemActions: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    flexShrink: 0
  },
  actionButtonsContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1)
  },
  iconBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    transition: "all 0.2s ease-in-out",
    "& svg": {
      width: 18,
      height: 18
    },
    "&:disabled": {
      opacity: 0.6
    }
  },
  joinedBtn: {
    backgroundColor: "#fff5f5",
    color: "#dc3545",
    "&:hover:not(:disabled)": {
      backgroundColor: "#f8d7da",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(220, 53, 69, 0.2)"
    }
  },
  availableBtn: {
    backgroundColor: "#f0f8ff",
    color: "#007bff",
    "&:hover:not(:disabled)": {
      backgroundColor: "#e3f2fd",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)"
    }
  },
  callBtn: {
    backgroundColor: "#f8fff8",
    color: "#28a745",
    "&:hover:not(:disabled)": {
      backgroundColor: "#d4edda",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(40, 167, 69, 0.2)"
    }
  },
  joinedTag: {
    background: "linear-gradient(135deg, #28a745, #20c997)",
    color: "white",
    fontSize: 11,
    fontWeight: 600,
    marginLeft: theme.spacing(1),
    height: 22,
    borderRadius: 11,
    "& .MuiChip-label": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }
  },
  queueStatusIndicator: {
    fontSize: 11,
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    height: 20,
    borderRadius: 10,
    "& .MuiChip-label": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    "&.on-hook": {
      backgroundColor: "#e3f2fd",
      color: "#1565c0"
    },
    "&.off-hook": {
      backgroundColor: "#fff3e0",
      color: "#ef6c00"
    },
    "&.flexible": {
      backgroundColor: "#f3e5f5",
      color: "#7b1fa2"
    }
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    "& svg": {
      width: 64,
      height: 64,
      marginBottom: theme.spacing(3),
      opacity: 0.3
    }
  },
  emptyStateTitle: {
    fontWeight: 500,
    fontSize: 16,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary
  },
  emptyStateSubtitle: {
    fontSize: 12,
    opacity: 0.7
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.primary.main,
    display: "inline-block",
    marginBottom: theme.spacing(0.5)
  },
  staticSpinner: {
    animation: "none !important",
    "& .MuiCircularProgress-circle": {
      animation: "none !important"
    }
  }
}));
