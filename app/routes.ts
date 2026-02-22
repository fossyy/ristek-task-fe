import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("forms", "routes/forms.tsx"),
    route("forms/new", "routes/create-form.tsx"),
    route("form/:id", "routes/form.tsx"),
    route("form/:id/submit", "routes/submit-form.tsx"),
    route("form/:id/edit", "routes/edit-form.tsx"),
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
