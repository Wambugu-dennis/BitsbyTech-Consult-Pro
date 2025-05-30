
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { useAuth } from "@/context/auth-provider"; // Import useAuth
import Link from "next/link";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    // This shouldn't ideally be reached if AppLayout correctly gatekeeps,
    // but as a fallback or for scenarios where UserProfile might be rendered conditionally elsewhere.
    return null; 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-auto w-full items-center justify-start gap-2 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={currentUser.avatarUrl || `https://placehold.co/100x100.png?text=${currentUser.name.substring(0,2).toUpperCase()}`} 
              alt={currentUser.name} 
              data-ai-hint="user avatar"
            />
            <AvatarFallback>{currentUser.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-left group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate" title={currentUser.name}>{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate" title={currentUser.email}>{currentUser.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={10} className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings"> {/* Assuming settings page is at /settings and account is default tab or handled there */}
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span> {/* Link to Profile/Account settings */}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
