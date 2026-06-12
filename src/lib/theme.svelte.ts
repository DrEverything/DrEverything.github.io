import { browser } from "$app/environment";

class ThemeState {
  current = $state<"dark" | "light">("dark");

  init() {
    if (browser) {
      const theme = localStorage.getItem("theme");
      if (theme === "light") {
        this.current = "light";
        document.documentElement.classList.remove("dark");
      } else {
        this.current = "dark";
        document.documentElement.classList.add("dark");
      }
    }
  }

  toggle() {
    if (browser) {
      if (this.current === "dark") {
        this.current = "light";
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        this.current = "dark";
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    }
  }
}

export const themeState = new ThemeState();
