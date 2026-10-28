import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Folder, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { categoriesApi, getApiError, type Category } from '@/lib/api';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.getAll();
      if (res.data.success && res.data.data) {
        setCategories(res.data.data.categories || []);
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await categoriesApi.delete(id);
      toast.success(`Category ${name} deleted`);
      fetchCategories();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await categoriesApi.create({
        name: form.name.trim(),
        slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: form.description.trim(),
      });
      toast.success('Category created');
      setShowModal(false);
      setForm({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">MOD::07</span>
            <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Sectors & Classifications</h1>
          </div>
          <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
            Industrial verticals, material applications & taxonomy routing
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-11 px-6 border-3 border-ink bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Sector
        </button>
      </div>

      <div className="card-slab bg-white border-3 border-ink shadow-brutal overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-ink/50 font-mono font-black text-xs uppercase tracking-widest">
            No industry categories found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-ink text-paper border-b-3 border-ink">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Sector Name</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">URI Slug</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-paper border-r border-paper/10">Engineering Scope</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black uppercase tracking-wider text-paper">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-lemon/15 transition-colors">
                    <td className="px-6 py-4 font-black text-xs text-ink">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 border-2 border-ink shadow-brutal-sm bg-lemon flex items-center justify-center text-ink">
                          <Folder className="w-4 h-4" />
                        </div>
                        <span className="font-black text-xs text-ink">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink/70">
                      <span className="bg-paper border border-ink px-2 py-0.5 shadow-[1px_1px_0px_#0B0B0B]">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ink/80 font-medium">{cat.description || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="w-8 h-8 border-2 border-ink bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-ink shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75">
          <div className="card-slab bg-paper border-4 border-ink shadow-brutal-xl w-full max-w-md p-6 space-y-4 font-mono">
            <div className="flex justify-between items-center border-b-3 border-ink pb-4 bg-lemon -mx-6 -mt-6 p-6">
              <h2 className="font-display font-black text-lg text-ink uppercase tracking-tight">Add Sector Category</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 border-2 border-ink bg-white flex items-center justify-center shadow-brutal-sm hover:bg-saturn-orange hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Sector Name</Label>
                <Input
                  required
                  placeholder="Aerospace & Defense"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    setForm({ ...form, name, slug });
                  }}
                  className="h-11 mt-1 font-mono font-bold border-3 border-ink shadow-brutal-sm bg-white"
                />
              </div>

              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">URL Slug</Label>
                <Input
                  required
                  placeholder="aerospace-defense"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="h-11 mt-1 font-mono text-xs font-bold border-3 border-ink shadow-brutal-sm bg-white"
                />
              </div>

              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink">Description</Label>
                <textarea
                  rows={3}
                  placeholder="Applications and materials used..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 mt-1 border-3 border-ink text-xs font-mono font-medium resize-none focus:outline-none focus:border-saturn-orange shadow-brutal-sm bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 border-3 border-ink bg-white font-mono font-black uppercase tracking-wider text-xs shadow-brutal-sm hover:bg-paper active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 h-11 border-3 border-ink bg-saturn-orange text-white font-mono font-black uppercase tracking-wider text-xs shadow-brutal-sm hover:bg-ink hover:text-paper active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
