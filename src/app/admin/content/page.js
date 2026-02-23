'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function ContentCMS() {
    const [speakers, setSpeakers] = useState([]);
    const [alliances, setAlliances] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'speaker' or 'alliance'
    const [editingItem, setEditingItem] = useState(null); // null if adding new

    // Upload State
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    // Form Data State
    const [formData, setFormData] = useState({});

    const fetchData = async () => {
        setLoading(true);
        const { data: s } = await supabase.from('speakers').select('*').order('display_order');
        const { data: a } = await supabase.from('alliances_sponsors').select('*').order('display_order');
        if (s) setSpeakers(s);
        if (a) setAlliances(a);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- UTILS ---
    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        if (item) {
            setFormData({ ...item });
            setImagePreview(item.image_url || item.logo_url || '');
        } else {
            // Default empty state
            setFormData(type === 'speaker'
                ? { name: '', role: '', company: '', topic: '', is_regional: false, display_order: 0 }
                : { name: '', type: 'Sponsor', display_order: 0 }
            );
            setImagePreview('');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({});
        setImagePreview('');
        setEditingItem(null);
    };

    const handleUploadImage = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${modalType}s/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('public-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('public-assets')
                .getPublicUrl(filePath);

            setImagePreview(data.publicUrl);
            setFormData(prev => ({
                ...prev,
                [modalType === 'speaker' ? 'image_url' : 'logo_url']: data.publicUrl
            }));

        } catch (error) {
            alert('Error subiendo imagen: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // --- CRUD OPERATIONS ---
    const handleSave = async (e) => {
        e.preventDefault();
        const table = modalType === 'speaker' ? 'speakers' : 'alliances_sponsors';

        try {
            if (editingItem) {
                // Update
                const { error } = await supabase.from(table).update(formData).eq('id', editingItem.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase.from(table).insert([formData]);
                if (error) throw error;
            }
            fetchData();
            closeModal();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleDelete = async (id, table) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    // --- RENDER ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>

            {loading && <div style={{ color: 'var(--text-secondary)' }}>Cargando datos...</div>}

            {/* SPEAKERS SECTION */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Gestión de <span className="highlight">Ponentes</span></h2>
                    <button className="btn btn-primary" onClick={() => openModal('speaker')}>+ Agregar Ponente</button>
                </div>

                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', width: '60px' }}>Foto</th>
                                    <th style={{ padding: '1rem' }}>Nombre / Tema</th>
                                    <th style={{ padding: '1rem' }}>Tipo</th>
                                    <th style={{ padding: '1rem' }}>Orden</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {speakers.map(s => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#222', overflow: 'hidden' }}>
                                                {s.image_url ? <img src={s.image_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ''}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <strong>{s.name}</strong>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.topic}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: s.is_regional ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255, 215, 0, 0.1)', color: s.is_regional ? '#00d2ff' : '#ffd700' }}>
                                                {s.is_regional ? 'Regional' : 'Estelar'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{s.display_order}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => openModal('speaker', s)} className="btn-icon" style={{ marginRight: '8px' }}>Editar</button>
                                            <button onClick={() => handleDelete(s.id, 'speakers')} className="btn-icon text-danger">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ALLIANCES SECTION */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Alianzas y <span className="highlight">Patrocinios</span></h2>
                    <button className="btn btn-primary" onClick={() => openModal('alliance')}>+ Agregar Aliado</button>
                </div>

                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', width: '80px' }}>Logo</th>
                                    <th style={{ padding: '1rem' }}>Nombre</th>
                                    <th style={{ padding: '1rem' }}>Tipo</th>
                                    <th style={{ padding: '1rem' }}>Enlace</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alliances.map(a => (
                                    <tr key={a.id} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ width: 60, height: 40, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {a.logo_url ? <img src={a.logo_url} alt={a.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : 'img'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}><strong>{a.name}</strong></td>
                                        <td style={{ padding: '1rem' }}>{a.type}</td>
                                        <td style={{ padding: '1rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {a.website_url ? <a href={a.website_url} target="_blank" rel="noreferrer" style={{ color: 'var(--neon-blue)' }}>Link</a> : '-'}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => openModal('alliance', a)} className="btn-icon" style={{ marginRight: '8px' }}>Editar</button>
                                            <button onClick={() => handleDelete(a.id, 'alliances_sponsors')} className="btn-icon text-danger">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* MODAL */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>
                                {editingItem ? 'Editar' : 'Agregar'} {modalType === 'speaker' ? 'Ponente' : 'Aliado'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* IMAGEN UPLOAD */}
                            <div>
                                <label className="form-label">Imagen / Logo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: 80, height: 80,
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: modalType === 'speaker' ? '50%' : '8px',
                                        border: '1px dashed rgba(255,255,255,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: modalType === 'speaker' ? 'cover' : 'contain' }} />
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>No foto</span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUploadImage}
                                            disabled={uploading}
                                            style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                                        />
                                        {uploading && <div style={{ fontSize: '0.8rem', color: 'var(--neon-blue)', marginTop: '4px' }}>Subiendo...</div>}
                                    </div>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />

                            {/* COMMON FIELDS */}
                            <div>
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text" required className="filter-input" style={{ width: '100%' }}
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* SPEAKER FIELDS */}
                            {modalType === 'speaker' && (
                                <>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label className="form-label">Puesto / Cargo</label>
                                            <input type="text" className="filter-input" style={{ width: '100%' }}
                                                value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="form-label">Empresa</label>
                                            <input type="text" className="filter-input" style={{ width: '100%' }}
                                                value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label">Tema de la Ponencia</label>
                                        <input type="text" className="filter-input" style={{ width: '100%' }}
                                            value={formData.topic || ''} onChange={e => setFormData({ ...formData, topic: e.target.value })} />
                                    </div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox"
                                            checked={formData.is_regional || false}
                                            onChange={e => setFormData({ ...formData, is_regional: e.target.checked })}
                                        />
                                        Ponente Regional (Marcar si es regional, desmarcar para estelar)
                                    </label>
                                </>
                            )}

                            {/* ALLIANCE FIELDS */}
                            {modalType === 'alliance' && (
                                <>
                                    <div>
                                        <label className="form-label">Tipo de Aliado</label>
                                        <select className="filter-input" style={{ width: '100%' }}
                                            value={formData.type || 'Sponsor'} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                            <option value="Sponsor">Patrocinador General</option>
                                            <option value="Institucional">Socio Institucional</option>
                                            <option value="Media Partner">Media Partner</option>
                                            <option value="Colaborador">Colaborador</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Enlace / Sitio Web</label>
                                        <input type="url" className="filter-input" style={{ width: '100%' }} placeholder="https://"
                                            value={formData.website_url || ''} onChange={e => setFormData({ ...formData, website_url: e.target.value })} />
                                    </div>
                                </>
                            )}

                            {/* COMMON ORDER */}
                            <div>
                                <label className="form-label">Orden de Visualización</label>
                                <input type="number" className="filter-input" style={{ width: '100px' }}
                                    value={formData.display_order || 0} onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={closeModal} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .highlight { color: #00d2ff; }
                .form-label { display: block; font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 4px; }
                .btn-icon { background: none; border: 1px solid #444; color: white; padding: 4px 12px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
                .btn-icon:hover { border-color: #00d2ff; color: #00d2ff; }
                .btn-icon.text-danger:hover { border-color: #ff4444; color: #ff4444; }
            `}</style>
        </div>
    );
}
