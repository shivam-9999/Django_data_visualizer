import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import FilterBar from "./FilterBar";

interface BusinessData {
  id?: number;
  name?: string;
  revenue?: number;
  profit?: number;
  employees?: number;
  country?: string;
  total_revenue?: number;
  average_revenue?: number;
  total_employees?: number;
  company_count_per_country?: number;
  highest_revenue_per_country?: number;
  total_revenue_by_country?: number;
}

interface ChartDataType {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor: string; }[];

}

const BusinessDashboard: React.FC = () => {
  const [queryData, setQueryData] = useState<BusinessData[] | BusinessData | null>(null);
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof BusinessData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [queryType, setQueryType] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false); // Toggle Add Record Form
  const [newBusiness, setNewBusiness] = useState<BusinessData>({
    name: "",
    revenue: 0,
    profit: 0,
    employees: 0,
    country: "",
  });
  //  Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom width/height
  };

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
      console.log(queryType);
      setQueryType(queryType)



      // Generate chart data
      if (Array.isArray(response.data) && response.data.length > 0) {
        let labels: string[] = [];
        let dataValues: number[] = [];
        let labelName: string = "";

        labels = response.data.map((item) => item.name || "Unknown");
        dataValues = response.data.map((item) => item.revenue || 0);
        labelName = "Revenue of All Businesses";


        // Determine chart data structure based on query type
        switch (queryType) {
          case "all_businesses":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "Revenue of All Businesses";
            break;

          case "large_employers":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.total_employees || 0);
            console.log(dataValues)
            labelName = "Employee Count of Large Employers";

            break;

          case "sorted_by_revenue":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "Businesses Sorted by Revenue";
            break;

          case "sorted_by_profit":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Businesses Sorted by Profit";
            break;

          case "total_revenue":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.total_revenue || 0);
            labelName = "Total Revenue";
            break;

          case "total_revenue_per_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.total_revenue_by_country || 0);
            labelName = "High Revenue Businesses";
            break;

          case "average_profit":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Average Profit per Business";
            break;

          case "average_revenue_per_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.average_revenue || 0);
            labelName = "Average Revenue per Country";
            break;

          case "company_count_per_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.company_count_per_country || 0);
            labelName = "Company Count per Country";
            break;

          case "highest_revenue_country":
            labels = response.data.map((item) => item.country || "Unknown");
            dataValues = response.data.map((item) => item.highest_revenue_per_country || 0);
            labelName = "Highest Revenue Countries";
            break;

          case "top_5_profitable":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Top 5 Profitable Companies";
            break;

          case "usa_companies":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "USA Companies by Revenue";
            break;

          case "low_profit":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.profit || 0);
            labelName = "Low Profit Companies";
            break;

          case "high_revenue":
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = "High Revenue Businesses";
            break;

          default:
            labels = response.data.map((item) => item.name || "Unknown");
            dataValues = response.data.map((item) => item.revenue || 0);
            labelName = queryType.replace(/_/g, " ").toUpperCase();
        }

        setChartData({
          labels,
          datasets: [
            {
              label: labelName,
              data: dataValues,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } else {
        setChartData(null);
      }
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



  /** Function to Handle Adding New Business */
  const handleAddBusiness = async () => {
    if (!newBusiness.name || !newBusiness.country || !newBusiness.revenue || !newBusiness.profit) {
      alert("Please provide at least a name and country for the business.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/business/addrecord/",
        newBusiness
      );

      if (response.status === 201) {
        alert("Business added successfully!");
        fetchQueryData("all_businesses"); // Refresh data
        setShowAddForm(false); // Hide form after adding
        setNewBusiness({
          name: "",
          revenue: 0,
          profit: 0,
          employees: 0,
          country: "",
        });
      }
    } catch (error) {
      console.error("Error adding business:", error);
      alert("Failed to add business.");
    }
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

      {/* Show Add Form Only When Button is Clicked */}
      {showAddForm && (
        <div className="bg-white  shadow p-4 rounded-md mb-4 mt-2">
          <h3 className="text-xl font-semibold mb-2">Add New Business</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Business Name"
              value={newBusiness.name}
              onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Revenue"
              value={newBusiness.revenue}
              onChange={(e) => setNewBusiness({ ...newBusiness, revenue: Number(e.target.value) })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Profit"
              value={newBusiness.profit}
              onChange={(e) => setNewBusiness({ ...newBusiness, profit: Number(e.target.value) })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Employees"
              value={newBusiness.employees}
              onChange={(e) => setNewBusiness({ ...newBusiness, employees: Number(e.target.value) })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Country"
              value={newBusiness.country}
              onChange={(e) => setNewBusiness({ ...newBusiness, country: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={handleAddBusiness}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      )}

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

      {/* const res = queryData.map(obj => obj);
      console.log(res[0].employees); */}


      {chartData && (
        <div className="bg-white shadow p-4 min-h-fit min-w-fit rounded-md mt-4">
          {
            queryType == "large_employers" ? <Pie data={chartData} options={chartOptions} /> : <Bar data={chartData} />
          }
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
