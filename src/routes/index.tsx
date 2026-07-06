import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Cpu, Sparkles, ArrowRight, GraduationCap, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "August Coding & Robotics Program" },
      {
        name: "description",
        content:
          "Hands-on coding and robotics for children and teenagers. Register for the August cohort today.",
      },
      { property: "og:title", content: "August Coding & Robotics Program" },
      {
        property: "og:description",
        content: "Hands-on coding and robotics for children and teenagers.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">August Program</p>
              <p className="text-xs text-muted-foreground">Coding & Robotics</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
            >
              Log in
            </Link>
            <Button asChild size="sm">
              <Link to="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero — navy blue */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Registrations open for August
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Build. Code. Invent.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-primary-foreground/80">
            A hands-on August program in coding and robotics for children and
            teenagers ages 4 – 19. Small groups, real projects, big ideas.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">
                Register now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/login">Admin log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <Feature icon={<Code2 className="h-5 w-5" />} title="Coding">
            Scratch, Python, and web basics — taught project-first.
          </Feature>
          <Feature icon={<Cpu className="h-5 w-5" />} title="Robotics">
            Design, build, and program robots with real components.
          </Feature>
          <Feature icon={<GraduationCap className="h-5 w-5" />} title="All levels">
            Beginner, intermediate, and advanced tracks for ages 4 – 19.
          </Feature>
          <Feature icon={<Users className="h-5 w-5" />} title="Small groups">
            Personal attention with low student-to-mentor ratios.
          </Feature>
          <Feature icon={<Calendar className="h-5 w-5" />} title="Flexible schedule">
            Morning, afternoon, and weekend sessions to fit your family.
          </Feature>
          <Feature icon={<Sparkles className="h-5 w-5" />} title="Real projects">
            Every learner leaves with something they built themselves.
          </Feature>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Reserve your child's spot
          </h2>
          <p className="mt-3 text-muted-foreground">
            Spaces are limited. Registration takes about 3 minutes.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link to="/register">
                Start registration <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} August Coding & Robotics Program
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
