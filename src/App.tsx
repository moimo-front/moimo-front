import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routeList } from "./routes/routeList";

const router = createBrowserRouter(routeList);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
