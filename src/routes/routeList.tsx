import MainLayout from "@/components/common/MainLayout";
import Home from "@/pages/Home";
import MeetingsPage from "@/pages/meetings/MeetingsPage";
import Login from "@/pages/user/Login";
import Join from "@/pages/user/Join";
import FindPassword from "@/pages/user/FindPassword";
import ResetPassword from "@/pages/user/ResetPassword";
import MoimerIntro from "@/pages/moimer/MoimerIntro";
import UserInfo from "@/pages/user/UserInfo";

export const routeList = [
  {
    path: "/",
    element: <MainLayout />,
    // errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/meetings",
        element: <MeetingsPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/join",
        element: <Join />,
      },
      {
        path: "/find-password",
        element: <FindPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/extra-info",
        element: <UserInfo />,
      },
      {
        path: "/moimer-intro",
        element: <MoimerIntro />,
      }
    ],
  },
];