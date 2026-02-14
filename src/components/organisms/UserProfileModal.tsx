import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, User, Mail, Camera } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import Button from '@/components/atoms/Button';
import InputField from '@/components/molecules/InputField';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase/client';
import { useNotifications } from '@/store/notificationStore';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff } from 'lucide-react';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuthStore();
    const { notify } = useNotifications();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar_url: ''
    });
    const [loading, setLoading] = useState(false);
    const { isSubscribed, subscribeToPush, loading: pushLoading } = usePushNotifications();

    const { modalRef, handleBackdropClick } = useModal({
        onClose,
        closeOnEscape: true,
        closeOnClickOutside: true
    });

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar_url: user.imageUrl || ''
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // 1. Update Supabase Auth Metadata
            const { data: authData, error: authError } = await supabase.auth.updateUser({
                data: {
                    name: formData.name,
                    avatar_url: formData.avatar_url
                }
            });

            if (authError) throw authError;

            // 2. Update User Profile Table
            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({
                    name: formData.name
                    // Note: avatar_url might not be in user_profiles schema yet, 
                    // but it's good to keep metadata in sync
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // 3. Update Local State
            setUser({
                ...user,
                name: formData.name,
                imageUrl: formData.avatar_url
            });

            notify.success('Perfil Actualizado', 'Tus datos han sido guardados correctamente.');
            onClose();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            notify.error('Error', error.message || 'No se pudo actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        Mi Perfil
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Avatar Preview */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <div className="relative w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                                {formData.avatar_url ? (
                                    <Image
                                        src={formData.avatar_url}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-muted-foreground">
                                        {formData.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {/* Overlay hint */}
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <InputField
                        label="Nombre Completo"
                        name="name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Tu nombre"
                    />

                    <InputField
                        label="Correo Electrónico"
                        name="email"
                        value={formData.email}
                        disabled
                        placeholder="correo@ejemplo.com"
                        className="opacity-60 cursor-not-allowed"
                    />

                    <InputField
                        label="URL de Avatar (Opcional)"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, avatar_url: e.target.value })}
                        placeholder="https://ejemplo.com/foto.jpg"
                    />

                    {/* Push Notifications Section */}
                    <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell size={18} className={isSubscribed ? "text-green-500" : "text-muted-foreground"} />
                                <span className="text-sm font-medium text-foreground">Notificaciones Push</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${isSubscribed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {isSubscribed ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Recibe alertas inmediatas en tu navegador cuando se solicite mercancía a tu sucursal.
                        </p>
                        {!isSubscribed ? (
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full text-xs py-1.5"
                                onClick={subscribeToPush}
                                disabled={pushLoading}
                            >
                                <Bell className="w-3 h-3 mr-2" />
                                Activar en este Navegador
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/5 p-2 rounded-lg">
                                <BellOff className="w-3 h-3" />
                                <span>Ya estás suscrito en este navegador</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfileModal;
