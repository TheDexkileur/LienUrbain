import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Feed() {
  const { user, logout } = useAuth();

  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [annoncesRes, categoriesRes] = await Promise.all([
        API.get("/annonces"),
        API.get("/categories"),
      ]);

      setAnnonces(Array.isArray(annoncesRes.data) ? annoncesRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données depuis l’API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAnnonces = useMemo(() => {
    if (!selectedCategory) {
      return annonces;
    }

    return annonces.filter(
      (annonce) => String(annonce.category?.id || "") === String(selectedCategory)
    );
  }, [annonces, selectedCategory]);

  const stats = useMemo(() => {
    const active = annonces.filter((a) => a.status === "PENDING").length;
    const inProgress = annonces.filter((a) => a.status === "IN_PROGRESS").length;
    const done = annonces.filter((a) => a.status === "DONE").length;

    return [
      { label: "En attente", value: active },
      { label: "En cours", value: inProgress },
      { label: "Terminées", value: done },
    ];
  }, [annonces]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await API.post("/annonces", {
        title: form.title,
        description: form.description,
        price: form.price,
        category_id: form.category_id || null,
      });

      setForm({
        title: "",
        description: "",
        price: "",
        category_id: "",
      });

      await loadData();
    } catch (err) {
      console.error(err);
      setError("Impossible de créer l’annonce.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/annonces/${id}`);
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l’annonce.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/annonces/${id}`, { status });
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Impossible de mettre à jour le statut.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Tableau de bord
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              Bonjour {user?.name || "utilisateur"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-medium text-slate-200 transition hover:bg-white/10"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-black text-cyan-300">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">Créer une annonce</h2>
            <p className="mt-2 text-sm text-slate-400">
              Cette annonce sera enregistrée en base de données.
            </p>

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Titre
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Prix
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Catégorie
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Publier l’annonce
              </button>
            </form>
          </div>

          <div>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Annonces depuis la base</h2>
                <p className="mt-1 text-slate-400">
                  Les données affichées viennent de ton API Symfony et de MySQL.
                </p>
              </div>

              <div className="min-w-[240px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
                Chargement des annonces...
              </div>
            ) : filteredAnnonces.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
                Aucune annonce trouvée.
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-2">
                {filteredAnnonces.map((annonce) => (
                  <article
                    key={annonce.id}
                    className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                          {annonce.category?.name || "Sans catégorie"}
                        </span>
                        <h3 className="mt-4 text-xl font-bold">{annonce.title}</h3>
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {annonce.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {annonce.description}
                    </p>

                    <div className="mt-4 space-y-1 text-sm text-slate-400">
                      <p>
                        <span className="font-semibold text-slate-200">Auteur :</span>{" "}
                        {annonce.user?.name || "Inconnu"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-200">Prix :</span>{" "}
                        {annonce.price ?? "Non renseigné"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-200">Créée le :</span>{" "}
                        {annonce.created_at || "N/A"}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => handleStatusChange(annonce.id, "PENDING")}
                        className="rounded-2xl bg-amber-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-300"
                      >
                        En attente
                      </button>

                      <button
                        onClick={() => handleStatusChange(annonce.id, "IN_PROGRESS")}
                        className="rounded-2xl bg-blue-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-blue-300"
                      >
                        En cours
                      </button>

                      <button
                        onClick={() => handleStatusChange(annonce.id, "DONE")}
                        className="rounded-2xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300"
                      >
                        Terminé
                      </button>

                      <button
                        onClick={() => handleDelete(annonce.id)}
                        className="rounded-2xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-400"
                      >
                        Supprimer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}