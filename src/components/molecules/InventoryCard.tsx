// Componente de tarjeta de inventario para vista móvil
import React from 'react';
import { Edit, ArrowLeftRight } from 'lucide-react';
import Button from '@/components/atoms/Button';

interface InventoryCardProps {
    item: {
        id: string;
        product_id: string;
        productName: string;
        productSKU: string;
        productCategory: string;
        stock: number;
        reserved?: number;
        min_stock?: number;
    };
    onEdit: (item: any) => void;
    onTransfer: (item: any) => void;
}

export default function InventoryCard({ item, onEdit, onTransfer }: InventoryCardProps) {
    const available = item.stock - (item.reserved || 0);
    const isLowStock = item.stock <= (item.min_stock || 5);
    const isOutOfStock = item.stock === 0;

    return (
        <div className="glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-base mb-1">
                        {item.productName}
                    </h3>
                    <p className="text-sm text-gray-400">
                        SKU: <span className="font-mono">{item.productSKU}</span>
                    </p>
                </div>

                {/* Stock Badge */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${isOutOfStock
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : isLowStock
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                    {item.stock}
                </div>
            </div>

            {/* Categoría */}
            <div className="mb-3">
                <span className="inline-block px-2 py-1 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {item.productCategory}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                    <p className="text-xs text-gray-400 mb-1">Total</p>
                    <p className="text-lg font-semibold text-foreground">{item.stock}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">Reservado</p>
                    <p className="text-lg font-semibold text-orange-400">{item.reserved || 0}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">Disponible</p>
                    <p className="text-lg font-semibold text-green-400">{available}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(item)}
                    className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Edit size={16} />
                    Editar
                </button>
                <button
                    onClick={() => onTransfer(item)}
                    className="flex-1 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeftRight size={16} />
                    Transferir
                </button>
            </div>
        </div>
    );
}
