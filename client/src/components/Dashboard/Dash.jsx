import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Key Performance Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold">Key Performance</h2>
        <p className="text-5xl font-bold mt-2">$1.6M</p>
        <p className="text-sm mt-1">Revenue this month</p>
      </Card>

      {/* Upcoming Contracts Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-700 p-6 rounded-2xl shadow-lg">
        <h2 className="text-white text-2xl font-semibold">Upcoming Contracts</h2>
        <div className="mt-4 space-y-4">
          {[
            { name: "TechnoRoot", date: "Nov 1, 2024", value: "$200,000" },
            { name: "Health C.", date: "Oct 15, 2024", value: "$350,000" },
            { name: "FinTruth Inc.", date: "Dec 5, 2024", value: "$150,000" },
            { name: "Reinux", date: "Dec 21, 2024", value: "$180,000" },
          ].map((contract, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-lg p-4 rounded-lg flex justify-between items-center text-white"
            >
              <span className="font-medium">{contract.name}</span>
              <span className="text-sm">{contract.date}</span>
              <span className="font-bold">{contract.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Engaging Section */}
      <Card className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg overflow-hidden">
        <h2 className="text-white text-2xl font-semibold relative z-10">Company Growth</h2>
        <p className="text-white text-sm mt-2 relative z-10">Track business expansion over the months.</p>
        <div className="absolute inset-0 opacity-30">
          <img
            src="/assets/wave-pattern.svg"
            alt="Abstract Background"
            className="w-full h-full object-cover"
          />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;