export function meta() {
  return [{ title: "404 - Page Not Found" }];
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4" style={{ textAlign: "center" }}>
      <h1 className="text-6xl font-bold text-foreground animate-scale-bounce">404</h1>
      <p className="mt-4 text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Page not found.</p>
      <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground btn-press animate-fade-in-up" style={{ animationDelay: '0.35s' }}>Go home</a>
    </div>
  );
}