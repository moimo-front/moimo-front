import MainLayout from "@/components/common/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/user/Login";
import Join from "@/pages/user/Join";
import FindPassword from "@/pages/user/FindPassword";
import ResetPassword from "@/pages/user/ResetPassword";
import ExtraInfo from "@/pages/user/ExtraInfo";
import MoimerIntro from "@/pages/moimer/MoimerIntro";

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
                element: <ExtraInfo />,
            },
            {
                path: "/moimer-intro",
                element: <MoimerIntro />,
            }
        ],
    },
];