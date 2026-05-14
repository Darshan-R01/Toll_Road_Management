import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AdminFleetView from '../components/AdminFleetView';
import UserDashboard from '../components/UserDashboard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-8">
        {isAdmin ? (
          <AdminFleetView />
        ) : (
          <UserDashboard />
        )}
      </main>
    </div>
  );
}