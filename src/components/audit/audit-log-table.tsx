"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import type { AuditLog } from "@/types/notification";

export type AuditLogTableProps = {
  logs: AuditLog[];
  className?: string;
};

export const AuditLogTable = ({
  logs,
  className,
}: AuditLogTableProps): React.JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("");
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // Available entity types
  const entityTypes = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.entityType))).filter(Boolean);
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !searchQuery.trim() ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.userId && log.userId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchEntity =
        !selectedEntityType || log.entityType === selectedEntityType;

      return matchSearch && matchEntity;
    });
  }, [logs, searchQuery, selectedEntityType]);

  const toggleRow = (id: number): void => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className={cn("space-y-4 bg-white border border-gray-200 rounded-lg p-5", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-base font-bold text-gray-900">So Kiem Toan Quan Tri (Audit Logs)</h2>
          <p className="text-xs text-gray-500">Nhat ky ghi vet bat bien cac thao tac thay doi he thong</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem thao tac..."
            className="px-2.5 py-1 text-xs border border-gray-300 rounded bg-white"
          />

          {entityTypes.length > 0 && (
            <select
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
              className="px-2.5 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700"
            >
              <option value="">Tat ca thuc the</option>
              {entityTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
          <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-3 py-2">Thoi Gian</th>
              <th className="px-3 py-2">Hanh Dong</th>
              <th className="px-3 py-2">Thuc The</th>
              <th className="px-3 py-2">ID Doi Tuong</th>
              <th className="px-3 py-2">Nguoi Thuc Hien</th>
              <th className="px-3 py-2">IP Address</th>
              <th className="px-3 py-2 text-right">Chi Tiet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-gray-400 italic">
                  Chua co nhat ky kiem toan nao
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-900">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {log.entityType}
                    </td>
                    <td className="px-3 py-2 font-mono text-gray-500 text-[11px]">
                      {log.entityId.substring(0, 8)}...
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {log.userId ? log.userId.substring(0, 8) : "He thong"}
                    </td>
                    <td className="px-3 py-2 font-mono text-gray-400 text-[11px]">
                      {log.ipAddress ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => toggleRow(log.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        {expandedRowId === log.id ? "Thu gon" : "Xem JSON"}
                      </button>
                    </td>
                  </tr>

                  {expandedRowId === log.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-4 py-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                          JSON Payload Details:
                        </span>
                        <pre className="p-2.5 bg-gray-900 text-green-400 rounded text-[11px] font-mono overflow-x-auto max-h-48">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
