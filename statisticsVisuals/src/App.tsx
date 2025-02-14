
import BusinessDashboard from "./components/BusinessDashboard";

import FileUpload from "./components/FileUpload";

// import Form from "./components/Form";

function App() {
  return (
    <div className="container mx-auto p-6">
      <FileUpload />
      {/* <Form /> */}
      <BusinessDashboard />
    </div>
  );
}

export default App;

