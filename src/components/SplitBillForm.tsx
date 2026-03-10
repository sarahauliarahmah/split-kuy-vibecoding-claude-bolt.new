import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Participant, OrderItem, SharedExpense } from '../types';
import OrderItemInput from './OrderItemInput';
import SharedExpenseInput from './SharedExpenseInput';

interface SplitBillFormProps {
  onSubmit: (
    eventName: string,
    participants: Participant[],
    sharedExpenses: SharedExpense[]
  ) => void;
}

export default function SplitBillForm({ onSubmit }: SplitBillFormProps) {
  const [eventName, setEventName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', items: [{ itemName: '', itemPrice: 0 }], totalAmount: 0 },
  ]);
  const [sharedExpenses, setSharedExpenses] = useState<SharedExpense[]>([]);

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { name: '', items: [{ itemName: '', itemPrice: 0 }], totalAmount: 0 },
    ]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipantName = (index: number, name: string) => {
    const updated = [...participants];
    updated[index].name = name;
    setParticipants(updated);
  };

  const addItemToParticipant = (participantIndex: number) => {
    const updated = [...participants];
    updated[participantIndex].items.push({ itemName: '', itemPrice: 0 });
    setParticipants(updated);
  };

  const removeItemFromParticipant = (participantIndex: number, itemIndex: number) => {
    const updated = [...participants];
    if (updated[participantIndex].items.length > 1) {
      updated[participantIndex].items = updated[participantIndex].items.filter(
        (_, i) => i !== itemIndex
      );
      setParticipants(updated);
    }
  };

  const updateParticipantItem = (
    participantIndex: number,
    itemIndex: number,
    field: 'itemName' | 'itemPrice',
    value: string
  ) => {
    const updated = [...participants];
    if (field === 'itemPrice') {
      updated[participantIndex].items[itemIndex].itemPrice = parseFloat(value) || 0;
    } else {
      updated[participantIndex].items[itemIndex].itemName = value;
    }
    setParticipants(updated);
  };

  const addSharedExpense = () => {
    setSharedExpenses([...sharedExpenses, { expenseName: '', expenseAmount: 0 }]);
  };

  const removeSharedExpense = (index: number) => {
    setSharedExpenses(sharedExpenses.filter((_, i) => i !== index));
  };

  const updateSharedExpense = (
    index: number,
    field: 'expenseName' | 'expenseAmount',
    value: string
  ) => {
    const updated = [...sharedExpenses];
    if (field === 'expenseAmount') {
      updated[index].expenseAmount = parseFloat(value) || 0;
    } else {
      updated[index].expenseName = value;
    }
    setSharedExpenses(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim()) {
      alert('Mohon isi nama acara');
      return;
    }

    const validParticipants = participants.filter(
      (p) => p.name.trim() && p.items.some((item) => item.itemName.trim() && item.itemPrice > 0)
    );

    if (validParticipants.length === 0) {
      alert('Mohon isi minimal satu peserta dengan minimal satu item pesanan');
      return;
    }

    const completedParticipants = validParticipants.map((p) => ({
      ...p,
      items: p.items.filter((item) => item.itemName.trim() && item.itemPrice > 0),
      totalAmount: p.items.reduce((sum, item) => sum + (item.itemPrice || 0), 0),
    }));

    onSubmit(eventName, completedParticipants, sharedExpenses);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Acara / Tagihan
        </label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Misal: Makan Malam Bersama"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Peserta & Pesanan</h3>
          <button
            type="button"
            onClick={addParticipant}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all"
          >
            <Plus size={16} />
            Tambah Peserta
          </button>
        </div>

        {participants.map((participant, pIndex) => (
          <div
            key={pIndex}
            className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-4 space-y-3 border border-pink-200"
          >
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Nama Peserta
                </label>
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => updateParticipantName(pIndex, e.target.value)}
                  placeholder="Nama"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              {participants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParticipant(pIndex)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">
                Pesanan Item
              </label>
              <OrderItemInput
                items={participant.items}
                onAddItem={() => addItemToParticipant(pIndex)}
                onRemoveItem={(itemIndex) => removeItemFromParticipant(pIndex, itemIndex)}
                onUpdateItem={(itemIndex, field, value) =>
                  updateParticipantItem(pIndex, itemIndex, field, value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <SharedExpenseInput
        expenses={sharedExpenses}
        onAdd={addSharedExpense}
        onRemove={removeSharedExpense}
        onUpdate={updateSharedExpense}
      />

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
      >
        Hitung Split Bill
      </button>
    </form>
  );
}
