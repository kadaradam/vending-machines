import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClientProvider } from "./react-query";
import { RenderRoutes } from "./routes";
import { ThemeStateProvider } from "./theme";

function App() {
  return (
    <ThemeStateProvider>
      <QueryClientProvider>
        <Router>
          <ToastContainer autoClose={1500} closeOnClick pauseOnFocusLoss />
          <div className="App">
            <RenderRoutes />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeStateProvider>
  );
}

export default App;
