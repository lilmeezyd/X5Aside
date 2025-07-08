export default function Footer() {
  return (
    <footer className="w-full border-t bg-background text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
        &copy; {new Date().getFullYear()} 5Aside. All rights reserved.
      </div>
    </footer>
  )
}
