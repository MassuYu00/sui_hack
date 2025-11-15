'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [sports, setSports] = useState<string[]>([])
  const [fundingRange, setFundingRange] = useState([0, 10000])
  const [minRating, setMinRating] = useState(0)

  const sportOptions = ['MMA', 'Boxing', 'Wrestling', 'Muay Thai', 'Judo', 'BJJ']

  // Notify parent when filters change (executed after rendering)
  useEffect(() => {
    onFilterChange({ sports, fundingRange, minRating })
  }, [sports, fundingRange, minRating])

  const handleSportChange = (sport: string) => {
    setSports((prev) => {
      const updated = prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
      return updated
    })
  }

  return (
    <Card className="h-fit border-primary/10">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sport</Label>
          {sportOptions.map((sport) => (
            <div key={sport} className="flex items-center gap-2">
              <Checkbox
                id={sport}
                checked={sports.includes(sport)}
                onCheckedChange={() => handleSportChange(sport)}
              />
              <Label htmlFor={sport} className="font-normal cursor-pointer">
                {sport}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Funding Amount: ${fundingRange[0].toLocaleString()} - ${fundingRange[1].toLocaleString()}
          </Label>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={fundingRange}
            onValueChange={(value) => {
              setFundingRange(value as [number, number])
            }}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Minimum Rating: {minRating.toFixed(1)}</Label>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={[minRating]}
            onValueChange={(value) => {
              setMinRating(value[0])
            }}
            className="w-full"
          />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setSports([])
            setFundingRange([0, 10000])
            setMinRating(0)
          }}
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
