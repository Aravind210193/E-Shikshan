import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export const ResumeTemplateForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const addSection = () => {
        setFormData({
            ...formData,
            sections: [...(formData.sections || []), { key: "section" + ((formData.sections?.length || 0) + 1), label: "New Section", fields: ["title", "subtitle", "description"], order: (formData.sections?.length || 0) }],
        });
    };

    const updateSection = (index, key, value) => {
        const sections = [...formData.sections];
        sections[index] = { ...sections[index], [key]: value };
        setFormData({ ...formData, sections });
    };

    const removeSection = (index) => {
        const sections = formData.sections.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }));
        setFormData({ ...formData, sections });
    };

    const handleMainsubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tags: typeof formData.tags === 'string' ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : formData.tags,
        };
        onSubmit(payload);
    }

    return (
        <form onSubmit={handleMainsubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <input value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Active</label>
                    <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Color (e.g., rose, blue)</label>
                    <input value={formData.color || ''} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Preview Icon (Emoji)</label>
                    <input value={formData.preview || ''} onChange={(e) => setFormData({ ...formData, preview: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Recommended</label>
                    <select value={formData.recommended ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, recommended: e.target.value === 'true' })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Preview Image URL</label>
                    <input value={formData.previewImage || ''} onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Tags (comma-separated)</label>
                    <input value={formData.tags || ''} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea rows={4} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
            </div>

            {/* Sub Templates Management */}
            <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Sub Templates</h3>
                    <button type="button" onClick={() => setFormData({ ...formData, subTemplates: [...(formData.subTemplates || []), { id: `sub-${Date.now()}`, name: '', description: '', colorScheme: 'blue', features: [] }] })} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">Add Sub-Template</button>
                </div>
                {(formData.subTemplates || []).map((sub, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                        <div className="md:col-span-3">
                            <input placeholder="ID" value={sub.id} onChange={(e) => {
                                const newSubs = [...(formData.subTemplates || [])];
                                newSubs[i].id = e.target.value;
                                setFormData({ ...formData, subTemplates: newSubs });
                            }} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="md:col-span-3">
                            <input placeholder="Name" value={sub.name} onChange={(e) => {
                                const newSubs = [...(formData.subTemplates || [])];
                                newSubs[i].name = e.target.value;
                                setFormData({ ...formData, subTemplates: newSubs });
                            }} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="md:col-span-2">
                            <input placeholder="Color" value={sub.colorScheme} onChange={(e) => {
                                const newSubs = [...(formData.subTemplates || [])];
                                newSubs[i].colorScheme = e.target.value;
                                setFormData({ ...formData, subTemplates: newSubs });
                            }} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="md:col-span-3">
                            <input placeholder="Desc" value={sub.description} onChange={(e) => {
                                const newSubs = [...(formData.subTemplates || [])];
                                newSubs[i].description = e.target.value;
                                setFormData({ ...formData, subTemplates: newSubs });
                            }} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-end">
                            <button type="button" onClick={() => {
                                const newSubs = formData.subTemplates.filter((_, idx) => idx !== i);
                                setFormData({ ...formData, subTemplates: newSubs });
                            }} className="p-2 hover:bg-gray-700 rounded-lg group"><Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" /></button>
                        </div>
                        <div className="md:col-span-12">
                            <input placeholder="Features (comma separated)" value={(sub.features || []).join(', ')} onChange={(e) => {
                                const newSubs = [...(formData.subTemplates || [])];
                                newSubs[i].features = e.target.value.split(',').map(f => f.trim());
                                setFormData({ ...formData, subTemplates: newSubs });
                            }} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Sections</h3>
                    <button type="button" onClick={addSection} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">Add Section</button>
                </div>
                {(formData.sections || []).map((s, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                        <div className="md:col-span-3">
                            <input placeholder="Key" value={s.key} onChange={(e) => updateSection(i, 'key', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="md:col-span-4">
                            <input placeholder="Label" value={s.label} onChange={(e) => updateSection(i, 'label', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="md:col-span-4">
                            <input placeholder="Fields (comma-separated)" value={(s.fields || []).join(', ')} onChange={(e) => updateSection(i, 'fields', e.target.value.split(',').map(f => f.trim()).filter(Boolean))} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-end">
                            <button type="button" onClick={() => removeSection(i)} className="p-2 hover:bg-gray-700 rounded-lg group"><Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-700 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white transition-colors">Save</button>
            </div>
        </form>
    );
};
