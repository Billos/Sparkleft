import { Method } from "./method"

export interface ButtonListItem {
  key: string
  label: string
  action: string
  method?: Method
  backgroundColor?: string | null
  rightIcon?: string
}
