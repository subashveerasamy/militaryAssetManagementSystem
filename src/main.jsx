import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Purchase from './Components/Purchase.jsx';
import PurchaseHistory from './Components/PurchaseHistory.jsx';
import Transfer from './Components/Transfer.jsx';
import Assign from './Components/Assign.jsx';
import Reports from './Components/Reports.jsx';
import ResetPassword from './Components/ResetPassword.jsx';
import CreateNewPassword from './Components/CreateNewPassword.jsx';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/resetpassword",
        element: <ResetPassword />
    },
    {
        path: "/newpassword/:username",
        element: <CreateNewPassword />
    },
    {
        path: "/app",
        element: <App />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />
            },
            {
                path: "purchase",
                element: <PurchaseHistory />
            },
            {
                path: "newpurchase",
                element: <Purchase />
            },
            {
                path: "transfer",
                element: <Transfer />
            },
            {
                path: "assign",
                element: <Assign />
            },
            {
                path: "reports",
                element: <Reports />
            }
        ]
    }
])
createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />

)
