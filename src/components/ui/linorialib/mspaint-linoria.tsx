import LinoriaUI from "./linoria";

export const Library = LinoriaUI({
  Title: "mspaint",
  TabPadding: 0,
})

Library.AddTab("main")

export default function MSPaintLinoria() {
  return <Library.Component />
}