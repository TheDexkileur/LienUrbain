import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-fuchsia-500/15 via-slate-950 to-cyan-500/10 p-10 border-r border-white/10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-200">
              <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
              Communauté locale
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight">
              Rejoins
              <span className="block text-fuchsia-400">LienUrbain</span>
            </h1>

            <p className="mt-6 text-lg text-slate-300">
              Crée ton compte pour publier des annonces, proposer ton aide et
              participer à une plateforme de voisinage moderne, utile et
              humaine.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Publie</p>
                <p className="mt-1 text-xl font-bold">Tes annonces facilement</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Réponds</p>
                <p className="mt-1 text-xl font-bold">Aux besoins du quartier</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-fuchsia-300">
                Inscription
              </p>
              <h2 className="mt-2 text-3xl font-bold">Créer un compte</h2>
              <p className="mt-2 text-slate-400">
                Commence à utiliser la plateforme dès maintenant.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ton nom"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="tonemail@mail.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20"
                  required
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-fuchsia-500 px-4 py-3 font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Déjà inscrit ?{" "}
              <Link
                to="/login"
                className="font-semibold text-fuchsia-300 hover:text-fuchsia-200"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}