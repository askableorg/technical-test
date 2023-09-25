import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../reduxTypes/reduxTypes";

type PrivateRouteProps = {
    element: React.ReactElement;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAdmin) {
            navigate("/unauthorised", { state: { from: location } });
        }
    }, [isAdmin, navigate, location]);

    return isAdmin ? element : null;
};

export default PrivateRoute;
