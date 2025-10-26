import { BookOpen, ChevronDown, LogOutIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Header = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Clear authentication flag
        localStorage.removeItem("isAuthenticated");
        router.push("/login");
    };

    return (
        <header className="bg-white shadow-sm border-b h-[56px] box-border flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <h1 className="ml-2 text-xl font-semibold text-gray-900">Bookly</h1>
                    </div>


                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-1">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="flex items-center gap-1">
                                <p className="text-sm font-medium text-gray-900">John Doe</p>
                                <ChevronDown size={14} />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator /> */}
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <LogOutIcon color="red" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Header;