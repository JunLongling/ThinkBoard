import { ThemeProvider } from "./context/ThemeContext";
import { NotesProvider } from "./context/NotesContext";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => (
  <ThemeProvider>
    <NotesProvider>
      <div className="min-h-screen bg-base-100 text-base-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/note/:id" element={<NoteDetailPage />} />
          </Routes>
        </div>
      </div>
    </NotesProvider>
  </ThemeProvider>
);

export default App;
