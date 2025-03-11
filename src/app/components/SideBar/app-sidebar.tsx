//import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { Home, Search, Settings, Star, ForkKnife} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/homepage",
    icon: Home,
  },
  /* {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  }, */
  {
    title: "Search",
    url: "/restaurants",
    icon: Search,
  },
  {
    title: "Favorites",
    url: "/favorite-restaurants",
    icon: Star
  },
  {
    title: "My Restaurants",
    url: "/my-restaurants",
    icon: ForkKnife
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

/* interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
} */

export function AppSidebar(/* { isOpen, onToggle }: AppSidebarProps */) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Seatify</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
