"use client";

import { useListNames } from "@/features/inscriptions/hooks/list-inscriptions/filters/useListNames";
import type { AutoCompleteProps } from "antd";
import { AutoComplete, Button } from "antd";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type InscriptionsNameSearchProps = {
  eventId: string;
  onSearch?: (responsible: string | undefined) => void;
};

export default function InscriptionsNameSearch({
  eventId,
  onSearch,
}: InscriptionsNameSearchProps) {
  const [value, setValue] = useState("");

  const { listNames, loading } = useListNames({ eventId });

  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);

  const normalized = useMemo(() => {
    return listNames.map((n) => ({
      id: n.id,
      name: n.name,
      nameLower: n.name.toLowerCase(),
    }));
  }, [listNames]);

  const handleSearchText = (text: string) => {
    setValue(text);
    const query = text.trim().toLowerCase();
    if (!query) {
      setOptions([]);
      return;
    }

    const matches = normalized
      .filter((n) => n.nameLower.includes(query))
      .slice(0, 15)
      .map((n) => ({ value: n.name }));

    setOptions(matches);
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-[420px]">
      <AutoComplete
        value={value}
        options={options}
        style={{ width: "100%" }}
        onSearch={handleSearchText}
        onSelect={(text) => {
          setValue(text);
          handleSearchText(text);
        }}
        onChange={(text) => {
          setValue(text);
          handleSearchText(text);
        }}
        placeholder={loading ? "Carregando..." : "Buscar por nome"}
        allowClear
      />
      <Button
        type="default"
        icon={<Search className="h-4 w-4" />}
        onClick={() => {
          const trimmed = value.trim();
          onSearch?.(trimmed ? trimmed : undefined);
        }}
        className="flex items-center gap-2"
      >
        Buscar
      </Button>
    </div>
  );
}
