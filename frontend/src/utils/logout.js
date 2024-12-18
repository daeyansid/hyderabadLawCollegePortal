const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('branchId');
    localStorage.clear();
    sessionStorage.setItem('hasReloaded', 'false');
    sessionStorage.setItem('hasReloadedSuperAdmin', 'false');
    navigate('/');
};

export default logout;