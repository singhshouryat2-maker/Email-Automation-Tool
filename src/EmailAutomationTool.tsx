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
  Zap,
  Eye,
  Pause,
  Play,
} from "lucide-react";

// Basic styled components to replace UI library
const Card = ({ children, className = '' }: any) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: any) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: any) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

const CardDescription = ({ children, className = '' }: any) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = '' }: any) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const Button = ({ children, variant = 'default', className = '', ...props }: any) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 hover:bg-gray-300',
    outline: 'border border-gray-300 hover:bg-gray-50',
  };
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }: any) => (
  <input
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }: any) => (
  <textarea
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = 'default', className = '' }: any) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300',
  };
  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Switch = ({ checked = false, onCheckedChange }: any) => (
  <button
    onClick={() => onCheckedChange?.(!checked)}
    className={`relative inline-block h-6 w-11 rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Label = ({ children, className = '' }: any) => (
  <label className={`text-sm font-medium text-gray-700 block mb-1 ${className}`}>{children}</label>
);

const Tabs = ({ children, defaultValue, ...props }: any) => {
  const [active, setActive] = useState(defaultValue);
  return (
    <div {...props}>
      {React.Children.map(children, (child: any) =>
        React.isValidElement(child) ? React.cloneElement(child, { active, setActive } as any) : child
      )}
    </div>
  );
};

const TabsList = ({ children, className = '' }: any) => (
  <div className={`inline-flex gap-2 p-1 bg-gray-100 rounded-lg ${className}`} role="tablist">
    {children}
  </div>
);

const TabsTrigger = ({ value, children, active, setActive, className = '' }: any) => (
  <button
    onClick={() => setActive(value)}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      active === value ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
    } ${className}`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, active, className = '' }: any) =>
  active === value ? <div className={`mt-4 ${className}`}>{children}</div> : null;

const Select = ({ children, value, onValueChange, ...props }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...props}>
      {React.Children.map(children, (child: any) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { value, onValueChange, open, setOpen } as any)
          : child
      )}
    </div>
  );
};

