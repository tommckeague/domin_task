import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface TableColumn {
  key: string;
  label: string;
}

interface DetailTableProps {
  title: string;
  columns: TableColumn[];
  data: Record<string, any>[];
}

export const DetailTable: React.FC<DetailTableProps> = ({ title, columns, data }) => {
  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      <h2 className="text-xl font-bold p-4 text-white bg-slate-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-slate-800/50 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td 
                    key={col.key} 
                    className="px-6 py-4 text-sm text-slate-300 font-mono"
                  >
                    {colIndex === 0 ? (
                      <Link 
                        href={`${currentPath}/${row[col.key]}?test_id=${data[index].test_id}`}
                        className="block hover:text-blue-400 transition-colors"
                      >
                        {row[col.key] || 'N/A'}
                      </Link>
                    ) : (
                      row[col.key] || 'N/A'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailTable;