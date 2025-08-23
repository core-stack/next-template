"use client";

import { useTranslations } from 'next-intl';

import { GenericTable } from '@/components/generic-table';
import { useApiQuery } from '@/hooks/use-api-query';
import { formatBytes } from '@/utils/bytes-format';

export const SourceTable = () => {
  const { data } = useApiQuery("[GET] /api/tenant/:slug/source");
  const t = useTranslations();

  return (
    <GenericTable
      columns={[
        { accessorKey: 'name', header: t/*i18n*/("Name") },
        { accessorKey: "sourceType", header: t/*i18n*/("Type") },
        { accessorKey: "size", header: t/*i18n*/("Size"), cell: ({ row }) => row.original.size ? formatBytes(row.original.size) : "-" },
        { accessorKey: "createdAt", header: t/*i18n*/("Created at") },
        { accessorKey: "indexStatus", header: t/*i18n*/("Index status") },
      ]}
      data={data ?? []}
    />
  )
}