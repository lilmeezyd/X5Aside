
import { Button } from '../../@/components/ui/button'

const Fixtures = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fixtures</h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant="default">Create New Fixture</Button>
        <Button variant="secondary">Import Fixtures</Button>
      </div>
      <div className="mt-6">
        <p className="text-gray-600">No fixtures scheduled yet.</p>
      </div>
    </div>
  )
}

export default Fixtures
