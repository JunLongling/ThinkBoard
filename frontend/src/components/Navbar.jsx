import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { PlusIcon, SunIcon, MoonIcon } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="bg-base-100">
      <div className="mx-auto max-w-6xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">ThinkBoard</h1>

        <div className="flex items-center gap-4">
          <Link to={"/create"} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">New Note</span>
          </Link>

          <button onClick={toggleTheme} className="btn btn-outline btn-sm">
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
