import React, { useMemo, useState, useEffect } from "react";
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
  User,
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
  LogOut,
  Check,
} from "lucide-react";

// Basic styled components using inline styles
const Card = ({ children, style = {} }: any) => (
  <div style={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', ...style }}>
    {children}
  </div>
);

const CardHeader = ({ children, style = {} }: any) => (
  <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb', ...style }}>{children}</div>
);

const CardTitle = ({ children, style = {} }: any) => (
  <h2 style={{ fontSize: '20px', fontWeight: 700, lineHeight: '1.5', ...style }}>{children}</h2>
);

const CardDescription = ({ children, style = {} }: any) => (
  <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '8px', lineHeight: '1.6', ...style }}>{children}</p>
);

const CardContent = ({ children, style = {} }: any) => (
  <div style={{ padding: '32px', ...style }}>{children}</div>
);

const Button = ({ children, variant = 'default', style = {}, ...props }: any) => {
  const variants = {
    default: { backgroundColor: '#2563eb', color: 'white', cursor: 'pointer', border: 'none' },
    secondary: { backgroundColor: '#e5e7eb', color: '#111827', cursor: 'pointer', border: 'none' },
    outline: { border: '1px solid #d1d5db', backgroundColor: 'transparent', cursor: 'pointer' },
  };
  return (
    <button
      style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500, transition: 'all 0.2s', ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ style = {}, ...props }: any) => (
  <input
    style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', fontFamily: 'inherit', lineHeight: '1.5', cursor: 'text', ...style }}
    {...props}
  />
);

const Textarea = ({ style = {}, ...props }: any) => (
  <textarea
    style={{ padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.6', cursor: 'text', resize: 'vertical', ...style }}
    {...props}
  />
);

const Badge = ({ children, variant = 'default', style = {} }: any) => {
  const variants = {
    default: { backgroundColor: '#dbeafe', color: '#1e40af' },
    secondary: { backgroundColor: '#f3f4f6', color: '#1f2937' },
    outline: { border: '1px solid #d1d5db', backgroundColor: 'transparent' },
  };
  return (
    <span style={{ display: 'inline-block', padding: '4px 8px', fontSize: '12px', fontWeight: 500, borderRadius: '9999px', ...variants[variant], ...style }}>
      {children}
    </span>
  );
};

const Switch = ({ checked = false, onCheckedChange }: any) => (
  <button
    onClick={() => onCheckedChange?.(!checked)}
    style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', borderRadius: '9999px', backgroundColor: checked ? '#2563eb' : '#d1d5db', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
  >
    <span style={{ position: 'absolute', top: '2px', left: checked ? '24px' : '2px', width: '20px', height: '20px', borderRadius: '9999px', backgroundColor: 'white', transition: 'left 0.2s' }} />
  </button>
);

const Label = ({ children, style = {}, ...props }: any) => (
  <label style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', display: 'block', marginBottom: '8px', lineHeight: '1.5', cursor: 'default', ...style }} {...props}>{children}</label>
);

const Tabs = ({ children, defaultValue, value, onChange, ...props }: any) => {
  const [internalActive, setInternalActive] = useState(defaultValue);
  const active = value !== undefined ? value : internalActive;
  const setActive = onChange || setInternalActive;
  
  return (
    <div {...props}>
      {React.Children.map(children, (child: any) =>
        React.isValidElement(child) ? React.cloneElement(child, { active, setActive } as any) : child
      )}
    </div>
  );
};

const TabsList = ({ children, active, setActive, style = {} }: any) => (
  <div style={{ display: 'inline-flex', gap: '8px', padding: '4px', backgroundColor: '#f3f4f6', borderRadius: '8px', ...style }} role="tablist">
    {React.Children.map(children, (child: any) =>
      React.isValidElement(child) ? React.cloneElement(child, { active, setActive } as any) : child
    )}
  </div>
);

const TabsTrigger = ({ value, children, active, setActive, style = {} }: any) => (
  <button
    onClick={() => setActive(value)}
    style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 500, border: 'none', cursor: 'pointer', backgroundColor: active === value ? '#fff' : 'transparent', color: active === value ? '#111827' : '#4b5563', transition: 'all 0.2s', ...style }}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, active, style = {} }: any) =>
  active === value ? <div style={{ marginTop: '16px', ...style }}>{children}</div> : null;

