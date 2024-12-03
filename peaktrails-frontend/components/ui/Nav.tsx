import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";

const Nav = () => {
  return (
    <header className="absolute w-full text-white p-4 z-10 px-[6.5rem]">
      <nav className="flex justify-between items-center  mx-auto relative">
        <Link href="/" className="flex items-center space-x-4">
          <Image
            src="/images/logo.png"
            alt="PeakTrails logo"
            width={80}
            height={80}
          />
          <h1 className="text-2xl font-bold pt-[0.3rem]">PeakTrails </h1>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex space-x-8 text-lg">
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="hover:text-gray-300">
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger className="hover:text-gray-300">
                Routes
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute top-full left-0 bg-gray-700 p-2 rounded-lg shadow-lg w-40">
                <ul className="flex flex-col">
                  <li>
                    <NavigationMenuLink
                      href="/routes/my-routes"
                      className="hover:text-gray-300 px-4 py-2"
                    >
                      My routes
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      href="/routes/create-route"
                      className="hover:text-gray-300 px-4 py-2"
                    >
                      Create route
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/login" className="hover:text-gray-300">
                Login
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
};

export default Nav;
