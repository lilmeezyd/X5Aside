// src/pages/Players.jsx
import { Button } from '../../@/components/ui/button'

export default function Players() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant="default">Update Player H2H Fixtures</Button>
        <Button variant="secondary">Update Top Scorers</Button>
      </div>
    </div>
  )
}
