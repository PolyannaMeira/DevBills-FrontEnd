import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../context/AuthContext";


const PrivateRoutes = () => {   
    const {authState} = useAuth();
    
    if(!authState.user){
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}

export default PrivateRoutes;