import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { FlagIcon, FlagIconCode } from "react-flag-kit";
import "flag-icon-css/css/flag-icons.min.css";
import Logo from "/logo.png";

// Define the supported languages
const languages = [
  { code: "en", name: "English", countryCode: "gb", flagIcon: "GB" }, // 'gb' for Great Britain
  { code: "es", name: "Español", countryCode: "es", flagIcon: "ES" },
  { code: "pt", name: "Português", countryCode: "pt", flagIcon: "PT" },
];

const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.substring(0, 2).toLowerCase();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Get the current language data
  const currentLangData =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const menuItems = [
    { href: "#home", label: t("header.home") },
    { href: "#services", label: t("header.services") },
    { href: "#about", label: t("header.about") },
    { href: "#contact", label: t("header.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* Logo */}
        <a className="flex items-center space-x-2" href="/">
          <img src={Logo} alt="Ibero Data" className="h-8 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {menuItems.map((item) => (
            <a
              key={item.href}
              className="transition-colors hover:text-primary"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-auto px-2 font-normal"
                aria-label="Toggle language"
              >
                <span className="mr-2">
                  <FlagIcon
                    code={currentLangData.flagIcon as FlagIconCode}
                    size={18}
                    aria-hidden="true"
                  />
                </span>
                {currentLangData.name}
                <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="mr-2">
                      <FlagIcon
                        code={language.flagIcon as FlagIconCode}
                        size={18}
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className={
                        currentLanguage === language.code ? "font-bold" : ""
                      }
                    >
                      {language.name}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  Ibero Data
                  <img
                    src={Logo}
                    alt="Ibero Data"
                    className="h-8 w-auto ml-2"
                  />
                </SheetTitle>
                <SheetDescription>
                  {t("header.mobileMenuDescription")}
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col space-y-4 mt-4">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    className="transition-colors hover:text-primary"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
