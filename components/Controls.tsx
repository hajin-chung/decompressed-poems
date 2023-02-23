import { useTheme } from "next-themes";
import Sun from "../public/sun.svg";
import Moon from "../public/Moon.svg";

export const Controls = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-2 right-2">
      <button
        className="relative h-9 w-9 rounded-lg bg-slate-900 bg-opacity-10 p-1 dark:bg-white dark:bg-opacity-10"
        onClick={() => {
          if (theme === "dark") setTheme("light");
          else setTheme("dark");
        }}
      >
        {theme === "dark" ? (
          <Sun className="h-full w-full" />
        ) : (
          <Moon className="h-full w-full" stroke="#000" />
        )}
      </button>
    </div>
  );
};
