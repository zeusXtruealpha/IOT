
import { useState } from 'react';
import type { ProcessedData } from '@/services/thingspeak';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: ProcessedData[];
  isLoading?: boolean;
}

export function DataTable({ data, isLoading = false }: DataTableProps) {
  const [sortField, setSortField] = useState<keyof ProcessedData>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: keyof ProcessedData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aStr = String(aValue);
    const bStr = String(bValue);
    
    return sortDirection === 'asc' 
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
  
  const getECClass = (value: number) => {
    if (value < 300) return "text-green-500";
    if (value < 600) return "text-blue-500";
    if (value < 900) return "text-yellow-500";
    if (value < 1200) return "text-orange-500";
    return "text-red-500";
  };
  
  return (
    <div className="rounded-lg border overflow-hidden bg-white/5 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/50 text-secondary-foreground border-b">
              {[
                { key: 'id', label: 'ID' },
                { key: 'timestamp', label: 'Timestamp' },
                { key: 'temperature', label: 'Temperature (°C)' },
                { key: 'voltage', label: 'EC Voltage (V)' },
                { key: 'ecValue', label: 'EC Value (μS/cm)' }
              ].map((column) => (
                <th 
                  key={column.key} 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => handleSort(column.key as keyof ProcessedData)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortField === column.key && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-4 bg-secondary/30 rounded"></div>
                  </td>
                </tr>
              ))
            ) : (
              sortedData.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm">{row.id}</td>
                  <td className="px-4 py-3 text-sm">{row.timestamp}</td>
                  <td className="px-4 py-3 text-sm">{row.temperature.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{row.voltage.toFixed(3)}</td>
                  <td className={cn("px-4 py-3 text-sm font-medium", getECClass(row.ecValue))}>
                    {row.ecValue.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
