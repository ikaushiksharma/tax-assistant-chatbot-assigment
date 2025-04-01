import { TableRowType } from "@/types";
import React from "react";

type TableProps = {
  data: TableRowType[] | undefined;
};

export function Table({ data }: TableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-scroll rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.signature}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
