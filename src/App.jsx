import {BrowserRouter, Link} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext.jsx';
import AppRouter from './router.jsx';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <nav>
                    <Link to="/">Dashboard</Link>
                    <Link to="/orders/new">New Order</Link>
                    <Link to="/history">History</Link>
                    <Link to="/admin/catalog">Catalog Admin</Link>
                </nav>
                <main>
                    <AppRouter/>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
}
