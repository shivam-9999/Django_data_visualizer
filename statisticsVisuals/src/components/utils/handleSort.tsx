/** SORTING LOGIC **/

import { BusinessData } from "../types/BusinessData"

export const handleSort = (
    column: keyof BusinessData,
    sortColumn: keyof BusinessData | null,
    sortOrder: "asc" | "desc",
    setSortColumn: (column: keyof BusinessData) => void,
    setSortOrder: (order: "asc" | "desc") => void,
    queryData: BusinessData[] | BusinessData | null,
    setQueryData: (data: BusinessData[]) => void) => {

    if (!Array.isArray(queryData)) {
        return; // Exit early if queryData is not an array
    }

    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);

    if (Array.isArray(queryData)) {
        const sortedData = [...queryData].sort((a, b) => {
            const valueA = a[column] ?? "";
            const valueB = b[column] ?? "";

            if (typeof valueA === "number" && typeof valueB === "number") {
                return order === "asc" ? valueA - valueB : valueB - valueA;
            }

            return order === "asc"
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });

        setQueryData(sortedData);
    }
};