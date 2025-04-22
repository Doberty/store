"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { getAllBrands } from "../store/lib/data"
import { Skeleton } from "./ui/skeleton"

interface BrandFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedBrands: string[]
  onBrandsChange: (brands: string[]) => void
}

export default function BrandFilterDialog({
  open,
  onOpenChange,
  selectedBrands,
  onBrandsChange,
}: BrandFilterDialogProps) {
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [localSelected, setLocalSelected] = useState<string[]>(selectedBrands)

  useEffect(() => {
    if (open) {
      setLocalSelected(selectedBrands)

      const fetchBrands = async () => {
        setLoading(true)
        try {
          const allBrands = await getAllBrands()
          setBrands(allBrands)
        } catch (error) {
          console.error("Failed to fetch brands:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchBrands()
    }
  }, [open, selectedBrands])

  const handleToggleBrand = (brand: string) => {
    setLocalSelected((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const handleApply = () => {
    onBrandsChange(localSelected)
    onOpenChange(false)
  }

  const handleClear = () => {
    setLocalSelected([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter by Brand</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={localSelected.includes(brand)}
                    onCheckedChange={() => handleToggleBrand(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
