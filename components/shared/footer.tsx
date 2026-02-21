export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            FormCraft
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {"Ristek Task - Bagas"}
        </p>
      </div>
    </footer>
  )
}
