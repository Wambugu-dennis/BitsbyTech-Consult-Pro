
// src/components/layout/user-profile.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";

// Mock user data for display when not using AuthContext
const mockUser = {
  name: 'Alex Mercer (Admin)',
  email: 'alex.mercer@consult.com',
  avatarUrl: 'https://placehold.co/100x100/78909C/FFFFFF.png?text=AM',
};

export default function UserProfile() {
  const handleLogout = () => {
    // In a real app, this would clear session, cookies, etc.
    // For this pre-auth version, it could redirect to a conceptual login or do nothing.
    alert("Logout functionality would be implemented here.");
    // Simulate redirect to a non-existent login page for demo of action
    // window.location.href = '/login-placeholder'; 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-auto w-full items-center justify-start gap-2 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={mockUser.avatarUrl} 
              alt={mockUser.name} 
              data-ai-hint="user avatar"
            />
            <AvatarFallback>{mockUser.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-left group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate" title={mockUser.name}>{mockUser.name}</p>
            <p className="text-xs text-muted-foreground truncate" title={mockUser.email}>{mockUser.email}</p>
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
