import React from 'react';
import { TrendingUp, DollarSign, FileText, Clock, Calendar, PieChart } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { formatCurrency } from '../utils/calculations';

interface InvoiceAnalyticsProps {
  invoices: InvoiceData[];
}

export const InvoiceAnalytics: React.FC<InvoiceAnalyticsProps> = ({ invoices }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate analytics
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
  const paidRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  const pendingInvoices = invoices.filter(invoice => invoice.status !== 'paid');
  const pendingRevenue = pendingInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  const thisMonthInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date);
    return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
  });
  const thisMonthRevenue = thisMonthInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  
  const overdueInvoices = invoices.filter(invoice => {
    const dueDate = new Date(invoice.dueDate);
    return invoice.status !== 'paid' && dueDate < new Date();
  });

  // Get primary currency (most used)
  const currencyCount = invoices.reduce((acc, invoice) => {
    acc[invoice.currency] = (acc[invoice.currency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const primaryCurrency = Object.keys(currencyCount).reduce((a, b) => 
    currencyCount[a] > currencyCount[b] ? a : b, 'INR'
  );

  const stats = [
    {
      title: 'Total Invoices',
      value: totalInvoices.toString(),
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue, primaryCurrency),
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'This Month',
      value: formatCurrency(thisMonthRevenue, primaryCurrency),
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Paid Revenue',
      value: formatCurrency(paidRevenue, primaryCurrency),
      icon: TrendingUp,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Pending Revenue',
      value: formatCurrency(pendingRevenue, primaryCurrency),
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Overdue Invoices',
      value: overdueInvoices.length.toString(),
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  const statusBreakdown = [
    { status: 'Paid', count: paidInvoices.length, color: 'bg-green-500' },
    { status: 'Sent', count: invoices.filter(i => i.status === 'sent').length, color: 'bg-blue-500' },
    { status: 'Draft', count: invoices.filter(i => i.status === 'draft').length, color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-gray-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Invoice Status</h3>
          </div>
          
          <div className="space-y-4">
            {statusBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <span className="text-gray-700">{item.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{item.count}</span>
                  <span className="text-sm text-gray-500">
                    ({totalInvoices > 0 ? Math.round((item.count / totalInvoices) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Invoices</h3>
          
          <div className="space-y-4">
            {invoices
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">#{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">{invoice.toName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            
            {invoices.length === 0 && (
              <p className="text-gray-500 text-center py-8">No invoices yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};