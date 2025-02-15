import React, { useState, useEffect } from "react";
import axios from "axios";
import "chart.js/auto";
import FilterBar from "./FilterBar";
import AddBusinessRecords from "./AddBusinessRecords";
import BusinessChart from "./BusinessChart"; // Import the new component


interface BusinessData {
  id?: number;
  name?: string;
  revenue?: string | number;
  profit?: string | number;
  employees?: string | number;
  country?: string;
  total_revenue?: number;
  average_revenue?: number;
  total_employees?: number;
  company_count_per_country?: number;
  highest_revenue_per_country?: number;
  total_revenue_by_country?: number;
}



const BusinessDashboard: React.FC = () => {
  const [queryData, setQueryData] = useState<BusinessData[] | BusinessData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof BusinessData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [queryType, setQueryType] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false); // Toggle Add Record Form



  useEffect(() => {
    if (Array.isArray(queryData)) {
      const res = queryData.map(obj => obj);
      console.log(res[0].employees);


    } else if (queryData) {
      console.log([queryData]); // Convert single object to array
    }
  }, [queryData])



  const fetchQueryData = async (queryType: string) => {
    setLoading(true);
    try {
      const response = await axios.get<BusinessData[] | BusinessData>(
        `http://127.0.0.1:8000/api/business/queries/${queryType}/`
      );

      setQueryData(response.data);
      setQueryType(queryType)



    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueryData("all_businesses");
  }, []);

  /** SORTING LOGIC **/
  const handleSort = (column: keyof BusinessData) => {
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

  /** FUNCTION TO DISPLAY SORT ICONS **/
  const getSortIndicator = (column: keyof BusinessData) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "↕";
  };





  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Business Data Dashboard</h2>
      <FilterBar onFilterSelect={fetchQueryData} />

      {/* Toggle Add Form Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showAddForm ? "Cancel" : "Add Record"}
      </button>

      {/* Show AddBusinessForm Only When Button is Clicked */}
      {showAddForm && <AddBusinessRecords fetchQueryData={fetchQueryData} setShowAddForm={setShowAddForm} />}

      {loading && <p className="text-gray-500 mb-2">Loading...</p>}


      {queryData && (
        <div className="bg-white max-h-screen overflow-scroll shadow p-4 rounded-md">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(Array.isArray(queryData) ? queryData[0] : queryData).map((key) => (
                  <th key={key}
                    className="border px-2 py-1 text-left"
                    onClick={() => handleSort(key as keyof BusinessData)}
                  >
                    {key.toUpperCase()} {getSortIndicator(key as keyof BusinessData)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(queryData) ? (
                queryData.map((row, idx) => (
                  <tr key={idx} className="border">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="border px-2  py-1">
                        {typeof val === "number" ? val.toLocaleString() : (val as string)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  {Object.values(queryData).map((val, i) => (
                    <td key={i} className="border px-2 py-1">
                      {typeof val === "number" ? val.toLocaleString() : (val as string)}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Render the BusinessChart Component */}
      <BusinessChart
        queryData={Array.isArray(queryData) ? queryData : null}
        queryType={queryType}
      />
    </div>
  );
};

export default BusinessDashboard;