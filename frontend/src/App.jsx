import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; 

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-base-100 text-base-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};
export default App;
