import { darken, emphasize } from "@material-ui/core";

const muiOverrides = (theme) => {
  return {
    MuiTooltip: {
      tooltip: {
        fontSize: "0.75rem"
      }
    },
    MuiAccordion: {
      root: {
        "& .MuiAccordion-rounded:first-child": {}
      },
      rounded: {
        borderRadius: 0,
        "&:first-child": {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        },
        "&:last-child": {
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10
        },
        "&:not(:first-child)": {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        },
        "&:not(:last-child)": {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }
      },
      expanded: {
        borderRadius: "10px !important"
      }
    },
    MUIDataTableToolbarSelect: {
      root: {
        borderRadius: 0,
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
        borderBottom: `solid 1px #e0e0e0`,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        "& svg": {
          color: theme.palette.grey
        },
        "& svg.delete": {
          color: theme.palette.error.main
        }
      },
      title: {
        fontSize: 14,
        color: "#3f4e51"
      }
    },
    MUIDataTableToolbar: {
      root: {
        "& button": {
          color: "#aaaaaa !important",
          "& svg": {
            fill: "#aaaaaa !important"
          },
          "&:hover": {
            color: `${theme.palette.primary.main} !important`,
            "& svg": {
              fill: `${theme.palette.primary.main} !important`
            }
          }
        }
      },
      icon: {
        color: "#aaaaaa !important",
        "&:hover": {
          color: `${theme.palette.primary.main} !important`
        }
      },
      titleText: {
        color: "#3f4e51",
        textTransform: "uppercase"
      },
      filterPaper: {
        minWidth: "720px !important"
      },
      [theme.breakpoints.down("xs")]: {
        filterPaper: {
          minWidth: "100px !important",
          maxWidth: "calc(100% - 40px) !important"
        },
        actions: {
          padding: "6px 0"
        }
      }
    },
    MUIDataTableHeadRow: {
      root: {
        "& th.datatables-noprint": {
          width: 120,
          textAlign: "center"
        },
        "& th.MuiTableCell-paddingCheckbox": {
          background: "inherit",
          padding: "0 12px"
        }
      }
    },
    MUIDataTableHeadCell: {
      root: {
        color: "#606060"
      },
      sortAction: {
        "& svg": {
          color: `${theme.palette.primary.main} !important`
        }
      }
    },
    MUIDataTableFilter: {
      root: {
        backgroundColor: theme.palette.common.white
      }
    },
    MUIDataTableFilterList: {
      chip: {
        color: theme.palette.primary.dark,
        backgroundColor: `${emphasize(
          theme.palette.primary.main,
          0.8
        )} !important`,
        "& svg": {
          color: `${theme.palette.primary.dark} !important`,
          transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          "&:hover": {
            color: `${darken(theme.palette.primary.dark, 0.4)} !important`
          }
        }
      }
    },
    MUIDataTableSearch: {
      main: {
        paddingTop: 4
      },
      searchText: {
        flex: "1 0"
      },
      clearIcon: {
        "&:hover": {
          color: theme.palette.primary.light
        }
      }
    },
    MUIDataTableBodyRow: {
      root: {
        color: "#3f4e51",
        "&.Mui-selected": {
          // material v4
          backgroundColor: `${emphasize(
            theme.palette.primary.main,
            0.9
          )} !important`,
          color: theme.palette.primary.main
        },
        "&.mui-row-selected": {
          // material v3
          backgroundColor: `${emphasize(
            theme.palette.primary.main,
            0.9
          )} !important`,
          color: theme.palette.primary.main
        },
        "&:nth-child(even)": {
          backgroundColor: theme.palette.background.paper
        },
        "&:nth-child(odd)": {
          backgroundColor: theme.palette.background.default
        },
        "& svg": {
          color: `${theme.palette.text.disabled}`,
          transition: `color ${theme.transitions.duration.standard}ms ease-out`
        },
        "& span[class*='-checked-']": {
          "& svg": {
            color: `${theme.palette.primary.main} !important`
          }
        },
        "&:hover": {
          backgroundColor: `${emphasize(
            theme.palette.primary.main,
            0.9
          )} !important`,
          color: theme.palette.primary.main,
          "& svg": {
            color: theme.palette.primary.main
          },
          "& button": {
            "& svg": {
              color: `${theme.palette.text.disabled}`
            },
            "&:hover": {
              "& svg": {
                color: `${theme.palette.primary.main} !important`
              }
            }
          }
        },
        "& td.datatables-noprint": {
          textAlign: "center"
        },
        [theme.breakpoints.down("xs")]: {
          "& td.datatables-noprint": {
            textAlign: "left"
          }
        },
        "& td.MuiTableCell-paddingCheckbox": {
          background: "inherit",
          padding: "0 12px"
        }
      }
    },
    MUIDataTableBodyCell: {
      root: {
        color: "inherit",
        [theme.breakpoints.down("xs")]: {
          padding: "2px"
        }
      }
    },
    MUIDataTableFooter: {
      root: ``
    }
  };
};

export default muiOverrides;
