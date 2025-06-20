'use client';

import SalesDashboard from '../../components/SalesDashboard';

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Analytics</h1>
          <p className="text-gray-600">Track your bookstore&apos;s performance and sales data</p>
        </div>

        {/* Sales Dashboard */}
        <SalesDashboard />
      </div>
    </div>
  );
} 