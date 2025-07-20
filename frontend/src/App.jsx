import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; 
import { SocketProvider } from "./context/SocketContext"; // import socket provider

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  return (
    <ThemeProvider>
      <SocketProvider>  {/* Add SocketProvider here */}
        <div className="min-h-screen bg-base-100 text-base-content px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/note/:id" element={<NoteDetailPage />} />
            </Routes>
          </div>
        </div>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
