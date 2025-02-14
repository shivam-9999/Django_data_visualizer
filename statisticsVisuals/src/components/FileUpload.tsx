import React, { useState, ChangeEvent, DragEvent } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");

    // Handle file selection via click
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const allowedTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
            if (!allowedTypes.includes(selectedFile.type)) {
                alert("Invalid file type! Please upload an Excel file (.xlsx or .xls).");
                return;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    // Handle Drag & Drop Upload
    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files?.[0];
        if (selectedFile) {
            const allowedTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
            if (!allowedTypes.includes(selectedFile.type)) {
                alert("Invalid file type! Please upload an Excel file (.xlsx or .xls).");
                return;
            }
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    // Handle file upload to backend
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("office", file); // Ensure this matches your Django API field name

        try {
            const response = await axios.post("http://localhost:8000/api/business/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Upload Success:", response.data);
            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to upload file.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full ">
            <div className="w-full ">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-28 border-2 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col items-center justify-center ">
                        {/* Upload Icon */}
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>

                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop (.xlsx, .xlx)
                        </p>
                    </div>

                    {/* Hidden File Input */}
                    <input id="dropzone-file" type="file" accept=".xlsx .xls" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            <div className=" flex-col">
                {/* Show Selected File Name */}
                {fileName && (
                    <p className="text-gray-500 text-sm font-medium mt-3">
                        📄 Selected File: <span className="font-semibold">{fileName}</span>
                    </p>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={!file}
                    className={`mt-4 px-8 py-2 rounded-md text-white ${file ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                        } transition`}
                >
                    Upload File
                </button>
            </div>

        </div>
    );
};

export default FileUpload;
