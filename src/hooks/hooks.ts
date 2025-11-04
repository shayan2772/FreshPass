import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { AppDispatch, RootState } from "../state/store";
import { themes } from "../theme/colors";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ✅ Optimized useTheme hook to prevent unnecessary re-renders
export const useTheme = () => {
  const { theme, themeType } = useAppSelector((s) => s.general);
  // Memoize colors object to prevent unnecessary re-renders
  const colors = useMemo(() => themes[theme], [theme]);
  return { colors, theme, themeType };
};
 