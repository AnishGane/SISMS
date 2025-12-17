import { THEMES } from "../constants"
import useTheme from "../hooks/useTheme";

const ThemeSelection = () => {
    const { theme, setTheme } = useTheme();
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-4 xl:grid-cols-8">
    {THEMES.map((t) => (
      <button
        key={t}
        className={`group flex flex-col items-center gap-1.5 rounded-lg transition-colors ${theme === t ? 'bg-base-200' : 'hover:bg-base-200/50'} `}
        onClick={() => setTheme(t)}
      >
        <div className="relative h-8 w-full overflow-hidden rounded-md" data-theme={t}>
          <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
            <div className="bg-primary rounded"></div>
            <div className="bg-secondary rounded"></div>
            <div className="bg-accent rounded"></div>
            <div className="bg-neutral rounded"></div>
          </div>
        </div>
        <span className="w-full truncate text-center text-[11px] font-medium">
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </span>
      </button>
    ))}
  </div>
  )
}

export default ThemeSelection