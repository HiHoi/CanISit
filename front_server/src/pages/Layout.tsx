import React from "react";
import { useMediaQuery } from 'react-responsive';

import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import TabletLayout from "./TabletLayout";

const Layout = ( children: any ) => {

    const Desktop = () => {
        const isDesktop: any = useMediaQuery({ minWidth: 1024 });
        return (isDesktop && <DesktopLayout>{children}</DesktopLayout>);
    }

    const Tablet = () => {
        const isTablet: any = useMediaQuery({minWidth: 768, maxWidth: 1023})
        return (isTablet && <TabletLayout>{children}</TabletLayout>)
    }

    const Mobile = () => {
        const isMobile: any = useMediaQuery({ maxWidth: 767});
        return (isMobile && <MobileLayout>{children}</MobileLayout>);
    }

    return (
        <>
            <Desktop />
            <Tablet />
            <Mobile />
        </>
    )
}

export default Layout