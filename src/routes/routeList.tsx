import MainLayout from "@/components/common/MainLayout";
import Home from "@/pages/Home";
import MeetingDetailPage from "@/pages/meetings/MeetingDetail";
import MeetingsPage from "@/pages/meetings/MeetingsPage";
import Login from "@/pages/user/Login";
import Join from "@/pages/user/Join";
import FindPassword from "@/pages/user/FindPassword";
import ResetPassword from "@/pages/user/ResetPassword";
import MypageSession from "@/pages/mypage/MypageSession";
import Profile from "@/pages/mypage/Profile";
import JoinedMeeting from "@/pages/mypage/JoinedMeeting";
import HostMeeting from "@/pages/mypage/HostMeeting";
import { Navigate } from "react-router-dom";
import MoimerIntro from "@/pages/moimer/MoimerIntro";
import UserInfo from "@/pages/user/UserInfo";
import Chatting from "@/pages/chat/Chatting";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Interests from "@/pages/interests/Interests";
import SampleComp from "@/components/SampleComp";

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
        path: "/meetings/:meetingId",
        element: <MeetingDetailPage />,
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
        path: "/user-info",
        element: <UserInfo />,
      },
      {
        path: "/moimer-intro",
        element: <MoimerIntro />,
      },
      {
        path: "/chats",
        element: <Chatting />,
      },
      {
        path: "/mypage",
        element: (
          <ProtectedRoute>
            <MypageSession />,
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="profile" replace />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "meetings/join",
            element: <JoinedMeeting />,
          },
          {
            path: "meetings/hosting",
            element: <HostMeeting />,
          },
        ],
      },
      {
        path: "/interests",
        element: <Interests />,
      },
    ],
  },
];
