import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routeList } from "./routes/routeList";
import { useAuthQuery } from "./hooks/useAuthQuery";

const router = createBrowserRouter(routeList);

function App() {
  // 사용자 인증 상태 확인
  useAuthQuery();

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
