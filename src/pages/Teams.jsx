// src/pages/Teams.jsx
import { useState } from 'react'
import { Button } from '../../@/components/ui/button'

const mockTeams = [
  { id: 1, name: 'Dream Team', players: 5 },
  { id: 2, name: 'Fire FC', players: 4 },
]

export default function Teams() {
  const [teams, setTeams] = useState(mockTeams)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <Button className="mb-4">Add Teams from FPL API</Button>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div key={team.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <p className="text-sm text-gray-600">Players: {team.players}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm">Add Player</Button>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
