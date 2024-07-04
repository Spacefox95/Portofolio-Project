import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UsersList from "./pages/UsersList";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UploadDoc from "./pages/UploadDoc";
import TaskManager from "./pages/tasks";
import axios from "axios";

const getUserRole = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await axios.get('http://localhost:5000/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.role;
        } catch (error) {
            console.error("Failed to fetch user role", error);
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
            }
        }
    } else {
        console.warn("No token found in localStorage");
    }
    return null;
};

const PrivateRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role);
            setLoading(false);
        };
        fetchRole();
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!token || !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" />;
    }

    return element;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/" element={<PrivateRoute element={<Dashboard />} allowedRoles={['superuser', 'collaborateur', 'invite']} />} />
                <Route path="/profile" element={<PrivateRoute element={<Profile />} allowedRoles={['superuser', 'collaborateur', 'invite']} />} />
                <Route path="/users" element={<PrivateRoute element={<UsersList />} allowedRoles={['superuser', 'collaborateur', 'invite']} />} />
                <Route path="/upload" element={<PrivateRoute element={<UploadDoc />} allowedRoles={['superuser', 'collaborateur']} />} />
                <Route path="/tasks" element={<PrivateRoute element={<TaskManager />} allowedRoles={['superuser', 'collaborateur', 'invite']} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
