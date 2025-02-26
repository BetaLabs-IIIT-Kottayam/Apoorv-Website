// import { Route, BrowserRouter as Router, Routes } from "react-router";
// // import ProtectedRoute from "./components/ProtectedRoute";
// import AdminLayout from "./pages/AdminPanel";
// import LoginForm from "./pages/LoginPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/*" element={<LoginForm />} />
//         <Route
//           path="/dashboard"
//           element={
//             // <ProtectedRoute>
//               <AdminLayout />
//             // </ProtectedRoute>
//           }
//         />
//         {/* <Route path="/*" element={<LoginForm />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router";
import AdminLayout from "./pages/AdminPanel";
import LoginForm from "./pages/LoginPage";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* If user visits "/", redirect based on authentication */}
        <Route path="/" element={<Navigate to={localStorage.getItem("token") ? "/dashboard" : "/login"} replace />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginForm />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
