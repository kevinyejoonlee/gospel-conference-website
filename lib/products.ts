export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: "conference-ticket",
    name: "Gospel Conference 2025 Registration",
    description: "Christ the True and Better - March 18-20, 2025 (Grades 7-12)",
    priceInCents: 9000, // $90.00 CAD
  },
]
