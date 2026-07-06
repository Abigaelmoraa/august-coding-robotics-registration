import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, LogOut, Search, Trash2, Pencil, Users } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { programOptions, levelOptions } from "@/lib/registration-schema";

type Registration = Database["public"]["Tables"]["registrations"]["Row"];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — August Coding & Robotics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [residenceFilter, setResidenceFilter] = useState("");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");

  const [editing, setEditing] = useState<Registration | null>(null);
  const [deleting, setDeleting] = useState<Registration | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      setAuthChecked(true);
      if (admin) await loadRows();
      else setLoading(false);
    })();
  }, [navigate]);

  const loadRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows(data || []);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        const hay = `${r.student_full_name} ${r.parent_name} ${r.parent_email} ${r.registration_number} ${r.school_name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (programFilter !== "all" && r.program !== programFilter) return false;
      if (residenceFilter && !r.area_of_residence.toLowerCase().includes(residenceFilter.toLowerCase())) return false;
      if (minAge && r.student_age < Number(minAge)) return false;
      if (maxAge && r.student_age > Number(maxAge)) return false;
      return true;
    });
  }, [rows, search, programFilter, residenceFilter, minAge, maxAge]);

  const exportCsv = () => {
    if (!filtered.length) return toast.info("No rows to export");
    const cols: (keyof Registration)[] = [
      "registration_number",
      "student_full_name",
      "student_age",
      "student_grade",
      "school_name",
      "gender",
      "area_of_residence",
      "parent_name",
      "parent_phone",
      "parent_email",
      "emergency_contact",
      "program",
      "level",
      "session_pref",
      "preferred_days",
      "preferred_start_date",
      "additional_notes",
      "created_at",
    ];
    const esc = (v: unknown) => {
      const s = v == null ? "" : Array.isArray(v) ? v.join("; ") : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csv = [
      cols.join(","),
      ...filtered.map((r) => cols.map((c) => esc(r[c])).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("registrations").delete().eq("id", deleting.id);
    if (error) return toast.error(error.message);
    toast.success("Registration deleted");
    setDeleting(null);
    await loadRows();
  };

  if (!authChecked) {
    return <FullScreenMessage text="Checking access..." />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-semibold text-foreground">Access denied</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account doesn't have admin privileges.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
              <Button asChild><Link to="/">Home</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Admin Dashboard</p>
              <p className="text-xs text-muted-foreground">Registrations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View site</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total registrations" value={rows.length} />
          <StatCard label="Coding" value={rows.filter((r) => r.program === "coding").length} />
          <StatCard label="Robotics" value={rows.filter((r) => r.program === "robotics").length} />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <div className="min-w-[220px] flex-1">
                <Label className="text-xs">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name, email, reg #"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-40">
                <Label className="text-xs">Program</Label>
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {programOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Label className="text-xs">Residence</Label>
                <Input value={residenceFilter} onChange={(e) => setResidenceFilter(e.target.value)} placeholder="Area" />
              </div>
              <div className="w-24">
                <Label className="text-xs">Min age</Label>
                <Input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
              </div>
              <div className="w-24">
                <Label className="text-xs">Max age</Label>
                <Input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
              </div>
              <Button variant="outline" onClick={exportCsv}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg #</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Residence</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                        No registrations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.registration_number}</TableCell>
                        <TableCell>
                          <div className="font-medium">{r.student_full_name}</div>
                          <div className="text-xs text-muted-foreground">{r.school_name}</div>
                        </TableCell>
                        <TableCell>{r.student_age}</TableCell>
                        <TableCell><Badge variant="secondary">{r.program}</Badge></TableCell>
                        <TableCell>{r.level}</TableCell>
                        <TableCell>
                          <div className="text-sm">{r.parent_name}</div>
                          <div className="text-xs text-muted-foreground">{r.parent_email}</div>
                        </TableCell>
                        <TableCell>{r.area_of_residence}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setEditing(r)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleting(r)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Showing {filtered.length} of {rows.length} registrations
            </p>
          </CardContent>
        </Card>
      </main>

      {editing && (
        <EditDialog
          registration={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await loadRows();
          }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete registration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleting?.student_full_name}'s registration ({deleting?.registration_number}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function FullScreenMessage({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function EditDialog({
  registration,
  onClose,
  onSaved,
}: {
  registration: Registration;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    student_full_name: registration.student_full_name,
    student_age: registration.student_age,
    student_grade: registration.student_grade,
    school_name: registration.school_name,
    parent_name: registration.parent_name,
    parent_phone: registration.parent_phone,
    parent_email: registration.parent_email,
    area_of_residence: registration.area_of_residence,
    program: registration.program,
    level: registration.level,
  });

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("registrations")
      .update(form)
      .eq("id", registration.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Registration updated");
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit registration</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Student name">
              <Input value={form.student_full_name} onChange={(e) => setForm({ ...form, student_full_name: e.target.value })} />
            </FieldRow>
            <FieldRow label="Age">
              <Input type="number" value={form.student_age} onChange={(e) => setForm({ ...form, student_age: Number(e.target.value) })} />
            </FieldRow>
            <FieldRow label="Grade">
              <Input value={form.student_grade} onChange={(e) => setForm({ ...form, student_grade: e.target.value })} />
            </FieldRow>
            <FieldRow label="School">
              <Input value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} />
            </FieldRow>
            <FieldRow label="Parent name">
              <Input value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} />
            </FieldRow>
            <FieldRow label="Parent phone">
              <Input value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} />
            </FieldRow>
            <FieldRow label="Parent email">
              <Input type="email" value={form.parent_email} onChange={(e) => setForm({ ...form, parent_email: e.target.value })} />
            </FieldRow>
            <FieldRow label="Residence">
              <Input value={form.area_of_residence} onChange={(e) => setForm({ ...form, area_of_residence: e.target.value })} />
            </FieldRow>
            <FieldRow label="Program">
              <Select value={form.program} onValueChange={(v) => setForm({ ...form, program: v as typeof form.program })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {programOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldRow>
            <FieldRow label="Level">
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v as typeof form.level })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {levelOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldRow>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
