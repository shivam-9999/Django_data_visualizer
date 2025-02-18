import React, { useState, useEffect } from "react";
import axios from "axios";
import { BusinessData } from "./types/BusinessData"; // Ensure this matches exactly


interface AddBusinessFormProps {
    fetchQueryData: (queryType: string) => void;
    setShowAddForm: (show: boolean) => void;
    editingRecord: BusinessData | null;
}


const AddBusinessRecords: React.FC<AddBusinessFormProps> = ({ fetchQueryData, setShowAddForm, editingRecord }) => {
    const [newBusiness, setNewBusiness] = useState<BusinessData>({
        name: "",
        revenue: "",
        profit: "",
        employees: "",
        country: "",
    });

    // Populate form fields when editingRecord changes
    useEffect(() => {
        if (editingRecord) {
            setNewBusiness(editingRecord);
        }
    }, [editingRecord]);


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
            if (editingRecord) {
                // Update existing record
                const response = await axios.put(
                    `http://127.0.0.1:8000/api/business/editRecord/${editingRecord.id}/`,
                    newBusiness
                );

                if (response.status === 200) {
                    alert("Business updated successfully!");
                }
            } else {
                // Add new record
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/business/addrecord/",
                    newBusiness
                );

                if (response.status === 201) {
                    alert("Business added successfully!");
                }
            }

            fetchQueryData("all_businesses"); // Refresh data
            setShowAddForm(false); // Hide form after submission
            setNewBusiness({
                id: 0,
                name: "",
                revenue: 0,
                profit: 0,
                employees: 0,
                country: "",
            });
        } catch (error) {
            console.error("Error saving business:", error);
            alert("Failed to save business.");
        }
    };

    return (
        <div className="bg-white shadow p-4 rounded-md mb-4 mt-2">
            <h3 className="text-xl font-semibold mb-2">Add New Business</h3>
            <div className="grid grid-cols-2 gap-4">
                {/* Company Name */}
                <input
                    type="text"
                    placeholder="Business Name"
                    value={newBusiness.name}
                    onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                    className="border p-2 rounded"
                />
                {/* revenue */}
                <input
                    type="number"
                    placeholder="Revenue"
                    value={newBusiness.revenue || ""}
                    onChange={(e) => setNewBusiness({ ...newBusiness, revenue: Number(e.target.value) })}
                    className="border p-2 rounded"
                />
                {/* profit */}
                <input
                    type="number"
                    placeholder="Profit"
                    value={newBusiness.profit || ""}
                    onChange={(e) => setNewBusiness({ ...newBusiness, profit: Number(e.target.value) })}
                    className="border p-2 rounded"
                />
                {/* Employees */}
                <input
                    type="number"
                    placeholder="Employees"
                    value={newBusiness.employees || ""}
                    onChange={(e) => setNewBusiness({ ...newBusiness, employees: Number(e.target.value) })}
                    className="border p-2 rounded"
                />
                {/* Country */}
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
