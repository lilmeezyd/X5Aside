import { useEffect, useState, useMemo }from 'react'
import { useSelector } from "react-redux";
import {
  useGetClassicTableQuery,
  useGetPartialClassicTableQuery,
  useGetH2HTableQuery,
  useGetPartialH2HTableQuery,
} from "../slices/tableApiSlice";

const CombinedTable = () => {
    const dbName = useSelector((state) => state.database.dbName);
    const { data: h2h = [], isLoading: isLoadingH2H } = useGetH2HTableQuery(dbName);
    const { data: classic = [], isLoading: isLoadingClassic } = useGetClassicTableQuery(dbName);
    const combined = useMemo(() => {
        return [...h2h, ...classic].map(x => {
            return {
                ...x, id: x?.team?.id
            }
        }).reduce((acc, curr) => {
            let currId = curr.id
            return acc
        }, [])
    }, [h2h, classic])
    console.log(combined)
  return (
    <div>
      Combined Table
    </div>
  )
}

export default CombinedTable
