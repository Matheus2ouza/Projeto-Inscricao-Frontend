'use client';

import { AuthUser } from '@/features/auth/types/userTypes';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui';
import {
  IconDotsVertical,
  IconLogout,
  IconUser,
  IconUserCircle,
} from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface NavUserProps {
  user: AuthUser;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace('/login');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-sidebar-foreground/10 active:bg-sidebar-foreground/10 data-[state=open]:bg-sidebar-foreground/10 hover:text-inherit active:text-inherit data-[state=open]:text-inherit"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image} alt={user.username} />
                <AvatarFallback>
                  {user.username ? (
                    user.username.slice(0, 2).toUpperCase()
                  ) : (
                    <IconUser className="h-5! w-5!" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="navbar-glass-solid w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-none! shadow-xs! shadow-black/10 backdrop-blur-2xl"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback>
                    {user.username ? (
                      user.username.slice(0, 2).toUpperCase()
                    ) : (
                      <IconUser className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-sidebar-foreground/10">
                <IconUserCircle />
                Conta
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout()}
              variant="destructive"
              className="focus:bg-red-500/10"
            >
              <IconLogout />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
