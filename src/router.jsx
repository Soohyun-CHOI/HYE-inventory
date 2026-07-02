import {Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import OrderForm from "./pages/OrderForm.jsx";
import History from "./pages/History.jsx";
import CatalogManage from "./pages/admin/CatalogManage.jsx";
import UserManage from "./pages/admin/UserManage.jsx";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/orders/new" element={<OrderForm/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/admin/catalog" element={<CatalogManage/>}/>
            <Route path="/admin/users" element={<UserManage/>}/>
        </Routes>
    );
}
