import { Card, CardContent } from "@repo/ui";

const transactions = [
  {
    description: "Payment from Bonnie Green",
    date: "Apr 23, 2021",
    amount: "$2300",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    description: "Payment refund to #00910",
    date: "Apr 23, 2021",
    amount: "-$670",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    description: "Payment failed from #087651",
    date: "Apr 18, 2021",
    amount: "$234",
    status: "Cancelled",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    description: "Payment from Bonnie Green",
    date: "Apr 15, 2021",
    amount: "$5000",
    status: "In progress",
    statusColor: "bg-purple-100 text-purple-700",
  },
  {
    description: "Payment from Jese Leos",
    date: "Apr 15, 2021",
    amount: "$2300",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    description: "Payment from THEMSBERG LLC",
    date: "Apr 11, 2021",
    amount: "$280",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
  },
];

export function TransactionsTable() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-1">Transactions</h3>
        <p className="text-sm text-gray-500 mb-6">
          This is a list of latest transactions.
        </p>
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500">
              <th className="text-left pb-3 font-medium">Transaction</th>
              <th className="text-left pb-3 font-medium">Date &amp; Time</th>
              <th className="text-left pb-3 font-medium">Amount</th>
              <th className="text-left pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.description} className="border-b last:border-0">
                <td className="py-3 text-sm font-medium">{tx.description}</td>
                <td className="py-3 text-sm text-gray-500">{tx.date}</td>
                <td className="py-3 text-sm font-semibold">{tx.amount}</td>
                <td className="py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-md ${tx.statusColor}`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
