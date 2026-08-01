import React from 'react'
import { useSelector } from 'react-redux'
import { useDatabase } from "../hooks/useDatabase";

const SelectDB = () => {
    const dbName = useSelector((state) => state.database.dbName);
    const { changeDb } = useDatabase();
  return (
    <div className="absolute right-0 top-0 text-xs">
        <div className="mb-4">
          {/*<label className="font-semibold">Select Database: </label>*/}
          <select
            value={dbName}
            onChange={(e) => changeDb(e.target.value)}
            className="font-bold ml-2 border px-2 py-1 rounded-lg  border border-gray-400"
          >
            {/*<option value="">-- Select DB --</option>*/}
            {dbName === "ffkPro" && <option value="ffkPro">FFK Pro 2026/27</option>}
            {/*<option value="test">Test</option>*/}
            {dbName.startsWith("app5Aside") && <><option value="app5Aside">WhatsApp 2026/27</option>
            <option value="app5Aside2526">WhatsApp 2025/26</option></>}
            {dbName.startsWith("X5Aside") && <><option value="X5Aside">X5Aside 2026/27</option>
            <option value="X5Aside2526">X5Aside 2025/26</option></>}
          </select>
          {/*<p className="text-sm text-gray-500 mt-1">
            Using database:{" "}
            <span className="font-semibold">
              {dbName === "app5Aside"
                ? "WhatsApp 5 Aside"
                : dbName === "X5Aside"
                  ? "X 5 Aside"
                  : dbName === "ffkPro"
                    ? "FFK Pro"
                    : dbName === "app5Aside2526"
                ? "WhatsApp 5 Aside 2025/26" : dbName === "X5Aside2526"
                  ? "X 5 Aside 2025/26" : "none"}
            </span>
          </p>*/}
        </div>
      
      </div>
  )
}

export default SelectDB
