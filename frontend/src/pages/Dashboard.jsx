import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true }); // Replace history to prevent back button
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h2>

        {user && (
          <p className="text-gray-700 mb-3">
            Hello, {user.firstName || user.email}!
          </p>
        )}

        <p className="text-gray-700 mb-6">
          You are logged in. Here you can manage your account and view your
          data.
        </p>

        <button
          onClick={handleLogout}
          className="cursor-pointer bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
