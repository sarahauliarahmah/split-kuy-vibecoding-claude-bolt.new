import { Trash2 } from 'lucide-react';
import { OrderItem } from '../types';

interface OrderItemInputProps {
  items: OrderItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: 'itemName' | 'itemPrice', value: string) => void;
}

export default function OrderItemInput({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: OrderItemInputProps) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item.itemName}
            onChange={(e) => onUpdateItem(index, 'itemName', e.target.value)}
            placeholder="Nama item"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
          />
          <input
            type="number"
            value={item.itemPrice || ''}
            onChange={(e) => onUpdateItem(index, 'itemPrice', e.target.value)}
            placeholder="Harga"
            className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
            min="0"
            step="0.01"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAddItem}
        className="text-sm text-pink-600 hover:text-pink-700 font-medium mt-2"
      >
        + Tambah Item
      </button>
    </div>
  );
}
