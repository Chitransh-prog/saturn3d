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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#0B0D10]/5 text-[#5B616B] border border-[#0B0D10]/10">
              CAT // 07
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0D10]">
              Sectors &amp; Classifications
            </h1>
          </div>
          <p className="text-xs text-[#5B616B] font-mono">
            Industrial verticals, material applications &amp; taxonomy routing
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-5 rounded-xl bg-[#FF5A1F] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#E04B14] active:scale-[0.98] transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Sector
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-[#5B616B] font-mono text-xs uppercase tracking-widest">
            No industry categories found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-[#F5F6F8] border-b border-[#0B0D10]/10">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Sector Name</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">URI Slug</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Engineering Scope</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[#5B616B]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B0D10]/5">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="px-6 py-4 font-medium text-xs text-[#0B0D10]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
                          <Folder className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-xs text-[#0B0D10]">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#5B616B]">
                      <span className="bg-[#F5F6F8] border border-[#0B0D10]/10 px-2 py-0.5 rounded-md">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#0B0D10]/80 font-normal">{cat.description || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-[#5B616B] shadow-sm ml-auto"
                        title="Delete category"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D10]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#0B0D10]/10 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#0B0D10]/10 pb-4">
              <h2 className="text-base font-semibold text-[#0B0D10]">Add Sector Category</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg border border-[#0B0D10]/10 bg-white flex items-center justify-center hover:bg-[#F5F6F8] text-[#5B616B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-1">
              <div>
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Sector Name</Label>
                <Input
                  required
                  placeholder="Aerospace & Defense"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    setForm({ ...form, name, slug });
                  }}
                  className="h-10 mt-1 rounded-xl font-mono text-xs border border-[#0B0D10]/15 bg-white"
                />
              </div>

              <div>
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">URL Slug</Label>
                <Input
                  required
                  placeholder="aerospace-defense"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="h-10 mt-1 font-mono text-xs border border-[#0B0D10]/15 bg-white rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs font-mono font-medium text-[#5B616B] uppercase tracking-wider">Description</Label>
                <textarea
                  rows={3}
                  placeholder="Applications and materials used..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl border border-[#0B0D10]/15 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] bg-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10 rounded-xl border border-[#0B0D10]/10 bg-white font-medium text-xs text-[#5B616B] hover:bg-[#F5F6F8] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 h-10 rounded-xl bg-[#FF5A1F] text-white font-medium text-xs shadow-sm hover:bg-[#E04B14] transition-all flex items-center justify-center gap-2"
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
