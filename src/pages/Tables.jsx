import React, { useState } from "react";
import ClassicTable from "./ClassicTable";
import H2hTable from "./H2hTable";
import { Button } from "../../@/components/ui/button";
import {
  useUpdateClassicTableMutation,
  useUpdateH2HTableMutation,
} from "../slices/tableApiSlice";

export default function Tables() {
  const [view, setView] = useState("classic");

  const [updateClassicTable, { isLoading: isUpdatingClassic }] =
    useUpdateClassicTableMutation();
  const [updateH2HTable, { isLoading: isUpdatingH2H }] =
    useUpdateH2HTableMutation();

  const handleUpdate = async () => {
    try {
      if (view === "classic") {
        await updateClassicTable().unwrap();
      } else {
        await updateH2HTable().unwrap();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={view === "classic" ? "default" : "outline"}
          onClick={() => setView("classic")}
        >
          Classic Table
        </Button>
        <Button
          variant={view === "h2h" ? "default" : "outline"}
          onClick={() => setView("h2h")}
        >
          H2H Table
        </Button>

        <Button
          variant="secondary"
          onClick={handleUpdate}
          disabled={isUpdatingClassic || isUpdatingH2H}
        >
          {view === "classic"
            ? isUpdatingClassic
              ? "Updating Classic..."
              : "Update Classic"
            : isUpdatingH2H
            ? "Updating H2H..."
            : "Update H2H"}
        </Button>
      </div>

      {view === "classic" && <ClassicTable />}
      {view === "h2h" && <H2hTable />}
    </div>
  );
}
