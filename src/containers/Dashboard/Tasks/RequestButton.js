import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { hooks } from "@telesero/frontend-common";
import { getApi, ModuleNames } from "../../../utils/modules";
import { useAdvertisedPages } from "../../../store/advertised-pages";

const { useAsyncCallback } = hooks;

const RequestButton = (
  {
    method = "get",
    endpoint,
    data = undefined,
    onSuccess = () => {},
    onFailed = () => {},
    buttonComponent: ButtonComponent = Button,
    onClick = () => {},
    responseType = undefined,
    children,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseOver,
    onTouchEnd,
    onTouchStart,
    ...props
  },
  ref
) => {
  const advertisedPages = useAdvertisedPages();
  const style = props?.style || {};
  const [clicked, setClicked] = React.useState(false);
  const [loading] = useAsyncCallback(
    async () => {
      if (!clicked) {
        return Promise.resolve();
      }

      const api = getApi(advertisedPages, ModuleNames.EmployeePortal);

      return api
        .request({
          url: endpoint,
          method,
          data,
          responseType,
        })
        .then((res) => {
          onSuccess(res);

          return res;
        });
    },
    [clicked],
    {
      onDone: () => setClicked(false),
      onError: (e) => onFailed(e),
    }
  );

  if (props.startIcon && loading) {
    props.startIcon = <CircularProgress size={20} />;
  }

  return (
    <div
      ref={ref}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      style={{ display: "inline", ...style }}
    >
      <ButtonComponent
        disabled={loading || props.disabled}
        onClick={(e) => {
          setClicked(true);
          onClick(e);
        }}
        {...props}
      >
        {children}
      </ButtonComponent>
    </div>
  );
};

export default React.forwardRef(RequestButton);