const Select = ({ children, value, onValueChange, ...props }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', ...props.style }} {...(({ style, ...rest }: any) => rest)(props)}>
      {React.Children.map(children, (child: any) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { value, onValueChange, open, setOpen } as any)
          : child
      )}
    </div>
  );
};

const SelectTrigger = ({ children, open, setOpen, value, style = {} }: any) => {
  let displayText = 'Select...';
  
  // If value exists, format and display it
  if (value) {
    displayText = String(value)
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return (
    <button
      onClick={() => setOpen?.(!open)}
      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', cursor: 'pointer', ...style }}
    >
      <span style={{ flex: 1 }}>{displayText}</span>
      <span style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: '14px' }}>▼</span>
    </button>
  );
};

const SelectValue = ({ placeholder = 'Select...', value, children }: any) => {
  if (children && React.isValidElement(children)) {
    return <span>{children}</span>;
  }
  if (value) {
    const formatted = String(value)
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return <span>{formatted}</span>;
  }
  return <span>{placeholder}</span>;
};

const SelectContent = ({ children, open, setOpen, onValueChange, ...props }: any) =>
  open ? (
    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 50 }} {...props}>
      {React.Children.map(children, (child: any) =>
        React.isValidElement(child) ? React.cloneElement(child, { setOpen, onValueChange } as any) : child
      )}
    </div>
  ) : null;

const SelectItem = ({ value, children, onValueChange, setOpen, style = {} }: any) => (
  <button
    onClick={() => {
      onValueChange?.(value);
      setOpen?.(false);
    }}
    style={{ width: '100%', padding: '10px 12px', textAlign: 'left', fontSize: '14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f3f4f6' }, ...style }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    {children}
  </button>
);

