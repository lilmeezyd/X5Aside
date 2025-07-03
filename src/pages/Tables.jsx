import React, { useState } from "react";
import ClassicTable from "./ClassicTable";
import H2hTable from "./H2hTable";
import F1Table from "./F1Table";
import { Button } from "../../@/components/ui/button";
import {
  useUpdateClassicTableMutation,
  useUpdateH2HTableMutation,
} from "../slices/tableApiSlice";
import {
  useTriggerF1CalculationMutation,
} from "../slices/f1ApiSlice";
import { useSelector } from "react-redux";

export default function Tables() {
  const dbName = useSelector((state) => state.database.dbName);
  const [view, setView] = useState("classic");

  const [updateClassicTable, { isLoading: isUpdatingClassic }] =
    useUpdateClassicTableMutation();
  const [updateH2HTable, { isLoading: isUpdatingH2H }] =
    useUpdateH2HTableMutation();
  const [triggerF1, { isLoading: isUpdatingF1 }] = useTriggerF1CalculationMutation();

  const handleUpdate = async () => {
    try {
      if (view === "classic") {
        await updateClassicTable(dbName).unwrap();
      } else if (view === "h2h") {
        await updateH2HTable(dbName).unwrap();
      } else if (view === "f1") {
        await triggerF1(dbName).unwrap();
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
          variant={view === "f1" ? "default" : "outline"}
          onClick={() => setView("f1")}
        >
          F1 Table
        </Button>

        <Button
          variant="secondary"
          onClick={handleUpdate}
          disabled={isUpdatingClassic || isUpdatingH2H || isUpdatingF1}
        >
          {view === "classic"
            ? isUpdatingClassic
              ? "Updating Classic..."
              : "Update Classic"
            : view === "h2h"
            ? isUpdatingH2H
              ? "Updating H2H..."
              : "Update H2H"
            : isUpdatingF1
            ? "Calculating F1..."
            : "Update F1"}
        </Button>
      </div>

      {view === "classic" && <ClassicTable />}
      {view === "h2h" && <H2hTable />}
      {view === "f1" && <F1Table />}
    </div>
  );
}
