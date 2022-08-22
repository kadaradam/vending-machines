import { BrowserRouter as Router } from "react-router-dom";
import { RenderRoutes } from "./routes";
import { ThemeStateProvider } from "./theme";

function App() {
  return (
    <ThemeStateProvider>
      <Router>
        <div className="App">
          <RenderRoutes />
        </div>
      </Router>
    </ThemeStateProvider>
  );
}

export default App;