const Separator = ({ style = {} }: any) => <div style={{ backgroundColor: '#e5e7eb', height: '1px', width: '100%', ...style }} />;

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
  { key: "contacts", label: "Contacts", icon: User },
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
    <div style={{ borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: 'rgba(255,255,255,0.9)', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>{label}</div>
      <div style={{ marginTop: '12px', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '1.2' }}>{value}</div>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '8px 12px', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      <Icon style={{ width: '16px', height: '16px' }} />
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
  isSelected = false,
}: {
  name: string;
  trigger: string;
  filter: string;
  action: string;
  onUse: () => void;
  isSelected?: boolean;
}) {
  return (
    <Card style={{ borderColor: isSelected ? '#2563eb' : '#e5e7eb', borderWidth: isSelected ? '2px' : '1px', backgroundColor: isSelected ? '#eff6ff' : '#fff', transition: 'all 0.2s' }}>
      <CardContent style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '17px', fontWeight: 700, lineHeight: '1.4', color: isSelected ? '#2563eb' : '#111827' }}>{name}</div>
            <div style={{ marginTop: '6px', fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>{trigger}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSelected && <span style={{ fontSize: '18px', color: '#2563eb' }}>✓</span>}
            <Button variant={isSelected ? "default" : "outline"} style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '8px', whiteSpace: 'nowrap' }} onClick={onUse}>
              {isSelected ? "Selected" : "Use"}
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: '1.6' }}>
          <div>
            <span style={{ fontWeight: 600 }}>Filter:</span> {filter}
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>Action:</span> {action}
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
  | "delay"
  | "send_email";

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
  send_email: { label: "Send Email", icon: Send },
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '6px 12px', fontSize: '14px' }}>
      <Icon style={{ width: '16px', height: '16px', color: '#6b7280' }} />
      <span style={{ fontWeight: 500 }}>{meta.label}</span>
      {step.type === "label" && typeof step.config.value === "string" ? (
        <Badge variant="secondary" style={{ borderRadius: '9999px' }}>{step.config.value}</Badge>
      ) : null}
      {step.type === "notify" && typeof step.config.channel === "string" ? (
        <Badge variant="secondary" style={{ borderRadius: '9999px' }}>{step.config.channel}</Badge>
      ) : null}
    </div>
  );
}
function EmailRow({ item }: { item: EmailItem }) {
  const statusBg = item.status === "new" ? "#10b981" : item.status === "processed" ? "#d1d5db" : "#f59e0b";
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '16px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <div style={{ marginTop: '4px', width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: statusBg }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 500, color: '#111827' }}>{item.from}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.time}</div>
        </div>
        <div style={{ marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 600 }}>{item.subject}</div>
        <div style={{ marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{item.preview}</div>
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" style={{ borderRadius: '9999px' }}>{tag}</Badge>
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
      <Card>
        <CardContent style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', '@media (min-width: 1024px)': { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' } }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em' }}>{flow.name}</div>
                <Badge variant={flow.enabled ? "default" : "secondary"} style={{ borderRadius: '9999px' }}>
                  {flow.enabled ? "Active" : "Paused"}
                </Badge>
                <Badge variant="outline" style={{ borderRadius: '9999px' }}>{flow.scheduleText}</Badge>
              </div>
              <p style={{ maxWidth: '40rem', fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{flow.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {flow.steps.map((step) => (
                  <StepPill key={step.id} step={step} />
                ))}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>Rule query: {flow.query}</div>
            </div>

            <div style={{ display: 'grid', minWidth: '280px', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Processed today</div>
                <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 700 }}>{flow.processedToday}</div>
              </div>
              <div style={{ borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Success rate</div>
                <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 700 }}>{flow.successRate}%</div>
              </div>
              <div style={{ gridColumn: 'span 2', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '16px', fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                Last run: <span style={{ fontWeight: 600, color: '#1f2937' }}>{flow.lastRun}</span>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
                <Button style={{ flex: 1, padding: '10px 12px', fontSize: '14px' }} variant="outline" onClick={() => onSelect(flow.id)}>
                  <Eye style={{ marginRight: '6px', width: '16px', height: '16px', display: 'inline' }} />
                  Inspect
                </Button>
                <Button style={{ flex: 1, padding: '10px 12px', fontSize: '14px' }} variant={flow.enabled ? "secondary" : "default"} onClick={() => onToggle(flow.id)}>
                  {flow.enabled ? <Pause style={{ marginRight: '6px', width: '16px', height: '16px', display: 'inline' }} /> : <Play style={{ marginRight: '6px', width: '16px', height: '16px', display: 'inline' }} />}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
        {step.type === "label" ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Label>Label name</Label>
            <Input
              value={String(step.config.value ?? "")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, value: e.target.value } })}
              placeholder="e.g., Important, Follow-up"
            />
          </div>
        ) : null}

        {step.type === "notify" ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Label>Notification channel</Label>
            <Select
              value={String(step.config.channel ?? "")}
              onValueChange={(value) => onChange({ ...step, config: { ...step.config, channel: value } })}
            >
              <SelectTrigger style={{ borderRadius: '12px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Label>Draft mode</Label>
            <Select
              value={String(step.config.mode ?? "")}
              onValueChange={(value) => onChange({ ...step, config: { ...step.config, mode: value } })}
            >
              <SelectTrigger style={{ borderRadius: '12px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
            <Label>Summary instructions</Label>
            <Textarea
              value={String(step.config.format ?? "")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, format: e.target.value } })}
              placeholder="Bullet summary with priority and next action"
              style={{ minHeight: '96px' }}
            />
          </div>
        ) : null}

        {step.type === "forward" ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Label>Forward to</Label>
              <Input
                value={String(step.config.to ?? "")}
                onChange={(e) => onChange({ ...step, config: { ...step.config, to: e.target.value } })}
                placeholder="name@example.com"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
            <Label>Delay before next step</Label>
            <Input
              value={String(step.config.duration ?? "15 minutes")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, duration: e.target.value } })}
              placeholder="15 minutes"
            />
          </div>
        ) : null}

        {step.type === "webhook" ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
            <Label>Webhook endpoint</Label>
            <Input
              value={String(step.config.url ?? "")}
              onChange={(e) => onChange({ ...step, config: { ...step.config, url: e.target.value } })}
              placeholder="https://example.com/hooks/email"
            />
          </div>
        ) : null}

        {step.type === "send_email" ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Label>Recipient email</Label>
              <Input
                value={String(step.config.to ?? "")}
                onChange={(e) => onChange({ ...step, config: { ...step.config, to: e.target.value } })}
                placeholder="recipient@example.com"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Label>Email subject</Label>
              <Input
                value={String(step.config.subject ?? "")}
                onChange={(e) => onChange({ ...step, config: { ...step.config, subject: e.target.value } })}
                placeholder="Email subject"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
              <Label>Email body</Label>
              <Textarea
                value={String(step.config.body ?? "")}
                onChange={(e) => onChange({ ...step, config: { ...step.config, body: e.target.value } })}
                placeholder="Email content"
                style={{ minHeight: '120px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
              <Label>Send time (optional)</Label>
              <Input
                type="datetime-local"
                value={String(step.config.scheduleTime ?? "")}
                onChange={(e) => onChange({ ...step, config: { ...step.config, scheduleTime: e.target.value } })}
                placeholder="Leave empty to send immediately"
              />
            </div>
          </>
        ) : null}

        {["archive", "delete", "mark_unread"].includes(step.type) ? (
          <div style={{ gridColumn: 'span 2', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '12px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
            This is a direct mailbox action. It will run automatically whenever the filter matches.
          </div>
        ) : null}
      </div>
    </div>
  );
}


export default function EmailAutomationTool() {
  const [flows, setFlows] = useState<AutomationFlow[]>(defaultFlows);
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);
  const [selectedFlowId, setSelectedFlowId] = useState<string>(defaultFlows[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<"all" | "active" | "paused">("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [successMessage, setSuccessMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check for auth success in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    if (email) {
      setUserEmail(email);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Try to get from localStorage
      const savedEmail = localStorage.getItem("userEmail");
      if (savedEmail) {
        setUserEmail(savedEmail);
      }
    }
  }, []);

  // Handle Gmail login
  const handleGmailLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/url");
      const data = await response.json();
      if (!response.ok || !data.authUrl) {
        throw new Error(data.error || "Failed to get Gmail auth URL.");
      }

      const { authUrl } = data;
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to get auth URL:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to connect Gmail. Make sure the backend is running.";
      setSuccessMessage(`❌ ${message}`);
      setTimeout(() => setSuccessMessage(""), 6000);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem("userEmail");
  };

  // Save userEmail to localStorage
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    }
  }, [userEmail]);

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

  // Helper function to check if an email matches a filter query
  const emailMatchesFilter = (email: EmailItem, query: string): boolean => {
    const queryLower = query.toLowerCase();
    const emailStr = `${email.from} ${email.subject} ${email.preview}`.toLowerCase();
    
    // Simple pattern matching for common Gmail query syntax
    if (queryLower.includes("from:")) {
      const fromMatch = queryLower.match(/from:\(([^)]+)\)/);
      if (fromMatch) {
        const domains = fromMatch[1].split(" OR ").map(d => d.trim().replace(/[()@]/g, ""));
        const matches = domains.some(domain => email.from.toLowerCase().includes(domain.toLowerCase()));
        if (!matches) return false;
      }
    }
    
    if (queryLower.includes("subject:")) {
      const subjectMatch = queryLower.match(/subject:\(([^)]+)\)/);
      if (subjectMatch) {
        const keywords = subjectMatch[1].split(" OR ").map(k => k.trim().replace(/[()]/g, ""));
        const matches = keywords.some(keyword => email.subject.toLowerCase().includes(keyword.toLowerCase()));
        if (!matches) return false;
      }
    }
    
    return true;
  };

  // Helper function to apply workflow steps to an email
  const applyWorkflowSteps = (email: EmailItem, steps: BuilderStep[]): EmailItem => {
    let updatedEmail = { ...email };
    
    for (const step of steps) {
      switch (step.type) {
        case "label":
          if (step.config.value && !updatedEmail.tags.includes(String(step.config.value))) {
            updatedEmail.tags = [...updatedEmail.tags, String(step.config.value)];
          }
          break;
        case "mark_unread":
          updatedEmail.status = "new";
          break;
        case "archive":
          updatedEmail.status = "processed";
          break;
        case "delete":
          updatedEmail.status = "flagged";
          break;
        case "notify":
        case "draft_reply":
        case "forward":
        case "summarize":
        case "webhook":
        case "delay":
          // These steps don't modify the email UI but still count as executed
          break;
      }
    }
    
    return updatedEmail;
  };

  // Execute workflow: filter emails and apply steps
  const executeWorkflowHelper = (flow: AutomationFlow) => {
    const matchedEmails = emails.filter(email => emailMatchesFilter(email, flow.query));
    
    if (matchedEmails.length === 0) {
      return; // No emails to process
    }

    // Apply workflow steps to matched emails
    const updatedEmails = emails.map(email => {
      if (emailMatchesFilter(email, flow.query)) {
        return applyWorkflowSteps(email, flow.steps);
      }
      return email;
    });

    setEmails(updatedEmails);

    // Calculate success rate (simulate 85-100% success)
    const successRate = Math.floor(Math.random() * 16) + 85;
    
    // Get current time for last run
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const lastRun = `Today • ${timeStr}`;

    // Update flow stats
    setFlows(current =>
      current.map(f =>
        f.id === flow.id
          ? {
              ...f,
              processedToday: (f.processedToday || 0) + matchedEmails.length,
              lastRun,
              successRate,
            }
          : f
      )
    );
  };

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
    const flow = flows.find(f => f.id === id);
    if (!flow) return;
    
    const isTogglingOn = !flow.enabled;
    
    // Update flow enabled state
    setFlows(current =>
      current.map(f => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
    
    // If toggling ON, execute the workflow
    if (isTogglingOn) {
      // Use the flow data directly to execute
      const matchedEmails = emails.filter(email => emailMatchesFilter(email, flow.query));
      
      if (matchedEmails.length > 0) {
        // Apply workflow steps to matched emails
        const updatedEmails = emails.map(email => {
          if (emailMatchesFilter(email, flow.query)) {
            return applyWorkflowSteps(email, flow.steps);
          }
          return email;
        });
        
        setEmails(updatedEmails);
      }
      
      // Calculate success rate (simulate 85-100% success)
      const successRate = Math.floor(Math.random() * 16) + 85;
      
      // Get current time for last run
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const lastRun = `Today • ${timeStr}`;
      
      // Update flow stats
      setFlows(current =>
        current.map(f =>
          f.id === id
            ? {
                ...f,
                processedToday: (f.processedToday || 0) + matchedEmails.length,
                lastRun,
                successRate,
              }
            : f
        )
      );
      
      setSuccessMessage(`✓ Workflow "${flow.name}" executed successfully!`);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 24px' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>Email Automation</h1>
            <p style={{ color: '#4b5563' }}>Automate your email workflows with intelligent rules and actions.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {userEmail ? (
              <>
                <div style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px' }} />
                  {userEmail}
                </div>
                <Button variant="outline" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={handleLogout}>
                  <LogOut style={{ marginRight: '6px', width: '16px', height: '16px', display: 'inline' }} />
                  Logout
                </Button>
              </>
            ) : (
              <Button style={{ padding: '10px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleGmailLogin}>
                <Mail style={{ width: '16px', height: '16px' }} />
                Connect Gmail
              </Button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Stat label="Total processed" value={String(totalProcessed)} />
          <Stat label="Active flows" value={String(activeCount)} />
          <Stat label="Avg success rate" value={`${avgSuccess}%`} />
        </div>

        {successMessage && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#10b981', color: 'white', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 100, animation: 'slideIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 500 }}>
              <span style={{ fontSize: '18px' }}>✓</span>
              {successMessage}
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsList style={{ width: '100%', gap: '12px' }}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="starter">Starter templates</TabsTrigger>
            <TabsTrigger value="builder">Build new</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Card>
              <CardHeader>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Search style={{ width: '22px', height: '22px' }} />
                  Your automation flows
                </CardTitle>
                <CardDescription>Manage and monitor all your active workflows.</CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input
                    placeholder="Search workflows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Select value={filterState} onValueChange={(value: any) => setFilterState(value)}>
                    <SelectTrigger style={{ width: '140px' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {filteredFlows.map((flow) => (
                    <FlowOverviewCard key={flow.id} flow={flow} onToggle={toggleFlow} onSelect={setSelectedFlowId} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="starter" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {starterFlows.map((flow, i) => (
              <FlowCard
                key={i}
                name={flow.name}
                trigger={flow.trigger}
                filter={flow.filter}
                action={flow.action}
                isSelected={builderName === flow.name}
                onUse={() => {
                  setBuilderName(flow.name);
                  setBuilderQuery(flow.filter);
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="builder" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Card>
              <CardHeader>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Plus style={{ width: '22px', height: '22px' }} />
                  Build a new workflow
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Label>Workflow name</Label>
                  <Input value={builderName} onChange={(e) => setBuilderName(e.target.value)} placeholder="e.g., Auto-label newsletters" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Label>Trigger mode</Label>
                  <Select value={builderTrigger} onValueChange={setBuilderTrigger}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_email">New emails</SelectItem>
                      <SelectItem value="scheduled">Scheduled time</SelectItem>
                      <SelectItem value="manual">Manual trigger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Label>Schedule</Label>
                  <Input value={builderScheduleText} onChange={(e) => setBuilderScheduleText(e.target.value)} placeholder="e.g., Every 6 hours, Daily at 9am" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Label>Email filter (Gmail query syntax)</Label>
                  <Textarea value={builderQuery} onChange={(e) => setBuilderQuery(e.target.value)} style={{ minHeight: '80px' }} placeholder="from:(@domain.com) subject:(invoice OR receipt)" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Label>Scope</Label>
                  <Select value={builderScope} onValueChange={(value: any) => setBuilderScope(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="workspace">Google Workspace</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Label>Description</Label>
                  <Textarea value={builderDescription} onChange={(e) => setBuilderDescription(e.target.value)} style={{ minHeight: '80px' }} placeholder="What does this workflow do?" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
                  <Switch checked={builderEnabled} onCheckedChange={setBuilderEnabled} />
                  <Label style={{ margin: 0 }}>{builderEnabled ? "Enabled" : "Disabled"}</Label>
                </div>

                <Separator />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>Workflow steps</div>
                    <Button
                      variant="outline"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      onClick={() => setBuilderSteps([...builderSteps, { id: makeId("step"), type: "label", config: {} }])}
                    >
                      + Add step
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {builderSteps.map((step, i) => (
                      <div key={step.id} style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>Step {i + 1}</div>
                          <Select
                            value={step.type}
                            onValueChange={(type: any) => {
                              const updated = [...builderSteps];
                              updated[i] = { ...step, type, config: {} };
                              setBuilderSteps(updated);
                            }}
                          >
                            <SelectTrigger style={{ width: '180px' }}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(actionTypeMeta).map(([key, meta]) => (
                                <SelectItem key={key} value={key}>
                                  {meta.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            onClick={() => setBuilderSteps(builderSteps.filter((_, idx) => idx !== i))}
                          >
                            Remove
                          </Button>
                        </div>
                        <BuilderStepEditor step={step} onChange={(updated) => {
                          const arr = [...builderSteps];
                          arr[i] = updated;
                          setBuilderSteps(arr);
                        }} />
                      </div>
                    ))}
                  </div>
                </div>

                <Button style={{ width: '100%', padding: '12px 16px', fontSize: '16px' }} onClick={() => {
                  const newFlow: AutomationFlow = {
                    id: makeId("flow"),
                    name: builderName,
                    trigger: builderTrigger,
                    scheduleText: builderScheduleText,
                    query: builderQuery,
                    scope: builderScope,
                    description: builderDescription,
                    enabled: builderEnabled,
                    steps: builderSteps,
                    processedToday: 0,
                    successRate: 0,
                    lastRun: "Never",
                  };
                  
                  setFlows([...flows, newFlow]);
                  
                  // If enabled, execute the workflow immediately
                  if (builderEnabled) {
                    const matchedEmails = emails.filter(email => emailMatchesFilter(email, newFlow.query));
                    
                    if (matchedEmails.length > 0) {
                      const updatedEmails = emails.map(email => {
                        if (emailMatchesFilter(email, newFlow.query)) {
                          return applyWorkflowSteps(email, newFlow.steps);
                        }
                        return email;
                      });
                      
                      setEmails(updatedEmails);
                    }
                    
                    const successRate = Math.floor(Math.random() * 16) + 85;
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                    const lastRun = `Today • ${timeStr}`;
                    
                    setFlows(current =>
                      current.map(f =>
                        f.id === newFlow.id
                          ? {
                              ...f,
                              processedToday: matchedEmails.length,
                              lastRun,
                              successRate,
                            }
                          : f
                      )
                    );
                  }
                  
                  setSuccessMessage(`✓ Workflow "${builderName}" created successfully!`);
                  setTimeout(() => setSuccessMessage(""), 4000);
                  setActiveTab("overview");
                  
                  setBuilderName("New automated workflow");
                  setBuilderTrigger("new_email");
                  setBuilderScheduleText("Instant");
                  setBuilderQuery('from:(@newtonschool.co OR @nst.edu)');
                  setBuilderScope("workspace");
                  setBuilderDescription("Watches inbox activity and automatically performs a sequence of actions.");
                  setBuilderEnabled(true);
                  setBuilderSteps([
                    { id: makeId("step"), type: "label", config: { value: "Important" } },
                    { id: makeId("step"), type: "notify", config: { channel: "dashboard" } },
                  ]);
                }}>
                  Create Workflow
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
