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
          <h1 className="text-2xl font-black text-black tracking-tighter">Categories</h1>
          <p className="text-slate-400 text-sm font-medium">Manage product industries & classifications</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="h-10 px-5 bg-black hover:bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-black text-xs uppercase tracking-widest">
            No categories found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Category Name</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-xs text-black">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <Folder className="w-3.5 h-3.5" />
                        </div>
                        {cat.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{cat.slug}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">{cat.description || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-slate-600 ml-auto"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="font-black text-lg text-black tracking-tight">Add Category</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="text-xs font-black uppercase tracking-widest">Category Name</Label>
                <Input
                  required
                  placeholder="Aerospace & Defense"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    setForm({ ...form, name, slug });
                  }}
                  className="h-11 mt-1 font-medium"
                />
              </div>

              <div>
                <Label className="text-xs font-black uppercase tracking-widest">URL Slug</Label>
                <Input
                  required
                  placeholder="aerospace-defense"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="h-11 mt-1 font-mono text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-black uppercase tracking-widest">Description</Label>
                <textarea
                  rows={3}
                  placeholder="Applications and materials used..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl border border-slate-200 text-sm font-medium resize-none focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-11 rounded-xl font-bold">
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} className="flex-1 h-11 bg-black hover:bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
