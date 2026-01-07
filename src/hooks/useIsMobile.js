import { useTheme, useMediaQuery } from "@material-ui/core";

export function isMobile() {
  return window.innerWidth < 600;
}

/**
 * This considers `xs` as mobile. For more finer use, use instead the following. You can pass xs, sm, md, lg, xl.
 * 
 * ```
 import { useTheme } from '@material-ui/core/styles';
 import useMediaQuery from '@material-ui/core/useMediaQuery';

 function MyComponent() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return <span>{`theme.breakpoints.up('sm') matches: ${matches}`}</span>;
}
 * ```
 */
export default function useIsMobile(breakpoint = "xs") {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down(breakpoint));
}
