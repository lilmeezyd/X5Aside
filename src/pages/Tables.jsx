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
import CombinedTable from "./CombinedTable";

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
       const res = await updateClassicTable(dbName).unwrap();
        console.log(res);
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
    <div className=" mt-15 md:mt-0 sm:w-full">
    
    <div className="space-y-6">
      <div className="flex justify-center gap-2 mb-4">
        <Button
          variant={view === "classic" ? "default" : "outline"}
          onClick={() => setView("classic")}
        >
          {dbName === "ffkPro" ? "Standings" : "Classic Table"}
        </Button>
        {dbName !== "ffkPro" && <Button
          variant={view === "h2h" ? "default" : "outline"}
          onClick={() => setView("h2h")}
        >
          H2H Table
        </Button>}
        {/*<Button
          variant={view === "combined" ? "default" : "outline"}
          onClick={() => setView("combined")}
        >
          Combined Table
        </Button>*/}
        {dbName !== "ffkPro" && <Button
          variant={view === "f1" ? "default" : "outline"}
          onClick={() => setView("f1")}
        >
          F1 Table
        </Button>}

    
      </div>

      {view === "classic" && <ClassicTable />}
      {view === "h2h" && <H2hTable />}
      {view === "f1" && <F1Table />}
      {view === "combined" && <CombinedTable />}
    </div>
    </div>
  );
}
