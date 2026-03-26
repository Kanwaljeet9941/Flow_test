import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app-parent">
      <div className="div1">
        <SubmitButton />
      </div>
      <div className="div2">
        <PipelineToolbar />
      </div>
      <div className="div3">
        <PipelineUI />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
