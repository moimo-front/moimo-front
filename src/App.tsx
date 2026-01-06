import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routeList } from "./routes/routeList";

const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element: item.element,
      //errorElement: <Error />
    };
  })
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