const SelectTrigger = ({ children, open, setOpen, className = '' }: any) => (
  <button
    onClick={() => setOpen?.(!open)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-left flex justify-between items-center ${className}`}
  >
    {children}
  </button>
);

const SelectValue = ({ placeholder = 'Select...' }: any) => <span>{placeholder}</span>;

const SelectContent = ({ children, open, setOpen, ...props }: any) =>
  open ? (
    <div className="absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50" {...props}>
      {React.Children.map(children, (child: any) =>
        React.isValidElement(child) ? React.cloneElement(child, { setOpen } as any) : child
      )}
    </div>
  ) : null;

const SelectItem = ({ value, children, onValueChange, setOpen, className = '' }: any) => (
  <button
    onClick={() => {
      onValueChange?.(value);
      setOpen?.(false);
    }}
    className={`w-full px-3 py-2 text-left hover:bg-blue-50 text-sm ${className}`}
  >
    {children}
  </button>
);

const Separator = ({ className = '' }: any) => <div className={`bg-gray-200 h-px w-full ${className}`} />;

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
];

type ActionKey =
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
  step,
  onChange,
}: {
  step: BuilderStep;
  onChange: (step: BuilderStep) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {step.type === "label" ? (
          <div className="space-y-2">
            <Label>Label name</Label>
            <Input
              value={String(step.config.value ?? "")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, value: e.target.value } })}
              placeholder="e.g., Important, Follow-up"
            />
          </div>
        ) : null}

        {step.type === "notify" ? (
          <div className="space-y-2">
            <Label>Notification channel</Label>
            <Select
              value={String(step.config.channel ?? "")}
              onValueChange={(value) => onChange({ ...step, config: { ...step.config, channel: value } })}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="mobile">Mobile push</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {step.type === "draft_reply" ? (
          <div className="space-y-2">
            <Label>Draft mode</Label>
            <Select
              value={String(step.config.mode ?? "")}
              onValueChange={(value) => onChange({ ...step, config: { ...step.config, mode: value } })}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggest">Suggestion only</SelectItem>
                <SelectItem value="auto">Auto-create draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
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


export default function EmailAutomationTool() {
  const [flows, setFlows] = useState<AutomationFlow[]>(defaultFlows);
  const [emails] = useState<EmailItem[]>(initialEmails);
  const [selectedFlowId, setSelectedFlowId] = useState<string>(defaultFlows[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<"all" | "active" | "paused">("all");

  const [builderName, setBuilderName] = useState("New automated workflow");
  const [builderTrigger, setBuilderTrigger] = useState<TriggerMode>("new_email");
  const [builderScheduleText, setBuilderScheduleText] = useState("Instant");
  const [builderQuery, setBuilderQuery] = useState('from:(@newtonschool.co OR @nst.edu)');
  const [builderScope, setBuilderScope] = useState<"gmail" | "workspace" | "custom">("workspace");
  const [builderDescription, setBuilderDescription] = useState(
    "Watches inbox activity and automatically performs a sequence of actions."
  );
  const [builderEnabled, setBuilderEnabled] = useState(true);
  const [builderSteps, setBuilderSteps] = useState<BuilderStep[]>([
    { id: makeId("step"), type: "label", config: { value: "Important" } },
    { id: makeId("step"), type: "notify", config: { channel: "dashboard" } },
  ]);

  const selectedFlow = useMemo(
    () => flows.find((flow) => flow.id === selectedFlowId) ?? flows[0],
    [flows, selectedFlowId]
  );

  const filteredFlows = useMemo(() => {
    return flows.filter((flow) => {
      const matchesText =
        !searchQuery ||
        flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        filterState === "all" ||
        (filterState === "active" && flow.enabled) ||
        (filterState === "paused" && !flow.enabled);

      return matchesText && matchesState;
    });
  }, [flows, searchQuery, filterState]);

  const totalProcessed = useMemo(() => flows.reduce((sum, flow) => sum + flow.processedToday, 0), [flows]);
  const activeCount = useMemo(() => flows.filter((flow) => flow.enabled).length, [flows]);
  const avgSuccess = useMemo(
    () => Math.round(flows.reduce((sum, flow) => sum + flow.successRate, 0) / flows.length),
    [flows]
  );

  const toggleFlow = (id: string) => {
    setFlows((current) =>
      current.map((flow) => (flow.id === id ? { ...flow, enabled: !flow.enabled } : flow))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Email Automation</h1>
          <p className="text-slate-600">Automate your email workflows with intelligent rules and actions.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Total processed" value={String(totalProcessed)} />
          <Stat label="Active flows" value={String(activeCount)} />
          <Stat label="Avg success rate" value={`${avgSuccess}%`} />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-white p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="starter">Starter templates</TabsTrigger>
            <TabsTrigger value="builder">Build new</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Your automation flows
                </CardTitle>
                <CardDescription>Manage and monitor all your active workflows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search workflows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl"
                  />
                  <Select value={filterState} onValueChange={(value: any) => setFilterState(value)}>
                    <SelectTrigger className="w-32 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  {filteredFlows.map((flow) => (
                    <FlowOverviewCard key={flow.id} flow={flow} onToggle={toggleFlow} onSelect={setSelectedFlowId} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="starter" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {starterFlows.map((flow, i) => (
                <FlowCard
                  key={i}
                  name={flow.name}
                  trigger={flow.trigger}
                  filter={flow.filter}
                  action={flow.action}
                  onUse={() => {
                    setBuilderName(flow.name);
                    setBuilderQuery(flow.filter);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Build a new workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Workflow name</Label>
                  <Input value={builderName} onChange={(e) => setBuilderName(e.target.value)} className="rounded-xl" />
                </div>
                <Button className="rounded-xl w-full">Create Workflow</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
