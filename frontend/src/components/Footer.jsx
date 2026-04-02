import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/Logo Voisins connectés.png"
                alt="Logo"
                className="w-11 h-11 rounded-full object-cover"
              />
              <h2 className="text-2xl font-bold">Voisins Connectés</h2>
            </div>

            <p className="text-slate-300 text-sm leading-7 max-w-md">
              Une plateforme d’entraide locale permettant aux habitants
              d’échanger des services et de renforcer les liens de voisinage.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li>
                <Link to="/feed" className="hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-semibold text-lg mb-4">Informations</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li>Projet étudiant IPSSI</li>
              <li>Association LienUrbain</li>
              <li>© 2026 Tous droits réservés</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Voisins Connectés — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}