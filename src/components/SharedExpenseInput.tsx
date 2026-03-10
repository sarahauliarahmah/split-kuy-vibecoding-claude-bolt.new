import { Plus, Trash2 } from 'lucide-react';
import { SharedExpense } from '../types';

interface SharedExpenseInputProps {
  expenses: SharedExpense[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: 'expenseName' | 'expenseAmount', value: string) => void;
}

export default function SharedExpenseInput({
  expenses,
  onAdd,
  onRemove,
  onUpdate,
}: SharedExpenseInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Biaya Bersama (dibagi rata)</h3>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {expenses.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Tidak ada biaya bersama</p>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={expense.expenseName}
                onChange={(e) => onUpdate(index, 'expenseName', e.target.value)}
                placeholder="Misal: Parkir, Servis"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
              />
              <input
                type="number"
                value={expense.expenseAmount || ''}
                onChange={(e) => onUpdate(index, 'expenseAmount', e.target.value)}
                placeholder="Jumlah"
                className="w-28 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                min="0"
                step="0.01"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
