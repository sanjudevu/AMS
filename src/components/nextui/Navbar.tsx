import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Skeleton, User } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiLogoMediumOld } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";

export default function NavBar() {
    const session = useSession();

    const isLoading = session.status === "loading";
    const isSignedIn = session.status === "authenticated";
    return (
        <Navbar>
            
                <NavbarBrand>
                    <Link href="/" >
                        <BiLogoMediumOld />
                        <p className="ml-2">AMS</p>
                    </Link>
                </NavbarBrand>
           
            <NavbarContent justify="center">
                <NavbarItem>
                    <Link href="/employee" >
                        Employees
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {isLoading ?  <PlaceHolder /> : <UserDropdown isSignedIn={isSignedIn} session={session}/> }
            </NavbarContent>
        </Navbar>
    )
}


function PlaceHolder() {
    return (
        <Skeleton className="flex rounded-full w-12 h-12" />
    )
}

function UserDropdown({isSignedIn, session}: {isSignedIn: boolean, session: undefined}) {
    if (!isSignedIn) { return <SigninButton /> }
    return (
        <Dropdown placement="bottom-start">
            <DropdownTrigger>
            <User
                as="button"
                avatarProps={{
                isBordered: true,
                src: "https://i.pravatar.cc/50",
                }}
                className="transition-transform"
                description={session.data?.user?.type}
                name={session.data?.user?.name}
            />
            
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{session.data?.user?.email}</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={()=>{void signOut()}}>
                Log Out
            </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}


function SigninButton() {
    return (
        <Button color="success" endContent={<IoMdLogOut size={16} />} onClick={() => { void signIn() }} >
            Sign In
        </Button>
    )
}