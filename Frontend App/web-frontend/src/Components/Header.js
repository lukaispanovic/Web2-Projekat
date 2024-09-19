import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { getUserFromLocalStorage } from "../DataModel/User";

function Header() {
    const nav = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [verified, setVerified] = useState(null);

    const location = useLocation();
    
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('encodedtoken');
        setUserRole('');
        nav('/login');
    }
    useEffect(() => {
        setUserRole('');
        const currentPath = location.pathname;
        if(currentPath === '/login' || currentPath === '/register' || currentPath === '/inprogress'){
            return;
        }
        var token = localStorage.getItem('token');
        var user =  getUserFromLocalStorage();
        if (token && user) {
            setUserRole(user.Role());
            setVerified(user.isVerified());
        }
    }, [])
    return (
        <div style={{ backgroundColor: '#000000' }}>
            <Nav style={{ borderBottom: '3px solid #b0b0b0' }} >
                {userRole === 'Admin' && (
                    <Nav.Item>
                        <Link to='/home/admin/adminPanel' className={` nav-link  ${location.pathname === '/home/admin/adminPanel' ? 'active link-light ' : 'link-light hoverLink '}`}>
                            Panel
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Admin' && (
                    <Nav.Item>

                        <Link to='/home/admin/verifyDrivers' className={`nav-link  ${location.pathname === '/home/admin/verifyDrivers' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Verifications
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'User' && (
                    <Nav.Item>
                        <Link to='/home/previousRides' className={`nav-link  ${location.pathname === '/home/previousRides' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Passenger Panel
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'User' && (
                    <Nav.Item>
                        <Link to='/home/newRide' className={`nav-link  ${location.pathname === '/home/newRide' ? 'active link-light' : 'link-light hoverLink '}`}>
                            New order
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Driver' && (
                    <Nav.Item>
                        <Link to='/home/driver/previousRides' className={`nav-link  ${location.pathname === '/home/driver/previousRides' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Previous Rides
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Driver' && (
                    <Nav.Item>
                        <Link to='/home/driver/newRides' className={`nav-link  ${location.pathname === '/home/driver/newRides' ? 'active link-light' : 'link-light hoverLink '}`}>
                            New Rides
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'Driver' && verified === 'false' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'red' }}>Account not verified!</Link>
                    </Nav.Item>

                )}

                {userRole === 'Driver' && verified === '' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'yellow' }}>Verification pending!</Link>
                    </Nav.Item>
                )}
                {userRole && (
                    <Nav.Item className={`${userRole === 'Driver' ? '' : 'ms-auto'}`}>
                        <Link to='/home/profile' className={`nav-link  ${location.pathname === '/home/profile' ? 'active link-light' : 'link-light hoverLink '}`}>
                            Edit profile
                        </Link>
                    </Nav.Item>
                )}
                {userRole && (
                    <Nav.Item >
                        <Button variant="outline-success" onClick={logout} className='btn btn-link link-light text-decoration-none'>
                            Log out
                        </Button>
                    </Nav.Item>

                )}
            </Nav>
        </div>
    )
}
export default Header;