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

  const entityTypes = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.entityType))).filter(Boolean);
  }, [logs]);

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
    <div className={cn("space-y-4 bg-[#0f1011] border border-[#23252a] rounded-xl p-6 text-[#f7f8f8]", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#23252a]">
        <div>
          <h2 className="text-base font-bold text-[#f7f8f8]">So Kiem Toan Quan Tri (Audit Logs)</h2>
          <p className="text-xs text-[#8a8f98] mt-0.5">Nhat ky ghi vet bat bien cac thao tac thay doi he thong</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem thao tac..."
            className="px-2.5 py-1 text-xs bg-[#141516] border border-[#23252a] rounded-md text-[#f7f8f8] placeholder-[#62666d] focus:outline-hidden focus:border-[#5e6ad2]"
          />

          {entityTypes.length > 0 && (
            <select
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
              className="px-2.5 py-1 text-xs bg-[#141516] border border-[#23252a] rounded-md text-[#d0d6e0] focus:outline-hidden focus:border-[#5e6ad2]"
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
        <table className="min-w-full divide-y divide-[#23252a] text-left text-xs">
          <thead className="bg-[#141516] text-[#8a8f98] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-3 py-2.5">Thoi Gian</th>
              <th className="px-3 py-2.5">Hanh Dong</th>
              <th className="px-3 py-2.5">Thuc The</th>
              <th className="px-3 py-2.5">ID Doi Tuong</th>
              <th className="px-3 py-2.5">Nguoi Thuc Hien</th>
              <th className="px-3 py-2.5">IP Address</th>
              <th className="px-3 py-2.5 text-right">Chi Tiet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23252a]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-[#62666d] italic">
                  Chua co nhat ky kiem toan nao
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-[#141516] transition-colors">
                    <td className="px-3 py-2.5 text-[#8a8f98] whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 font-bold">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#18191a] text-[#828fff] border border-[#23252a]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-[#d0d6e0]">
                      {log.entityType}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[#62666d] text-[11px]">
                      {log.entityId.substring(0, 8)}...
                    </td>
                    <td className="px-3 py-2.5 text-[#8a8f98]">
                      {log.userId ? log.userId.substring(0, 8) : "He thong"}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[#62666d] text-[11px]">
                      {log.ipAddress ?? "-"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleRow(log.id)}
                        className="text-[#5e6ad2] hover:text-[#828fff] font-semibold cursor-pointer transition-colors"
                      >
                        {expandedRowId === log.id ? "Thu gon" : "Xem JSON"}
                      </button>
                    </td>
                  </tr>

                  {expandedRowId === log.id && (
                    <tr className="bg-[#141516]">
                      <td colSpan={7} className="px-4 py-3">
                        <span className="text-[10px] font-bold text-[#8a8f98] uppercase block mb-1">
                          Chi Tiet Du Lieu JSON:
                        </span>
                        <pre className="p-3 bg-[#010102] text-[#27a644] border border-[#23252a] rounded-lg text-[11px] font-mono overflow-x-auto max-h-48">
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
