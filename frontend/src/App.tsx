import { useRoutes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Tasks from './pages/Tasks';
import Shop from './pages/Shop';
import Tamago from './pages/Tamago';
import AdminItems from './pages/AdminItems';
import AdminUsers from './pages/AdminUsers';

const App = () => {
  const routes = useRoutes([
    { path: "/", element: <SignUp /> }, // Default route
    { path: "/SignUp", element: <SignUp /> },
    { path: "/SignIn", element: <SignIn /> },
    { path: "/Tasks", element: <Tasks /> },
    { path: "/Shop", element: <Shop /> },
    { path: "/Tamago", element: <Tamago /> },
    { path: "/admin/items", element: <AdminItems /> },
    { path: "/admin/users", element: <AdminUsers /> },
  ]);

  return routes;
};

export default App;
