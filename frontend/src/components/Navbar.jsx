import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/feed" className="text-lg font-bold text-slate-800">
          Voisins Connectés
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-600 md:block">
            Bonjour <span className="font-semibold">{user.firstname} {user.lastname}</span>
          </span>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-white"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
