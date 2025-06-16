
import { Button } from '../../@/components/ui/button'

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Teams</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Active Players</h3>
          <p className="text-2xl font-bold text-green-600">48</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Upcoming Fixtures</h3>
          <p className="text-2xl font-bold text-orange-600">6</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
