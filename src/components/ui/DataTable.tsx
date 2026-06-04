import { type ReactNode } from 'react';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  getRowKey: (row: T) => string;
  emptyLabel?: string;
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function DataTable<T>({ columns, data, getRowKey, emptyLabel = '표시할 데이터가 없습니다.' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={`border-b border-slate-200 px-3 py-3 font-black text-slate-500 ${alignClasses[column.align ?? 'left']}`}
                key={column.key}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-3 py-8 text-center font-semibold text-slate-500" colSpan={columns.length}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr className="hover:bg-slate-50" key={getRowKey(row)}>
                {columns.map((column) => (
                  <td
                    className={`border-b border-slate-100 px-3 py-3 font-semibold text-slate-700 ${alignClasses[column.align ?? 'left']}`}
                    key={column.key}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
