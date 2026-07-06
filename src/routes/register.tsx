import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Code2, Cpu, Sparkles } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import {
  registrationSchema,
  type RegistrationInput,
  programOptions,
  levelOptions,
  sessionOptions,
  dayOptions,
} from "@/lib/registration-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/register")({
  component: RegistrationPage,
});

function RegistrationPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      student_full_name: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      student_age: undefined as unknown as number,
      student_grade: "",
      school_name: "",
      gender: "",
      area_of_residence: "",
      emergency_contact: "",
      additional_notes: "",
      program: undefined as unknown as RegistrationInput["program"],
      level: undefined as unknown as RegistrationInput["level"],
      session_pref: undefined as unknown as RegistrationInput["session_pref"],
      preferred_days: [],
      preferred_start_date: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const preferredDays = watch("preferred_days");

  const toggleDay = (day: string) => {
    const current = preferredDays || [];
    if (current.includes(day)) {
      setValue(
        "preferred_days",
        current.filter((d) => d !== day),
        { shouldValidate: true },
      );
    } else {
      setValue("preferred_days", [...current, day], { shouldValidate: true });
    }
  };

  const onSubmit = async (values: RegistrationInput) => {
    setSubmitting(true);
    try {
      const payload = {
        student_full_name: values.student_full_name,
        parent_name: values.parent_name,
        parent_phone: values.parent_phone,
        parent_email: values.parent_email,
        student_age: values.student_age,
        student_grade: values.student_grade,
        school_name: values.school_name,
        gender: values.gender || null,
        area_of_residence: values.area_of_residence,
        emergency_contact: values.emergency_contact || null,
        additional_notes: values.additional_notes || null,
        program: values.program,
        level: values.level,
        session_pref: values.session_pref,
        preferred_days: values.preferred_days,
        preferred_start_date: values.preferred_start_date,
      };

      const { data, error } = await supabase
        .from("registrations")
        .insert(payload)
        .select("registration_number")
        .single();

      if (error) throw error;

      toast.success("Registration submitted!");
      navigate({
        to: "/success/$regNum",
        params: { regNum: data.registration_number },
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to submit registration",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">August Program</p>
              <p className="text-xs text-muted-foreground">Coding & Robotics</p>
            </div>
          </div>
          <Link
            to="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-secondary/40 to-background">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Registrations open for August
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            August Coding & Robotics Program
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Hands-on coding and robotics for children and teenagers. Register below to
            reserve your child's spot in this month's cohort.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-foreground">
              <Code2 className="h-4 w-4" /> Coding
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-foreground">
              <Cpu className="h-4 w-4" /> Robotics
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-foreground">
              Ages 4 – 19
            </span>
          </div>
        </div>
      </section>

      {/* Form */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <Section title="1. Student Information">
                <Grid>
                  <Field label="Student's full name" error={errors.student_full_name?.message} required>
                    <Input {...register("student_full_name")} placeholder="Jane Doe" />
                  </Field>
                  <Field label="Student age" error={errors.student_age?.message} required>
                    <Input type="number" min={4} max={19} {...register("student_age")} placeholder="10" />
                  </Field>
                  <Field label="Current class/grade" error={errors.student_grade?.message} required>
                    <Input {...register("student_grade")} placeholder="Grade 5" />
                  </Field>
                  <Field label="School name" error={errors.school_name?.message} required>
                    <Input {...register("school_name")} placeholder="Springfield Primary" />
                  </Field>
                  <Field label="Gender (optional)">
                    <Select
                      onValueChange={(v) => setValue("gender", v as "male" | "female" | "other")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Area of residence" error={errors.area_of_residence?.message} required>
                    <Input {...register("area_of_residence")} placeholder="City / Neighborhood" />
                  </Field>
                </Grid>
                <Field label="Parent/guardian name" error={errors.parent_name?.message} required>
                  <Input {...register("parent_name")} placeholder="John Doe" />
                </Field>
                <Grid>
                  <Field label="Parent phone number" error={errors.parent_phone?.message} required>
                    <Input {...register("parent_phone")} placeholder="+1 555 123 4567" />
                  </Field>
                  <Field label="Parent email address" error={errors.parent_email?.message} required>
                    <Input type="email" {...register("parent_email")} placeholder="parent@example.com" />
                  </Field>
                </Grid>
                <Field label="Emergency contact (optional)">
                  <Input {...register("emergency_contact")} placeholder="Name & phone" />
                </Field>
                <Field label="Additional notes or special requirements">
                  <Textarea rows={3} {...register("additional_notes")} placeholder="Allergies, learning needs, etc." />
                </Field>
              </Section>

              <Section title="2. Program Selection">
                <Field label="Program" error={errors.program?.message} required>
                  <Select onValueChange={(v) => setValue("program", v as RegistrationInput["program"], { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </Section>

              <Section title="3. Level Selection">
                <Field label="Skill level" error={errors.level?.message} required>
                  <Select onValueChange={(v) => setValue("level", v as RegistrationInput["level"], { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </Section>

              <Section title="4. Schedule">
                <Field label="Preferred session" error={errors.session_pref?.message} required>
                  <Select onValueChange={(v) => setValue("session_pref", v as RegistrationInput["session_pref"], { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Preferred days" error={errors.preferred_days?.message} required>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {dayOptions.map((day) => {
                      const checked = (preferredDays || []).includes(day);
                      return (
                        <label
                          key={day}
                          className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                            checked ? "border-primary bg-primary/5" : "border-input hover:bg-accent"
                          }`}
                        >
                          <Checkbox checked={checked} onCheckedChange={() => toggleDay(day)} />
                          <span>{day}</span>
                        </label>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Preferred starting date" error={errors.preferred_start_date?.message} required>
                  <Input type="date" {...register("preferred_start_date")} />
                </Field>
              </Section>

              <Button type="submit" disabled={submitting} className="w-full" size="lg">
                {submitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} August Coding & Robotics Program
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="border-b pb-2 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
