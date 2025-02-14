import React, { useState } from "react";
import axios from "axios";

interface BusinessData {
    name: string;
    revenue: string | number;
    profit: string | number;
    employees: string | number;
    country: string;
}

interface AddBusinessFormProps {
    fetchQueryData: (queryType: string) => void;
    setShowAddForm: (show: boolean) => void;
}

const AddBusinessRecords: React.FC<AddBusinessFormProps> = ({ fetchQueryData, setShowAddForm }) => {
    const [newBusiness, setNewBusiness] = useState<BusinessData>({
        name: "",
        revenue: "",
        profit: "",
        employees: "",
        country: "",
    });

    /** Function to Handle Adding New Business */
    const handleAddBusiness = async () => {
        if (!newBusiness.name) {
            alert("Please provide Business name.");
            return;
        }
        if (!newBusiness.revenue) {
            alert("Please provide revenue");
            return;
        }
        if (!newBusiness.profit) {
            alert("Please provide profit");
            return;
        }
        if (!newBusiness.employees) {
            alert("Please provide employees");
            return;
        }
        if (!newBusiness.country) {
            alert("Please provide country");
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
        <div className="bg-white shadow p-4 rounded-md mb-4 mt-2">
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
                    value={newBusiness.revenue || ""}
                    onChange={(e) => setNewBusiness({ ...newBusiness, revenue: Number(e.target.value) })}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Profit"
                    value={newBusiness.profit || ""}
                    onChange={(e) => setNewBusiness({ ...newBusiness, profit: Number(e.target.value) })}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Employees"
                    value={newBusiness.employees || ""}
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
    );
};

export default AddBusinessRecords;
