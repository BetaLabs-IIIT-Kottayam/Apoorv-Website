import { Route, BrowserRouter as Router, Routes } from "react-router";
// import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/AdminPanel";
import LoginForm from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <AdminLayout />
            // </ProtectedRoute>
          }
        />
        {/* <Route path="/*" element={<LoginForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
