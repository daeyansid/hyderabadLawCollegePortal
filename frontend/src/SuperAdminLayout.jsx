import Nav from './layout/super-admin/nav';
import Aside from './layout/super-admin/aside';
import { Outlet } from 'react-router-dom';

export default function SuperAdminLayout() {
    return (
        <>
            <Nav />
            <Aside />
            <div className="flex flex-col min-h-screen ml-0 w-auto sm:ml-64">
                <main className="flex-1 p-4 bg-custom-backGround-content">
                    <div className="p-4 mt-14">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
}
