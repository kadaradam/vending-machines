import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "./react-query";
import { RenderRoutes } from "./routes";
import { ThemeStateProvider } from "./theme";

function App() {
  return (
    <ThemeStateProvider>
      <QueryClientProvider>
        <Router>
          <div className="App">
            <RenderRoutes />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeStateProvider>
  );
}

export default App;
