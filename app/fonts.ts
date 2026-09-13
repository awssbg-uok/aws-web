import localFont from "next/font/local";

export const fontEmber = localFont({
  src: [
    {
      path: "../public/fonts/AmazonEmberDisplay_Bd.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/AmazonEmberDisplay_He.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-ember",
  display: "swap",
});

export const fontEmberMono = localFont({
  src: [
    {
      path: "../public/fonts/AmazonEmberMono_Rg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/AmazonEmberMono_Bd.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ember-mono",
  display: "swap",
});
