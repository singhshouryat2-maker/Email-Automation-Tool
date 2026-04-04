import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Search,
  Send,
  Forward,
  Archive,
  Trash2,
  Tags,
  Clock3,
  Bell,
  UserRound,
  Plus,
  CheckCircle2,
  Wand2,
  Filter,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const actions = [
  { key: "search", label: "Search", icon: Search },
  { key: "read", label: "Read", icon: Mail },
  { key: "draft", label: "Draft", icon: Wand2 },
  { key: "send", label: "Send", icon: Send },
  { key: "forward", label: "Forward", icon: Forward },
  { key: "archive", label: "Archive", icon: Archive },
  { key: "delete", label: "Delete", icon: Trash2 },
  { key: "label", label: "Label", icon: Tags },
  { key: "schedule", label: "Schedule", icon: Clock3 },
  { key: "contacts", label: "Contacts", icon: UserRound },
];

const starterFlows = [
  {
    name: "NST Daily Digest",
    trigger: "Every weekday at 7:30 AM",
    filter: "from:(@newtonschool.co OR @nst.edu) newer_than:1d",
    action: "Summarize all Newton School of Technology emails",
  },
  {
    name: "Admissions & Onboarding",
    trigger: "On new email",
    filter: 'subject:(admission OR onboarding OR orientation) from:(@newtonschool.co OR @nst.edu)',
    action: "Label Important and mark unread",
  },
  {
    name: "Class & Assignment Tracker",
    trigger: "On new email",
    filter: 'subject:(assignment OR project OR deadline OR class) from:(@newtonschool.co OR @nst.edu)',
    action: "Label Academics",
  },
  {
    name: "Placement & Internship Alerts",
    trigger: "On new email",
    filter: 'subject:(internship OR placement OR opportunity OR hiring) from:(@newtonschool.co OR @nst.edu)',
    action: "Label Career",
  },
  {
    name: "Fee & Payment Reminder",
    trigger: "On new email",
    filter: 'subject:(fee OR payment OR invoice OR receipt) from:(@newtonschool.co OR @nst.edu)',
    action: "Label Finance and remind Shourya Singh",
  },
  {
    name: "Event & Workshop Updates",
    trigger: "Every evening at 6:00 PM",
    filter: 'subject:(event OR workshop OR seminar OR hackathon) newer_than:1d',
    action: "Summarize upcoming campus activities",
  },
];type ActionKey =
  | "search"
  | "read"
  | "draft"
  | "send"
  | "forward"
  | "archive"
  | "delete"
  | "label"
  | "schedule"
  | "contacts";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/80 p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function ActionChip({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm shadow-sm">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

function FlowCard({
  name,
  trigger,
  filter,
  action,
  onUse,
}: {
  name: string;
  trigger: string;
  filter: string;
  action: string;
  onUse: () => void;
}) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">{name}</div>
            <div className="mt-1 text-sm text-slate-500">{trigger}</div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onUse}>
            Use
          </Button>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div>
            <span className="font-medium">Filter:</span> {filter}
          </div>
          <div>
            <span className="font-medium">Action:</span> {action}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


type TriggerMode = "new_email" | "hourly" | "daily" | "weekly";
type BuilderStepType =
  | "summarize"
  | "label"
  | "mark_unread"
  | "draft_reply"
  | "forward"
  | "archive"
  | "delete"
  | "notify"
  | "webhook"
  | "delay";

type BuilderStep = {
  id: string;
  type: BuilderStepType;
  config: Record<string, string | boolean>;
};

type AutomationFlow = {
  id: string;
  name: string;
  enabled: boolean;
  trigger: TriggerMode;
  scheduleText: string;
  query: string;
  scope: "gmail" | "workspace" | "custom";
  description: string;
  steps: BuilderStep[];
  processedToday: number;
  lastRun: string;
  successRate: number;
};

type EmailItem = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  tags: string[];
  status: "new" | "processed" | "flagged";
};
const actionTypeMeta: Record<BuilderStepType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  summarize: { label: "Summarize", icon: Sparkles },
  label: { label: "Apply Label", icon: Tags },
  mark_unread: { label: "Mark Unread", icon: Mail },
  draft_reply: { label: "Draft Reply", icon: Wand2 },
  forward: { label: "Forward", icon: Forward },
  archive: { label: "Archive", icon: Archive },
  delete: { label: "Delete", icon: Trash2 },
  notify: { label: "Notify", icon: Bell },
  webhook: { label: "Webhook", icon: Zap },
  delay: { label: "Delay", icon: Clock3 },
};

