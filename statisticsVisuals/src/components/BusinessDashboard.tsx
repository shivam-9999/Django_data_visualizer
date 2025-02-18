import React, { useState, useEffect } from "react";
import axios from "axios";
import "chart.js/auto";
import FilterBar from "./FilterBar";
import AddBusinessRecords from "./AddBusinessRecords";
import BusinessChart from "./BusinessChart"; // Import the new component
import { BusinessData } from "./types/BusinessData"
import { handleSort } from "./utils/handleSort";


const BusinessDashboard: React.FC = () => {
  const [queryData, setQueryData] = useState<BusinessData[] | BusinessData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof BusinessData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [queryType, setQueryType] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false); // Toggle Add Record Form
  const [editingRecord, setEditingRecord] = useState<BusinessData | null>(null); // NEW: Store editing record

  // handle fetch query data
  const fetchQueryData = async (queryType: string) => {
    setLoading(true);
    try {
      const response = await axios.get<BusinessData[] | BusinessData>(
        `http://0.0.0.0:8000/api/business/queries/${queryType}/`
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

  // **NEW: Function to handle Edit Click**
  const handleEdit = (record: BusinessData) => {
    setEditingRecord({
      id: record.id ?? 0,
      name: record.name ?? "",  // Default to an empty string
      revenue: record.revenue ?? 0,
      profit: record.profit ?? 0,
      employees: record.employees ?? 1,
      country: record.country ?? "",
    });
    setShowAddForm(true);
  };

  //  Delete individal record
  const handleDelete = async (id: number) => {
    if (id === undefined) {
      alert("Invalid record ID.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await fetch(`http://0.0.0.0:8000/api/business/delete_record_by_Id/?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record with ID: ${ id }");
      }

      // Refresh UI by removing deleted row
      setQueryData((prevData) =>
        Array.isArray(prevData) ? prevData.filter((row) => row.id !== id) : null
      );

      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete record.");
    }
  };

  //  Delete all record
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all records? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("http://0.0.0.0:8000/api/business/delete-all-businesses/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.reload();
        alert("All records have been deleted successfully!");
        // Optionally, refresh the data

      } else {
        alert("Failed to delete records. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting records:", error);
      alert("An error occurred while deleting records.");
    }
  };


  // fetch all businesses data on first render
  useEffect(() => {
    fetchQueryData("all_businesses");
  }, []);

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
        onClick={() => {
          setShowAddForm(!showAddForm);
          setEditingRecord(null); // Reset editing mode
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showAddForm ? "Cancel" : "Add Record"}
      </button>

      {/* Show AddBusinessForm Only When Button is Clicked */}
      {showAddForm && <AddBusinessRecords fetchQueryData={fetchQueryData} setShowAddForm={setShowAddForm} editingRecord={editingRecord} />}

      {loading && <p className="text-gray-500 mb-2">Loading...</p>}


      {/* Displaying data into table according to filter  */}
      {
        queryData && (Array.isArray(queryData) ? queryData.length > 0 : queryData !== null) && (
          <div className="bg-white max-h-screen overflow-scroll shadow p-4 rounded-md">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(Array.isArray(queryData) ? queryData[0] : queryData).map((key) => (
                    <th key={key}
                      className="border px-2 py-1 text-left"
                      onClick={() => handleSort(
                        key as keyof BusinessData,
                        sortColumn,
                        sortOrder,
                        setSortColumn,
                        setSortOrder,
                        Array.isArray(queryData) ? queryData : [queryData],
                        setQueryData)}
                    >
                      {key.toUpperCase()} {getSortIndicator(key as keyof BusinessData)}
                    </th>
                  ))}
                  <th className="border px-2 py-1 text-left">EDIT</th>
                  <th className="border px-2 py-1 text-left">DELETE</th>
                </tr>
              </thead>
              {/* Table rows */}
              <tbody>
                {Array.isArray(queryData) ? (
                  queryData.map((row, idx) => (

                    <tr key={idx} className="border">
                      {/* Object.values : mapping object to array */}
                      {/* value, */}
                      {Object.values(row).map((val, i) => (   // 
                        <td key={i} className="border px-2  py-1">
                          {typeof val === "number" ? val.toLocaleString() : (val as string)}
                        </td>
                      ))}

                      <td className="border px-2 py-1">
                        <button
                          onClick={() => handleEdit(row)} // NEW: Handle Edit
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </td>
                      {/* Delete Button */}
                      <td className="border px-2 py-1">
                        {row.id != undefined ? (
                          <button
                            onClick={() => handleDelete(row.id!)}
                            className="bg-rose-400 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span> // Handle case where id is missing
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {Object.values(queryData).map((val, i) => (
                      <td key={i} className="border px-2 py-1">
                        {typeof val === "number" ? val.toLocaleString() : (val as string)}
                      </td>
                    ))}

                    {/* edit button for asingle record */}
                    <td className="border px-2 py-1">
                      {queryData.id != undefined ? (
                        <button
                          onClick={() => handleDelete(queryData.id!)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>) : (
                        <span className="text-gray-400">N/A</span> // If id is missing, show "N/A" instead of button
                      )}
                    </td>
                    {/* Delete Button for single record */}
                    <td className="border px-2 py-1">
                      {queryData.id != undefined ? (
                        <button
                          onClick={() => handleDelete(queryData.id!)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>) : (
                        <span className="text-gray-400">N/A</span> // If id is missing, show "N/A" instead of button
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        )
      }
      <button onClick={handleDeleteAll} className="m-4 bg-red-300 text-white px-4 py-2 rounded hover:bg-red-500"> Delete all Records</button>
      {/* Render the BusinessChart Component */}

      <BusinessChart
        queryData={Array.isArray(queryData) && queryData.length > 1 ? queryData : null}
        queryType={queryType}
      />
    </div >
  );
};

export default BusinessDashboard;