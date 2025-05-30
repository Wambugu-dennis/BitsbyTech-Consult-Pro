// src/components/layout/user-profile.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/context/auth-provider'; // Import useAuth

// Mock user data for display when not using AuthContext
const fallbackUser = {
  name: 'Guest User',
  email: 'guest@example.com',
  avatarUrl: 'https://placehold.co/100x100/78909C/FFFFFF.png?text=GU',
};

export default function UserProfile() {
  const { currentUser, logout } = useAuth(); // Use the auth context

  const userToDisplay = currentUser || fallbackUser;

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-auto w-full items-center justify-start gap-2 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={userToDisplay.avatarUrl || `https://placehold.co/100x100.png?text=${userToDisplay.name.substring(0,2).toUpperCase()}`} 
              alt={userToDisplay.name} 
              data-ai-hint="user avatar"
            />
            <AvatarFallback>{userToDisplay.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-left group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate" title={userToDisplay.name}>{userToDisplay.name}</p>
            <p className="text-xs text-muted-foreground truncate" title={userToDisplay.email}>{userToDisplay.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={10} className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
