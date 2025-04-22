import ProductDiscovery from "../components/product-discovery"
import { getProducts } from "../lib/data"

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Discover Products</h1>
        <ProductDiscovery initialProducts={products} />
      </div>
    </main>
  )
}
