import { Avatar, AvatarFallback } from "@repo/ui";
import { Card, CardContent } from "@repo/ui";

const customers = [
  {
    name: "Neil Sims",
    email: "email@example.com",
    amount: "$367",
    initials: "NS",
    bg: "bg-blue-100 text-blue-600",
  },
  {
    name: "Bonnie Green",
    email: "email@example.com",
    amount: "$67",
    initials: "BG",
    bg: "bg-green-100 text-green-600",
  },
  {
    name: "Micheal Gough",
    email: "email@example.com",
    amount: "$3467",
    initials: "MG",
    bg: "bg-purple-100 text-purple-600",
  },
  {
    name: "Thomas Lean",
    email: "email@example.com",
    amount: "$2367",
    initials: "TL",
    bg: "bg-orange-100 text-orange-600",
  },
  {
    name: "Lana Byrd",
    email: "email@example.com",
    amount: "$367",
    initials: "LB",
    bg: "bg-pink-100 text-pink-600",
  },
  {
    name: "Karen Nelson",
    email: "email@example.com",
    amount: "$1367",
    initials: "KN",
    bg: "bg-teal-100 text-teal-600",
  },
];

export function LatestCustomers() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Latest Customers</h3>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div
              key={customer.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className={`text-xs font-medium ${customer.bg}`}
                  >
                    {customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </div>
              </div>
              <span className="text-sm font-semibold">{customer.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
