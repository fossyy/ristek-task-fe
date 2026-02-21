export function meta() {
  return [{ title: "404 - Page Not Found" }];
}

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/">Go home</a>
    </div>
  );
}