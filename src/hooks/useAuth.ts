import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout as logoutAction } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );

    const logout = async () => {
        try {
            // First dispatch the logout action
            await dispatch(logoutAction());
            
            // Clear all local storage
            localStorage.clear();
            
            // Force navigation to login page
            navigate('/login', { 
                replace: true,
                state: { from: window.location.pathname }
            });
            
            // Optional: Force page reload to clear any remaining state
            // window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
            // Still try to navigate even if there's an error
            navigate('/login', { replace: true });
        }
    };

    return {
        user,
        isAuthenticated,
        logout,
    };
}; 