const initialEmails: EmailItem[] = [
  {
    id: "e1",
    from: "placements@nst.edu",
    subject: "New internship opportunity with partner startup",
    preview: "Applications close Friday. Students from CSE and AI cohorts are encouraged to apply...",
    time: "08:42",
    tags: ["Career", "New"],
    status: "new",
  },
  {
    id: "e2",
    from: "academics@newtonschool.co",
    subject: "Assignment 4 deadline extended",
    preview: "The DSA assignment deadline has been moved to Monday 11:59 PM due to lab overlap...",
    time: "09:18",
    tags: ["Academics"],
    status: "processed",
  },
  {
    id: "e3",
    from: "finance@nst.edu",
    subject: "Semester fee payment reminder",
    preview: "This is a reminder that the next installment is due on the 10th. Please keep your receipt safe...",
    time: "11:06",
    tags: ["Finance", "Flagged"],
    status: "flagged",
  },
  {
    id: "e4",
    from: "events@nst.edu",
    subject: "Weekend hackathon registrations are open",
    preview: "Join teams across campus for a 24-hour build sprint, mentorship, and sponsor prizes...",
    time: "13:34",
    tags: ["Events"],
    status: "new",
  },
];

const defaultFlows: AutomationFlow[] = [
  {
    id: "f1",
    name: "NST Daily Digest",
    enabled: true,
    trigger: "daily",
    scheduleText: "Weekdays • 7:30 AM",
    query: "from:(@newtonschool.co OR @nst.edu) newer_than:1d",
    scope: "workspace",
    description: "Summarizes important academic, campus, and ops emails every morning.",
    steps: [
      { id: "s1", type: "summarize", config: { format: "bullet summary" } },
      { id: "s2", type: "notify", config: { channel: "dashboard" } },
    ],
    processedToday: 18,
    lastRun: "Today • 07:30",
    successRate: 99,
  },
  {
    id: "f2",
    name: "Placement & Internship Alerts",
    enabled: true,
    trigger: "new_email",
    scheduleText: "Instant",
    query: "subject:(internship OR placement OR opportunity OR hiring) from:(@newtonschool.co OR @nst.edu)",
    scope: "workspace",
    description: "Auto-labels career updates, flags urgency, and keeps them visible.",
    steps: [
      { id: "s3", type: "label", config: { value: "Career" } },
      { id: "s4", type: "mark_unread", config: { enabled: true } },
      { id: "s5", type: "notify", config: { channel: "mobile" } },
    ],
    processedToday: 6,
    lastRun: "Today • 08:42",
    successRate: 96,
  },
  {
    id: "f3",
    name: "Fee & Payment Reminder",
    enabled: false,
    trigger: "new_email",
    scheduleText: "Instant",
    query: "subject:(fee OR payment OR invoice OR receipt) from:(@newtonschool.co OR @nst.edu)",
    scope: "workspace",
    description: "Keeps finance mails together and drafts reminder messages automatically.",
    steps: [
      { id: "s6", type: "label", config: { value: "Finance" } },
      { id: "s7", type: "draft_reply", config: { tone: "formal" } },
      { id: "s8", type: "notify", config: { channel: "email" } },
    ],
    processedToday: 2,
    lastRun: "Yesterday • 18:14",
    successRate: 94,
  }
];
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function StepPill({ step }: { step: BuilderStep }) {
  const meta = actionTypeMeta[step.type];
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-sm">
      <Icon className="h-4 w-4 text-slate-600" />
      <span className="font-medium">{meta.label}</span>
      {step.type === "label" && typeof step.config.value === "string" ? (
        <Badge variant="secondary" className="rounded-full">{step.config.value}</Badge>
      ) : null}
      {step.type === "notify" && typeof step.config.channel === "string" ? (
        <Badge variant="secondary" className="rounded-full">{step.config.channel}</Badge>
      ) : null}
    </div>
  );
}
function EmailRow({ item }: { item: EmailItem }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm">
      <div
        className={cn(
          "mt-1 h-2.5 w-2.5 rounded-full",
          item.status === "new" && "bg-emerald-500",
          item.status === "processed" && "bg-slate-300",
          item.status === "flagged" && "bg-amber-500"
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate text-sm font-medium text-slate-900">{item.from}</div>
          <div className="text-xs text-slate-500">{item.time}</div>
        </div>
        <div className="mt-1 truncate text-sm font-semibold">{item.subject}</div>
        <div className="mt-1 line-clamp-2 text-sm text-slate-500">{item.preview}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowOverviewCard({
  flow,
  onToggle,
  onSelect,
}: {
  flow: AutomationFlow;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-semibold tracking-tight">{flow.name}</div>
                <Badge className="rounded-full" variant={flow.enabled ? "default" : "secondary"}>
                  {flow.enabled ? "Active" : "Paused"}
                </Badge>
                <Badge variant="outline" className="rounded-full">{flow.scheduleText}</Badge>
              </div>
              <p className="max-w-2xl text-sm text-slate-500">{flow.description}</p>
              <div className="flex flex-wrap gap-2">
                {flow.steps.map((step) => (
                  <StepPill key={step.id} step={step} />
                ))}
              </div>
              <div className="text-xs text-slate-500">Rule query: {flow.query}</div>
            </div>

            <div className="grid min-w-[240px] grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Processed today</div>
                <div className="mt-1 text-xl font-semibold">{flow.processedToday}</div>
              </div>
              <div className="rounded-2xl border bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Success rate</div>
                <div className="mt-1 text-xl font-semibold">{flow.successRate}%</div>
              </div>
              <div className="col-span-2 rounded-2xl border bg-slate-50 p-3 text-xs text-slate-500">
                Last run: <span className="font-medium text-slate-700">{flow.lastRun}</span>
              </div>
              <div className="col-span-2 flex gap-2">
                <Button className="flex-1 rounded-xl" variant="outline" onClick={() => onSelect(flow.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Inspect
                </Button>
                <Button className="rounded-xl" variant={flow.enabled ? "secondary" : "default"} onClick={() => onToggle(flow.id)}>
                  {flow.enabled ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {flow.enabled ? "Pause" : "Run"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BuilderStepEditor({
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggest">Suggestion only</SelectItem>
                  <SelectItem value="auto">Auto-create draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : null}

        {step.type === "summarize" ? (
          <div className="space-y-2 md:col-span-2">
            <Label>Summary instructions</Label>
            <Textarea
              value={String(step.config.format ?? "")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, format: e.target.value } })}
              placeholder="Bullet summary with priority and next action"
              className="min-h-[96px]"
            />
          </div>
        ) : null}

        {step.type === "forward" ? (
          <>
            <div className="space-y-2">
              <Label>Forward to</Label>
              <Input
                value={String(step.config.to ?? "")}
                onChange={(e) => onChange({ ...step, config: { ...step.config, to: e.target.value } })}
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Input
                value={String(step.config.note ?? "")}
                onChange={(e) => onChange({ ...step, config: { ...step.config, note: e.target.value } })}
                placeholder="FYI - automated forward"
              />
            </div>
          </>
        ) : null}

        {step.type === "delay" ? (
          <div className="space-y-2 md:col-span-2">
            <Label>Delay before next step</Label>
            <Input
              value={String(step.config.duration ?? "15 minutes")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, duration: e.target.value } })}
              placeholder="15 minutes"
            />
          </div>
        ) : null}

        {step.type === "webhook" ? (
          <div className="space-y-2 md:col-span-2">
            <Label>Webhook endpoint</Label>
            <Input
              value={String(step.config.url ?? "")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, url: e.target.value } })}
              placeholder="https://example.com/hooks/email"
            />
          </div>
        ) : null}

        {["archive", "delete", "mark_unread"].includes(step.type) ? (
          <div className="md:col-span-2 rounded-xl border bg-slate-50 p-3 text-sm text-slate-500">
            This is a direct mailbox action. It will run automatically whenever the filter matches.
          </div>
        ) : null}
      </div>
    </div>
  );
}