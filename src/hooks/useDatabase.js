// src/hooks/useDatabase.js
import { useSelector, useDispatch } from "react-redux";
import { setDbName } from "../slices/databaseSlice";

export const useDatabase = () => {
  const dbName = useSelector((state) => state.database.dbName);
  const dispatch = useDispatch();

  const changeDb = async (newDb) => {
    dispatch(setDbName(newDb));
    await new Promise((res) => setTimeout(res, 300));
  }

  return { dbName, changeDb };
};
