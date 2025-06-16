import { useState } from 'react'
import { Input } from '../../@/components/ui/input'
import { Label } from '../../@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../@/components/ui/select'

const classicTableData = [
  { rank: 1, team: 'Dream Team', points: 120 },
  { rank: 2, team: 'Fire FC', points: 115 },
]

const h2hTableData = [
  { rank: 1, player: 'Eddy', wins: 5, losses: 1, points: 15 },
  { rank: 2, player: 'Mimi', wins: 4, losses: 2, points: 12 },
]

export default function Tables() {
  const [event, setEvent] = useState("38")
  const [classicSortKey, setClassicSortKey] = useState("points")
  const [classicSortAsc, setClassicSortAsc] = useState(false)

  const sortedClassic = [...classicTableData].sort((a, b) => {
    if (classicSortAsc) return a[classicSortKey] - b[classicSortKey]
    return b[classicSortKey] - a[classicSortKey]
  })

  const toggleSort = (key) => {
    if (classicSortKey === key) {
      setClassicSortAsc(!classicSortAsc)
    } else {
      setClassicSortKey(key)
      setClassicSortAsc(true)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">League Tables</h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <Label>Filter by Gameweek</Label>
        <Select value={event} onValueChange={(val) => setEvent(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Gameweek" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(38).keys()].map((i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>GW {i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Classic Table (GW {event})</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 cursor-pointer" onClick={() => toggleSort("rank")}>#</th>
              <th className="p-2">Team</th>
              <th className="p-2 cursor-pointer" onClick={() => toggleSort("points")}>Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedClassic.map((row, i) => (
              <tr key={i}>
                <td className="p-2">{row.rank}</td>
                <td className="p-2">{row.team}</td>
                <td className="p-2">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">H2H Table (GW {event})</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Player</th>
              <th className="p-2">W</th>
              <th className="p-2">L</th>
              <th className="p-2">Pts</th>
            </tr>
          </thead>
          <tbody>
            {h2hTableData.map((row, idx) => (
              <tr key={row.player}>
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{row.player}</td>
                <td className="p-2">{row.wins}</td>
                <td className="p-2">{row.losses}</td>
                <td className="p-2">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
