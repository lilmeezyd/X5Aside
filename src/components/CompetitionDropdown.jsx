const CompetitionDropdown = ({ open, competitions, setOpen, changeDb }) => (
  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow w-40 z-50">
    {competitions.map((comp) => (
      <button
        key={comp.db}
        onClick={() => {
          changeDb(comp.db);
          setOpen(false);
        }}
        className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
      >
        {comp.name}
      </button>
    
    ))}
    <button
      onClick={() => setOpen(false)}
      className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 text-left"
    >
      Close
    </button>
  </div>
);

export default CompetitionDropdown