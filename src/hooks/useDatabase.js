// src/hooks/useDatabase.js
import { useSelector, useDispatch } from "react-redux";
import { setDbName } from "../slices/databaseSlice";

export const useDatabase = () => {
  const dbName = useSelector((state) => state.database.dbName);
  const dispatch = useDispatch();

  const changeDb = (newDb) => dispatch(setDbName(newDb));

  return { dbName, changeDb };
};
