import { Button } from '../../@/components/ui/button'
import { toast } from 'sonner'

export default function Fixtures() {
  const handleFetchFixtures = () => {
    toast("Fetching Fixtures...", {
      description: "This may take a few seconds.",
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fixtures</h2>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Button onClick={handleFetchFixtures}>
          Fetch Fixtures from FPL API
        </Button>
        <Button variant="secondary">Update Classic Scores</Button>
        <Button variant="secondary">Update H2H Matches</Button>
      </div>
    </div>
  )
}