import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/success/$regNum")({
  head: () => ({
    meta: [
      { title: "Registration Confirmed — August Coding & Robotics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { regNum } = Route.useParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Registration Confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for registering for the August Coding & Robotics Program. We'll
            reach out shortly with next steps.
          </p>
          <div className="mt-6 rounded-lg border bg-secondary/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Registration number
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground">{regNum}</p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Please save this number for future reference.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
