import { Users, DollarSign, ArrowLeft, ShoppingCart, TrendingUp } from 'lucide-react';
import { Bill } from '../types';

interface BillResultProps {
  bill: Bill;
  onReset: () => void;
}

export default function BillResult({ bill, onReset }: BillResultProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayNow = () => {
    const paymentUrl = `https://mayar.link/payment`;
    window.open(paymentUrl, '_blank');
  };

  const totalSharedExpenses = bill.sharedExpenses.reduce(
    (sum, exp) => sum + exp.expenseAmount,
    0
  );

  return (
    <div className="space-y-6">
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Kembali</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">{bill.eventName}</h2>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Users size={20} />
            <span>{bill.participants.length} Orang</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl p-4 text-white text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-pink-100 text-sm">
              <ShoppingCart size={16} />
              <span>Total Pesanan</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(bill.totalAmount - totalSharedExpenses)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl p-4 text-white text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-orange-100 text-sm">
              <TrendingUp size={16} />
              <span>Total dengan Biaya</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(bill.totalAmount)}</div>
          </div>
        </div>

        {bill.sharedExpenses.length > 0 && (
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 space-y-2">
            <h3 className="font-semibold text-gray-800 text-sm">Biaya Bersama</h3>
            <div className="space-y-2">
              {bill.sharedExpenses.map((expense, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm text-gray-700"
                >
                  <span>{expense.expenseName}</span>
                  <span className="font-medium">{formatCurrency(expense.expenseAmount)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-orange-200 flex justify-between items-center text-sm font-semibold text-orange-700">
              <span>Per orang</span>
              <span>{formatCurrency(bill.sharedExpensePerPerson)}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 text-lg">Rincian Pembayaran</h3>

          {bill.participants.map((participant, index) => {
            const totalWithShared = participant.totalAmount + bill.sharedExpensePerPerson;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-4 border border-pink-200 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{participant.name}</h4>
                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                      {participant.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between gap-4">
                          <span>{item.itemName}</span>
                          <span className="font-medium">{formatCurrency(item.itemPrice)}</span>
                        </div>
                      ))}
                      {bill.sharedExpensePerPerson > 0 && (
                        <div className="flex justify-between gap-4 pt-1 border-t border-pink-200">
                          <span className="text-xs text-orange-600">Biaya bersama</span>
                          <span className="font-medium text-orange-600">
                            {formatCurrency(bill.sharedExpensePerPerson)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Tagihan:</span>
                  <span className="text-xl font-bold text-pink-600">
                    {formatCurrency(totalWithShared)}
                  </span>
                </div>

                <button
                  onClick={handlePayNow}
                  className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all text-sm"
                >
                  Bayar via Mayar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
