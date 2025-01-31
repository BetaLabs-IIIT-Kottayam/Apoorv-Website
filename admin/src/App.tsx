import { Route, BrowserRouter as Router, Routes } from "react-router";
import AdminLayout from "./pages/AdminPanel";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/*" element={<AdminLayout />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
