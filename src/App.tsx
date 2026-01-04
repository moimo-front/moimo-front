import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./components/common/MainLayout";

const routeList = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
];

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
