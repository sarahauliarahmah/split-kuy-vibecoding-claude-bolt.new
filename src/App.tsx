import { useState } from 'react';
import { Split } from 'lucide-react';
import SplitBillForm from './components/SplitBillForm';
import BillResult from './components/BillResult';
import { Bill, Participant, SharedExpense } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSplitBill = async (
    eventName: string,
    participants: Participant[],
    sharedExpenses: SharedExpense[]
  ) => {
    setIsLoading(true);

    try {
      const totalSharedExpenses = sharedExpenses.reduce(
        (sum, exp) => sum + exp.expenseAmount,
        0
      );
      const totalAmount = participants.reduce((sum, p) => sum + p.totalAmount, 0) + totalSharedExpenses;
      const sharedExpensePerPerson = participants.length > 0 ? totalSharedExpenses / participants.length : 0;

      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert({
          event_name: eventName,
          total_amount: totalAmount,
          participant_count: participants.length,
          amount_per_person: totalAmount / participants.length,
        })
        .select()
        .maybeSingle();

      if (billError) throw billError;

      if (billData) {
        const participantsData = participants.map((p) => ({
          bill_id: billData.id,
          name: p.name,
        }));

        const { data: participantsResult, error: participantsError } = await supabase
          .from('participants')
          .insert(participantsData)
          .select();

        if (participantsError) throw participantsError;

        if (participantsResult && participantsResult.length > 0) {
          for (let i = 0; i < participants.length; i++) {
            const participantId = participantsResult[i].id;
            const orderItemsData = participants[i].items.map((item) => ({
              participant_id: participantId,
              item_name: item.itemName,
              item_price: item.itemPrice,
            }));

            if (orderItemsData.length > 0) {
              const { error: orderError } = await supabase
                .from('order_items')
                .insert(orderItemsData);

              if (orderError) throw orderError;
            }
          }
        }

        if (sharedExpenses.length > 0) {
          const sharedExpensesData = sharedExpenses.map((exp) => ({
            bill_id: billData.id,
            expense_name: exp.expenseName,
            expense_amount: exp.expenseAmount,
          }));

          const { error: expenseError } = await supabase
            .from('shared_expenses')
            .insert(sharedExpensesData);

          if (expenseError) throw expenseError;
        }

        setBill({
          id: billData.id,
          eventName,
          participants,
          sharedExpenses,
          sharedExpensePerPerson,
          totalAmount,
        });
      }
    } catch (error) {
      console.error('Error saving bill:', error);
      alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBill(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-pink-600 to-orange-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <Split size={32} className="text-pink-600" />
            </div>
            <h1 className="text-5xl font-bold text-white">SplitKuy</h1>
          </div>
          <p className="text-pink-100 text-lg">
            Aplikasi split bill yang mudah dan praktis
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : bill ? (
            <BillResult bill={bill} onReset={handleReset} />
          ) : (
            <SplitBillForm onSubmit={handleSplitBill} />
          )}
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>Dibuat dengan ❤️ untuk memudahkan patungan bareng teman</p>
        </div>
      </div>
    </div>
  );
}

export default App;
