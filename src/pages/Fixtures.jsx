// src/pages/Fixtures.jsx
import { Button } from '../../@/components/ui/button'

export default function Fixtures() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fixtures</h2>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Button>Fetch Fixtures from FPL API</Button>
        <Button variant="secondary">Update Classic Scores</Button>
        <Button variant="secondary">Update H2H Matches</Button>
      </div>
    </div>
  )
}
