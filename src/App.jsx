import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  CalendarDays, KeyRound, FolderOpen, Truck, Search, Plus,
  Bell, MessageCircle, Download, FileText, Image, FileSpreadsheet,
  Presentation, Music, Video, ChevronLeft, X, UploadCloud, Trash2,
  Users, Building2, ShieldCheck, Settings, UserCog, Network, BellRing,
  CalendarCog, ChevronRight, ChevronDown, MapPin, Clock, Pencil, ExternalLink,
  CalendarPlus, Megaphone, Grid3X3, List, CheckCircle2, Camera
} from "lucide-react";

const STORAGE_KEY = "yupei_mobile_state_v1";
const DOC_BUCKET = "yupei-docs";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const CURRENT_USER_NAME = "ログインユーザー";

const initialDepartments = [
  "運営管理局", "ステージPA局", "総務局", "渉外局",
  "情報局", "企画局", "警備局", "財務局"
];

const initialNotices = [
  {
    id: 1,
    title: "資料共有・各種管理機能の運用開始について",
    author: "委員長",
    body: "YUPEI MOBILEにてカレンダー・お知らせ・資料共有・台車管理・鍵管理・落とし物管理の運用を開始しました。各局・班での連絡や備品管理にご活用ください。",
    targets: ["全体公開"],
    createdAt: "2026-11-18T00:30:00"
  }
];

const initialDocs = [
  { id: 1, name: "雄飛祭全体スケジュール.pdf", dept: "委員会活動全体", scope: "全体公開", targetTeam: "", note: "全体の準備日程・当日スケジュール", updated: "2026-11-13T10:00:00", owner: "委員長", comments: ["最新版を掲載しました。"], fileUrl: "", storagePath: "" },
  { id: 2, name: "ステージ音響機材一覧.xlsx", dept: "ステージPA局", scope: "ステージPA局", targetTeam: "", note: "使用機材と数量の一覧", updated: "2026-11-12T15:30:00", owner: "PA 藤﨑", comments: [], fileUrl: "", storagePath: "" },
  { id: 3, name: "警備配置図.pdf", dept: "警備局", scope: "警備局", targetTeam: "トランシーバー班", note: "", updated: "2026-11-11T09:20:00", owner: "警備 佐藤", comments: ["配置の確認をお願いします。"], fileUrl: "", storagePath: "" }
];

const initialKeys = [
  { id: 1, name: "フリスペ 101", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 2, name: "フリスペ 102", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 3, name: "フリスペ 103", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 4, name: "フリスペ 105", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 5, name: "フリスペ 106", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 6, name: "フリスペ 107", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 7, name: "フリスペ 108", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 8, name: "フリスペ 109", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 9, name: "フリスペ 3（多目的スペース3）", status: "保管中", holder: "-", location: "副委員長デスク", history: [] },
  { id: 10, name: "ミーティングルーム 1〜4", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 11, name: "小講堂", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 12, name: "暁月ホール（暁月）", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 13, name: "柊（ひいらぎ）", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 14, name: "楓（かえで）", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 15, name: "楠（くすのき）", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 16, name: "桜（さくら）", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 17, name: "黎明ホール", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 18, name: "音練場・音練場倉庫", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 19, name: "音楽練習場", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 20, name: "スペース2", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 21, name: "天真館", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] },
  { id: 22, name: "4棟 301", status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [] }
];

const initialCartCategories = ["雄飛台車", "学友台車", "かご台車", "ダスキン台車"];

const initialCarts = [
  { id: 1, category: "雄飛台車", name: "雄飛台車 1", status: "保管中", holder: "-", location: "雄飛室", history: [] },
  { id: 2, category: "雄飛台車", name: "雄飛台車 2", status: "保管中", holder: "-", location: "雄飛室", history: [] },
  { id: 3, category: "雄飛台車", name: "雄飛台車 3", status: "保管中", holder: "-", location: "雄飛室", history: [] },
  { id: 4, category: "学友台車", name: "学友台車 1", status: "保管中", holder: "-", location: "雄飛室", history: [] },
  { id: 5, category: "学友台車", name: "学友台車 2", status: "保管中", holder: "-", location: "雄飛室", history: [] },
  { id: 6, category: "学友台車", name: "学友台車 3", status: "保管中", holder: "-", location: "雄飛室", history: [] },
  { id: 7, category: "学友台車", name: "学友台車 4", status: "保管中", holder: "-", location: "雄飛室", history: [] },
  { id: 8, category: "かご台車", name: "かご台車 あいんつ（5）", status: "保管中", holder: "-", location: "学セン階段下", history: [] },
  { id: 9, category: "かご台車", name: "かご台車 つゔぁい", status: "保管中", holder: "-", location: "学セン階段下", history: [] },
  { id: 10, category: "ダスキン台車", name: "ダスキン台車 11", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 11, category: "ダスキン台車", name: "ダスキン台車 12", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 12, category: "ダスキン台車", name: "ダスキン台車 13", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 13, category: "ダスキン台車", name: "ダスキン台車 14", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 14, category: "ダスキン台車", name: "ダスキン台車 15", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 15, category: "ダスキン台車", name: "ダスキン台車 16", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 16, category: "ダスキン台車", name: "ダスキン台車 17", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 17, category: "ダスキン台車", name: "ダスキン台車 18", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 18, category: "ダスキン台車", name: "ダスキン台車 19", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 19, category: "ダスキン台車", name: "ダスキン台車 20", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 20, category: "ダスキン台車", name: "ダスキン台車 21", status: "保管中", holder: "-", location: "4棟前", history: [] },
  { id: 21, category: "ダスキン台車", name: "ダスキン台車 22", status: "保管中", holder: "-", location: "4棟前", history: [] }
];

const initialTeamsByDepartment = {
  "運営管理局": ["衛生班", "エポ班", "火器班", "ダスキン班", "デンポ班"],
  "ステージPA局": [],
  "総務局": [],
  "渉外局": [],
  "情報局": ["広告班", "広報班", "パンフ班"],
  "企画局": ["テント班", "プロコン班", "ホラー班", "開閉班"],
  "警備局": ["看板・自転車班", "イルミ班", "トランシーバー班"],
  "財務局": []
};

const initialMembers = [
  { id: 1, name: "藤﨑", email: "pa@example.com", dept: "ステージPA局", team: "未設定", role: "委員", active: true },
  { id: 2, name: "佐藤", email: "security@example.com", dept: "警備局", team: "トランシーバー班", role: "局長", active: true }
];

const initialPermissions = {
  "委員長": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
  "副委員長": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
  "監査": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
  "局長": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
  "局次": {viewAll:false,editAll:false,emergency:false,manageMembers:false,manageOrg:false},
  "班長": {viewAll:false,editAll:false,emergency:false,manageMembers:false,manageOrg:false},
  "委員": {viewAll:false,editAll:false,emergency:false,manageMembers:false,manageOrg:false},
  "事務課": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true}
};

function normalizeCartCategoryName(cat = "") {
  return cat === "学友会台車" ? "学友台車" : cat;
}

function inferCartCategory(name = "") {
  if (name.includes("雄飛")) return "雄飛台車";
  if (name.includes("学友")) return "学友台車";
  if (name.includes("かご") || name.includes("あいんつ") || name.includes("つゔぁい")) return "かご台車";
  if (name.includes("ダスキン")) return "ダスキン台車";
  return "その他";
}

function loadSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatNowTimeInput() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function formatPostedDateTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  return d.toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function getExtension(name = "") {
  return name.split(".").pop()?.toLowerCase() || "";
}

function fileToDataUrl(fileObj) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(fileObj);
  });
}

function fileIcon(name) {
  const ext = getExtension(name);
  if (["jpg","jpeg","png","gif","webp"].includes(ext)) return <Image />;
  if (["xls","xlsx","csv"].includes(ext)) return <FileSpreadsheet />;
  if (["ppt","pptx"].includes(ext)) return <Presentation />;
  if (["mp3","wav","m4a"].includes(ext)) return <Music />;
  if (["mp4","mov"].includes(ext)) return <Video />;
  return <FileText />;
}

function buildGoogleCalendarUrl(ev) {
  const dateCompact = (ev.date || "").replace(/-/g, "");
  let datesParam = "";
  if (ev.startTime) {
    const startCompact = ev.startTime.replace(":", "") + "00";
    let endCompact = "";
    if (ev.endTime) {
      endCompact = ev.endTime.replace(":", "") + "00";
    } else {
      const [hh, mm] = ev.startTime.split(":").map(Number);
      endCompact = `${String((hh + 1) % 24).padStart(2, "0")}${String(mm || 0).padStart(2, "0")}00`;
    }
    datesParam = `${dateCompact}T${startCompact}/${dateCompact}T${endCompact}`;
  } else {
    const [y, m, d] = (ev.date || "").split("-").map(Number);
    const nextDay = new Date(y, (m || 1) - 1, (d || 1) + 1);
    datesParam = `${dateCompact}/${formatDateKey(nextDay).replace(/-/g, "")}`;
  }
  const scopeLabel = `公開範囲: ${ev.scope}${ev.targetTeam ? `（${ev.targetTeam}）` : ""}`;
  const detailsText = [ev.note, scopeLabel, "YUPEI MOBILE（雄飛祭実行委員会）"].filter(Boolean).join("\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title || "雄飛祭 予定",
    dates: datesParam,
    details: detailsText,
    location: ev.location || "",
    ctz: "Asia/Tokyo"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadEventIcs(ev) {
  const escapeIcs = (str = "") =>
    String(str).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const dateCompact = (ev.date || "").replace(/-/g, "");
  let dtStartLine = "";
  let dtEndLine = "";
  if (ev.startTime) {
    const startCompact = ev.startTime.replace(":", "") + "00";
    let endCompact = "";
    if (ev.endTime) {
      endCompact = ev.endTime.replace(":", "") + "00";
    } else {
      const [hh, mm] = ev.startTime.split(":").map(Number);
      endCompact = `${String((hh + 1) % 24).padStart(2, "0")}${String(mm || 0).padStart(2, "0")}00`;
    }
    dtStartLine = `DTSTART;TZID=Asia/Tokyo:${dateCompact}T${startCompact}`;
    dtEndLine = `DTEND;TZID=Asia/Tokyo:${dateCompact}T${endCompact}`;
  } else {
    const [y, m, d] = (ev.date || "").split("-").map(Number);
    const nextDay = new Date(y, (m || 1) - 1, (d || 1) + 1);
    dtStartLine = `DTSTART;VALUE=DATE:${dateCompact}`;
    dtEndLine = `DTEND;VALUE=DATE:${formatDateKey(nextDay).replace(/-/g, "")}`;
  }
  const nowStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const scopeLabel = `公開範囲: ${ev.scope}${ev.targetTeam ? `（${ev.targetTeam}）` : ""}`;
  const description = [ev.note, scopeLabel, "YUPEI MOBILE（雄飛祭実行委員会）"].filter(Boolean).join("\n");
  const icsContent = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//YUPEI MOBILE//Schedule//JP", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:yupei-${ev.id}-${dateCompact}@yupei-mobile`, `DTSTAMP:${nowStamp}`,
    dtStartLine, dtEndLine, `SUMMARY:${escapeIcs(ev.title || "雄飛祭 予定")}`,
    ev.location ? `LOCATION:${escapeIcs(ev.location)}` : "", `DESCRIPTION:${escapeIcs(description)}`,
    "END:VEVENT", "END:VCALENDAR"
  ].filter(Boolean).join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(ev.title || "event").replace(/[\\/:*?"<>|]/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

const mapNoticeRow = row => ({
  id: row.id, title: row.title, author: row.author || CURRENT_USER_NAME, body: row.body || "",
  targets: Array.isArray(row.targets) && row.targets.length > 0 ? row.targets : ["全体公開"],
  createdAt: row.created_at || new Date().toISOString()
});
const toNoticeRow = n => ({
  id: n.id, title: n.title, author: n.author || CURRENT_USER_NAME, body: n.body || "",
  targets: Array.isArray(n.targets) && n.targets.length > 0 ? n.targets : ["全体公開"], created_at: n.createdAt
});
const mapLostItemRow = row => ({
  id: row.id, name: row.name || "", foundLocation: row.found_location || "",
  foundDate: row.found_date || formatDateKey(new Date(row.created_at || Date.now())),
  foundTime: row.found_time || "", timeUnknown: row.found_time === "時間不明" || row.found_time === "",
  finder: row.finder || CURRENT_USER_NAME, storageType: row.storage_type || "警備本部",
  storageOther: row.storage_other || "", comment: row.comment || "", status: row.status || "保管中",
  photos: Array.isArray(row.photos) ? row.photos : [], createdAt: row.created_at || new Date().toISOString()
});
const toLostItemRow = item => ({
  id: item.id, name: item.name, found_location: item.foundLocation || "",
  found_time: item.timeUnknown ? "時間不明" : (item.foundTime || ""),
  finder: item.finder || CURRENT_USER_NAME, storage_type: item.storageType || "警備本部",
  storage_other: item.storageOther || "", comment: item.comment || "", status: item.status || "保管中",
  photos: Array.isArray(item.photos) ? item.photos : [], created_at: item.createdAt
});
const mapEventRow = row => ({
  id: row.id, title: row.title, date: row.date, startTime: row.start_time || "", endTime: row.end_time || "",
  location: row.location || "", scope: row.scope || "全体公開", targetTeam: row.target_team || "", note: row.note || ""
});
const toEventRow = ev => ({
  id: ev.id, title: ev.title, date: ev.date, start_time: ev.startTime || "", end_time: ev.endTime || "",
  location: ev.location || "", scope: ev.scope || "全体公開", target_team: ev.targetTeam || "", note: ev.note || ""
});
const mapDocRow = row => {
  const storagePath = row.storage_path || "";
  const publicUrl = supabase && storagePath ? supabase.storage.from(DOC_BUCKET).getPublicUrl(storagePath).data?.publicUrl || "" : "";
  return {
    id: row.id, name: row.name, dept: row.dept, scope: row.scope, targetTeam: row.target_team || "",
    note: row.note || "", updated: row.updated, owner: row.owner || CURRENT_USER_NAME,
    comments: Array.isArray(row.comments) ? row.comments : [], storagePath, fileUrl: publicUrl
  };
};
const toDocRow = doc => ({
  id: doc.id, name: doc.name, dept: doc.dept, scope: doc.scope, target_team: doc.targetTeam || "",
  note: doc.note || "", updated: doc.updated, owner: doc.owner || CURRENT_USER_NAME,
  comments: Array.isArray(doc.comments) ? doc.comments : [], storage_path: doc.storagePath || ""
});
const mapKeyRow = row => ({
  id: row.id, name: row.name, status: row.status || "保管中", holder: row.holder || "-",
  location: row.location || "雄飛室・鍵ボックス", history: Array.isArray(row.history) ? row.history : []
});
const mapCartRow = row => {
  const rawCat = row.category ? normalizeCartCategoryName(row.category) : "";
  const resolvedCategory = rawCat && rawCat !== "その他" ? rawCat : inferCartCategory(row.name || "");
  return {
    id: row.id, category: resolvedCategory, name: row.name, status: row.status || "保管中",
    holder: row.holder || "-", location: row.location || "雄飛室", history: Array.isArray(row.history) ? row.history : []
  };
};

export default function App() {
  const todayObj = new Date();
  const todayKey = formatDateKey(todayObj);
  const saved = useMemo(() => loadSavedState(), []);

  const [page, setPage] = useState("home");
  const [section, setSection] = useState("委員会活動全体");
  const [docs, setDocs] = useState(() => Array.isArray(saved?.docs) ? saved.docs.map(({ file, ...rest }) => rest) : initialDocs);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [notices, setNotices] = useState(() => Array.isArray(saved?.notices) ? saved.notices : initialNotices);
  const [showNoticeAddModal, setShowNoticeAddModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: "", body: "", targets: ["全体公開"] });
  const [expandedNoticeDepts, setExpandedNoticeDepts] = useState({});

  const [lostItems, setLostItems] = useState(() => Array.isArray(saved?.lostItems) ? saved.lostItems : []);
  const [lostViewMode, setLostViewMode] = useState("list");
  const [lostStatusFilter, setLostStatusFilter] = useState("保管中");
  const [lostSearchQuery, setLostSearchQuery] = useState("");
  const [lostSearchField, setLostSearchField] = useState("name");
  const [selectedLostDetail, setSelectedLostDetail] = useState(null);
  const [showLostFormModal, setShowLostFormModal] = useState(false);
  const [editingLostItem, setEditingLostItem] = useState(null);
  const [savingLostItem, setSavingLostItem] = useState(false);
  const [lostForm, setLostForm] = useState({
    name: "", foundLocation: "", foundDate: todayKey, foundTime: formatNowTimeInput(), timeUnknown: false,
    finder: CURRENT_USER_NAME, storageType: "警備本部", storageOther: "", comment: "",
    existingPhotos: [], newFiles: [], newPreviews: []
  });

  const [currentMonth, setCurrentMonth] = useState(new Date(todayObj.getFullYear(), todayObj.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [events, setEvents] = useState(() => Array.isArray(saved?.events) ? saved.events : [
    { id: 1, title: "雄飛祭 実行委員会全体会議", date: todayKey, startTime: "17:00", endTime: "18:30", location: "中央棟 / 学生センターフリースペース", scope: "全体公開", targetTeam: "", note: "各局の進捗共有と当日の動きの確認" },
    { id: 2, title: "警備配置・トランシーバー確認", date: todayKey, startTime: "18:45", endTime: "19:30", location: "正門・西門周辺", scope: "警備局", targetTeam: "トランシーバー班", note: "入構許可証の確認手順もあわせて共有" }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "", date: todayKey, startTime: "17:00", endTime: "18:00", location: "", scope: "全体公開", targetTeam: "", note: ""
  });

  const [keys, setKeys] = useState(() => Array.isArray(saved?.keys) ? saved.keys : initialKeys);
  const [showLentModal, setShowLentModal] = useState(false);
  const [selectedKeyDetail, setSelectedKeyDetail] = useState(null);
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [keyEditForm, setKeyEditForm] = useState({ name: "", location: "" });
  const [keySearch, setKeySearch] = useState("");
  const [showKeyAddModal, setShowKeyAddModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyLocation, setNewKeyLocation] = useState("雄飛室・鍵ボックス");

  const [cartCategories, setCartCategories] = useState(() =>
    Array.isArray(saved?.cartCategories) && saved.cartCategories.length > 0
      ? Array.from(new Set(saved.cartCategories.map(normalizeCartCategoryName)))
      : initialCartCategories
  );
  const [activeCartTab, setActiveCartTab] = useState(null);
  const [carts, setCarts] = useState(() =>
    Array.isArray(saved?.carts)
      ? saved.carts.map(c => ({ ...c, category: normalizeCartCategoryName(c.category || inferCartCategory(c.name)) }))
      : initialCarts
  );
  const [showCartLentModal, setShowCartLentModal] = useState(false);
  const [selectedCartDetail, setSelectedCartDetail] = useState(null);
  const [isEditingCart, setIsEditingCart] = useState(false);
  const [cartEditForm, setCartEditForm] = useState({ category: "雄飛台車", name: "", location: "" });
  const [cartSearch, setCartSearch] = useState("");
  const [showCartAddModal, setShowCartAddModal] = useState(false);
  const [addModalMode, setAddModalMode] = useState("cart");
  const [newCartCategory, setNewCartCategory] = useState("雄飛台車");
  const [newCartName, setNewCartName] = useState("");
  const [newCartLocation, setNewCartLocation] = useState("雄飛室");
  const [newTabName, setNewTabName] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [scope, setScope] = useState("全体公開");
  const [targetTeam, setTargetTeam] = useState("");
  const [note, setNote] = useState("");
  const [comment, setComment] = useState("");
  const [departments, setDepartments] = useState(() => Array.isArray(saved?.departments) ? saved.departments : initialDepartments);
  const [teamsByDepartment, setTeamsByDepartment] = useState(() =>
    saved?.teamsByDepartment && typeof saved.teamsByDepartment === "object" ? saved.teamsByDepartment : initialTeamsByDepartment
  );
  const [selectedDept, setSelectedDept] = useState("運営管理局");
  const [newDepartment, setNewDepartment] = useState("");
  const [newTeam, setNewTeam] = useState("");
  const [members, setMembers] = useState(() => Array.isArray(saved?.members) ? saved.members : initialMembers);
  const [memberForm, setMemberForm] = useState({ name: "", email: "", dept: "運営管理局", team: "", role: "委員" });
  const [showMemberForm, setShowMemberForm] = useState(false);

  const permissionRoles = ["委員長", "副委員長", "監査", "局長", "局次", "班長", "委員", "事務課"];
  const permissionItems = [
    ["viewAll", "全局の情報を閲覧"],
    ["editAll", "全局の情報を編集"],
    ["emergency", "緊急連絡を発信"],
    ["manageMembers", "委員・アカウント管理"],
    ["manageOrg", "局・班の管理"]
  ];
  const [permissions, setPermissions] = useState(() =>
    saved?.permissions && typeof saved.permissions === "object" ? saved.permissions : initialPermissions
  );

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    async function syncFromSupabase() {
      const [
        { data: evRows, error: evErr },
        { data: docRows, error: docErr },
        { data: keyRows, error: keyErr },
        { data: cartRows, error: cartErr },
        { data: noticeRows, error: noticeErr },
        { data: lostRows, error: lostErr }
      ] = await Promise.all([
        supabase.from("events").select("*").order("id", { ascending: true }),
        supabase.from("documents").select("*").order("updated", { ascending: false }),
        supabase.from("keys").select("*").order("id", { ascending: true }),
        supabase.from("carts").select("*").order("id", { ascending: true }),
        supabase.from("notices").select("*").order("id", { ascending: false }),
        supabase.from("lost_items").select("*").order("id", { ascending: true })
      ]);
      if (!active) return;
      if (!evErr && Array.isArray(evRows)) {
        if (evRows.length > 0) setEvents(evRows.map(mapEventRow));
        else await supabase.from("events").upsert(events.map(toEventRow));
      }
      if (!docErr && Array.isArray(docRows)) {
        if (docRows.length > 0) setDocs(docRows.map(mapDocRow));
        else await supabase.from("documents").upsert(docs.map(toDocRow));
      }
      if (!keyErr && Array.isArray(keyRows)) {
        if (keyRows.length > 0) setKeys(keyRows.map(mapKeyRow));
        else await supabase.from("keys").upsert(keys);
      }
      if (!cartErr && Array.isArray(cartRows)) {
        if (cartRows.length > 0) {
          const mapped = cartRows.map(mapCartRow);
          setCarts(mapped);
          const extraCats = mapped.map(c => normalizeCartCategoryName(c.category)).filter(Boolean);
          setCartCategories(prev => Array.from(new Set([...prev.map(normalizeCartCategoryName), ...extraCats])));
        } else {
          await supabase.from("carts").upsert(carts);
        }
      }
      if (!noticeErr && Array.isArray(noticeRows)) {
        if (noticeRows.length > 0) setNotices(noticeRows.map(mapNoticeRow));
        else await supabase.from("notices").upsert(notices.map(toNoticeRow));
      }
      if (!lostErr && Array.isArray(lostRows) && lostRows.length > 0) {
        setLostItems(lostRows.map(mapLostItemRow));
      }
    }
    syncFromSupabase();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    try {
      const serializableDocs = docs.map(({ file: _file, ...rest }) => rest);
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ docs: serializableDocs, notices, lostItems, events, keys, carts, cartCategories, departments, teamsByDepartment, members, permissions })
      );
    } catch {}
  }, [docs, notices, lostItems, events, keys, carts, cartCategories, departments, teamsByDepartment, members, permissions]);

  const sortedNotices = useMemo(() => [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [notices]);
  const latestNotice = sortedNotices[0] || null;

  const filteredLostItemsNewestFirst = useMemo(() => {
    const q = lostSearchQuery.trim().toLowerCase();
    return lostItems
      .filter(item => lostStatusFilter === "すべて" ? true : item.status === lostStatusFilter)
      .filter(item => {
        if (!q) return true;
        return lostSearchField === "location"
          ? (item.foundLocation || "").toLowerCase().includes(q)
          : (item.name || "").toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [lostItems, lostStatusFilter, lostSearchQuery, lostSearchField]);

  const allCartTabs = useMemo(() => {
    const base = cartCategories.map(normalizeCartCategoryName).filter(t => t && t !== "ALL");
    const fromCarts = carts.map(c => normalizeCartCategoryName(c.category || inferCartCategory(c.name))).filter(t => t && t !== "ALL");
    return Array.from(new Set([...base, ...fromCarts]));
  }, [cartCategories, carts]);

  const filteredCarts = useMemo(() => carts.filter(c => {
    const cat = normalizeCartCategoryName(c.category || inferCartCategory(c.name));
    const matchesTab = activeCartTab === "ALL" ? true : cat === activeCartTab;
    return matchesTab && c.name.toLowerCase().includes(cartSearch.toLowerCase());
  }), [carts, activeCartTab, cartSearch]);

  const visibleDocs = useMemo(() => docs
    .filter(d => section === "委員会活動全体" ? (d.dept === "委員会活動全体" || d.scope === "全体公開") : (d.dept === section || d.scope === section))
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.updated) - new Date(a.updated)), [docs, section, search]);

  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push({ type: "empty", key: `empty-${i}` });
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const key = formatDateKey(dateObj);
      const dayEvents = events.filter(ev => ev.date === key);
      cells.push({ type: "day", key, day, dayOfWeek: dateObj.getDay(), hasEvents: dayEvents.length > 0 });
    }
    return cells;
  }, [currentMonth, events]);

  const selectedDateEvents = useMemo(() => events
    .filter(ev => ev.date === selectedDate)
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")), [events, selectedDate]);

  const nextUpcomingEvent = useMemo(() => {
    const sorted = [...events].sort((a, b) => `${a.date} ${a.startTime || "00:00"}`.localeCompare(`${b.date} ${b.startTime || "00:00"}`));
    return sorted.find(ev => ev.date >= todayKey) || sorted[0] || null;
  }, [events, todayKey]);

  function openNewLostModal() {
    setSelectedLostDetail(null);
    setEditingLostItem(null);
    setLostForm({
      name: "", foundLocation: "", foundDate: todayKey, foundTime: formatNowTimeInput(), timeUnknown: false,
      finder: CURRENT_USER_NAME, storageType: "警備本部", storageOther: "", comment: "",
      existingPhotos: [], newFiles: [], newPreviews: []
    });
    setShowLostFormModal(true);
  }

  function openEditLostModal(item) {
    setSelectedLostDetail(null);
    setEditingLostItem(item);
    const isUnknown = item.timeUnknown === true || item.foundTime === "時間不明" || item.foundTime === "";
    setLostForm({
      name: item.name || "",
      foundLocation: item.foundLocation || "",
      foundDate: item.foundDate || formatDateKey(new Date(item.createdAt || Date.now())),
      foundTime: isUnknown ? "" : item.foundTime,
      timeUnknown: isUnknown,
      finder: item.finder || CURRENT_USER_NAME,
      storageType: item.storageType || "警備本部",
      storageOther: item.storageOther || "",
      comment: item.comment || "",
      existingPhotos: Array.isArray(item.photos) ? [...item.photos] : [],
      newFiles: [],
      newPreviews: []
    });
    setShowLostFormModal(true);
  }

  async function handleLostPhotoSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const previews = await Promise.all(files.map(f => fileToDataUrl(f)));
    setLostForm(prev => ({ ...prev, newFiles: [...prev.newFiles, ...files], newPreviews: [...prev.newPreviews, ...previews] }));
    e.target.value = "";
  }

  async function saveLostItem() {
    if (!lostForm.name.trim() || savingLostItem) return;
    if (lostForm.storageType === "その他" && !lostForm.storageOther.trim()) {
      alert("「その他」を選択した場合は保管場所を入力してください。");
      return;
    }
    setSavingLostItem(true);
    try {
      const itemId = editingLostItem ? editingLostItem.id : Date.now();
      const originalCreatedAt = editingLostItem ? editingLostItem.createdAt : new Date().toISOString();
      const uploadedUrls = [];
      if (lostForm.newFiles.length > 0) {
        if (supabase) {
          for (let i = 0; i < lostForm.newFiles.length; i++) {
            const f = lostForm.newFiles[i];
            const ext = getExtension(f.name) || "jpg";
            const path = `lost_${itemId}_${Date.now()}_${i}.${ext}`;
            const { error: upErr } = await supabase.storage.from(DOC_BUCKET).upload(path, f, { upsert: false });
            if (!upErr) {
              const pubUrl = supabase.storage.from(DOC_BUCKET).getPublicUrl(path).data?.publicUrl || "";
              if (pubUrl) uploadedUrls.push(pubUrl);
            } else if (lostForm.newPreviews[i]) {
              uploadedUrls.push(lostForm.newPreviews[i]);
            }
          }
        } else {
          uploadedUrls.push(...lostForm.newPreviews);
        }
      }
      const record = {
        id: itemId,
        name: lostForm.name.trim(),
        foundLocation: lostForm.foundLocation.trim(),
        foundDate: lostForm.foundDate || todayKey,
        foundTime: lostForm.timeUnknown ? "時間不明" : (lostForm.foundTime || "時間不明"),
        timeUnknown: !!lostForm.timeUnknown,
        finder: lostForm.finder.trim() || CURRENT_USER_NAME,
        storageType: lostForm.storageType,
        storageOther: lostForm.storageType === "その他" ? lostForm.storageOther.trim() : "",
        comment: lostForm.comment.trim(),
        status: editingLostItem ? editingLostItem.status : "保管中",
        photos: [...lostForm.existingPhotos, ...uploadedUrls],
        createdAt: originalCreatedAt
      };
      if (editingLostItem) {
        setLostItems(prev => prev.map(it => it.id === itemId ? record : it));
      } else {
        setLostItems(prev => [record, ...prev]);
      }
      if (supabase) await supabase.from("lost_items").upsert(toLostItemRow(record));
      setShowLostFormModal(false);
      setEditingLostItem(null);
    } finally {
      setSavingLostItem(false);
    }
  }

  async function toggleLostItemStatus(item) {
    const nextStatus = item.status === "保管中" ? "返却済" : "保管中";
    const msg = nextStatus === "返却済" ? `「${item.name}」を返却済にしますか？` : `「${item.name}」を保管中に戻しますか？`;
    if (!window.confirm(msg)) return;
    const updated = { ...item, status: nextStatus };
    setLostItems(prev => prev.map(it => it.id === item.id ? updated : it));
    if (selectedLostDetail?.id === item.id) setSelectedLostDetail(updated);
    if (supabase) await supabase.from("lost_items").update({ status: nextStatus }).eq("id", item.id);
  }

  async function deleteLostItem(id) {
    if (!window.confirm("この落とし物データを削除しますか？")) return;
    setLostItems(prev => prev.filter(it => it.id !== id));
    if (selectedLostDetail?.id === id) setSelectedLostDetail(null);
    if (supabase) await supabase.from("lost_items").delete().eq("id", id);
  }

  const renderStorageLabel = item =>
    item.storageType === "その他" ? (item.storageOther ? `その他（${item.storageOther}）` : "その他") : (item.storageType || "警備本部");

  const renderFoundDateTimeLabel = item => {
    const dStr = item.foundDate || "";
    const tStr = item.timeUnknown || item.foundTime === "時間不明" || !item.foundTime ? "時間不明" : item.foundTime;
    return [dStr, tStr].filter(Boolean).join(" ") || "未記入";
  };

  function openNoticeAddModal() {
    setNoticeForm({ title: "", body: "", targets: ["全体公開"] });
    setExpandedNoticeDepts({});
    setShowNoticeAddModal(true);
  }

  function toggleNoticeTarget(targetValue) {
    setNoticeForm(prev => {
      const exists = prev.targets.includes(targetValue);
      if (targetValue === "全体公開") {
        return { ...prev, targets: exists ? prev.targets.filter(t => t !== "全体公開") : ["全体公開"] };
      }
      const withoutAll = prev.targets.filter(t => t !== "全体公開");
      return { ...prev, targets: exists ? withoutAll.filter(t => t !== targetValue) : [...withoutAll, targetValue] };
    });
  }

  async function saveNotice() {
    if (!noticeForm.title.trim() || !noticeForm.body.trim()) return;
    const newNotice = {
      id: Date.now(), title: noticeForm.title.trim(), author: CURRENT_USER_NAME, body: noticeForm.body.trim(),
      targets: noticeForm.targets.length > 0 ? noticeForm.targets : ["全体公開"], createdAt: new Date().toISOString()
    };
    setNotices(prev => [newNotice, ...prev]);
    if (supabase) await supabase.from("notices").insert(toNoticeRow(newNotice));
    setShowNoticeAddModal(false);
  }

  async function deleteNotice(id) {
    if (!window.confirm("このお知らせを削除しますか？")) return;
    setNotices(prev => prev.filter(n => n.id !== id));
    if (supabase) await supabase.from("notices").delete().eq("id", id);
  }

  function openNewEventModal(dateStr = selectedDate) {
    setEditingEventId(null);
    setEventForm({ title: "", date: dateStr, startTime: "17:00", endTime: "18:00", location: "", scope: "全体公開", targetTeam: "", note: "" });
    setShowEventModal(true);
  }

  function openEditEventModal(ev) {
    setEditingEventId(ev.id);
    setEventForm({ title: ev.title || "", date: ev.date || selectedDate, startTime: ev.startTime || "", endTime: ev.endTime || "", location: ev.location || "", scope: ev.scope || "全体公開", targetTeam: ev.targetTeam || "", note: ev.note || "" });
    setShowEventModal(true);
  }

  async function saveEvent() {
    if (!eventForm.title.trim() || !eventForm.date) return;
    const availableTeams = eventForm.scope !== "全体公開" ? (teamsByDepartment[eventForm.scope] || []) : [];
    const payload = {
      title: eventForm.title.trim(), date: eventForm.date, startTime: eventForm.startTime, endTime: eventForm.endTime,
      location: eventForm.location.trim(), scope: eventForm.scope, targetTeam: availableTeams.length > 0 ? eventForm.targetTeam : "", note: eventForm.note.trim()
    };
    const targetRecord = editingEventId !== null ? { id: editingEventId, ...payload } : { id: Date.now(), ...payload };
    setEvents(prev => editingEventId !== null ? prev.map(ev => ev.id === editingEventId ? targetRecord : ev) : [...prev, targetRecord]);
    if (supabase) await supabase.from("events").upsert(toEventRow(targetRecord));
    setSelectedDate(eventForm.date);
    const [y, m] = eventForm.date.split("-").map(Number);
    if (y && m) setCurrentMonth(new Date(y, m - 1, 1));
    setEditingEventId(null);
    setShowEventModal(false);
  }

  async function deleteEvent(id) {
    if (!window.confirm("この予定を削除しますか？")) return;
    setEvents(prev => prev.filter(ev => ev.id !== id));
    if (supabase) await supabase.from("events").delete().eq("id", id);
  }

  function openUploadModal() {
    setScope(section === "委員会活動全体" ? "全体公開" : section);
    setTargetTeam("");
    setFile(null);
    setNote("");
    setShowUpload(true);
  }

  async function upload() {
    if (!file || uploadingDoc) return;
    setUploadingDoc(true);
    try {
      const now = new Date().toISOString();
      const availableTeams = scope !== "全体公開" ? (teamsByDepartment[scope] || []) : [];
      const resolvedTeam = availableTeams.length > 0 ? targetTeam : "";
      const resolvedDept = scope === "全体公開" ? "委員会活動全体" : scope;
      const docId = Date.now();
      let storagePath = "";
      let fileUrl = "";
      if (supabase) {
        const safeExt = getExtension(file.name);
        storagePath = `${docId}_${Math.random().toString(36).slice(2, 8)}${safeExt ? `.${safeExt}` : ""}`;
        const { error: uploadErr } = await supabase.storage.from(DOC_BUCKET).upload(storagePath, file, { upsert: false });
        if (uploadErr) {
          alert(`ファイルのアップロードに失敗しました: ${uploadErr.message}`);
          setUploadingDoc(false);
          return;
        }
        fileUrl = supabase.storage.from(DOC_BUCKET).getPublicUrl(storagePath).data?.publicUrl || "";
      } else {
        fileUrl = URL.createObjectURL(file);
      }
      const newDoc = { id: docId, name: file.name, file: supabase ? null : file, fileUrl, storagePath, dept: resolvedDept, scope, targetTeam: resolvedTeam, note, updated: now, owner: CURRENT_USER_NAME, comments: [] };
      setDocs(prev => [newDoc, ...prev]);
      if (supabase) {
        const { error: dbErr } = await supabase.from("documents").insert(toDocRow(newDoc));
        if (dbErr) alert(`資料情報の保存に失敗しました: ${dbErr.message}`);
      }
      setSection(resolvedDept);
      setSearch("");
      setFile(null);
      setNote("");
      setScope("全体公開");
      setTargetTeam("");
      setShowUpload(false);
    } finally {
      setUploadingDoc(false);
    }
  }

  async function addComment() {
    if (!comment.trim() || !selected) return;
    const nextComments = [...selected.comments, comment.trim()];
    const updatedDoc = { ...selected, comments: nextComments };
    setDocs(prev => prev.map(d => d.id === selected.id ? updatedDoc : d));
    setSelected(updatedDoc);
    setComment("");
    if (supabase) await supabase.from("documents").update({ comments: nextComments }).eq("id", selected.id);
  }

  async function removeDoc(id) {
    if (!window.confirm("この資料を完全に削除しますか？この操作は取り消せません。")) return;
    const target = docs.find(d => d.id === id);
    setDocs(prev => prev.filter(d => d.id !== id));
    if (selected?.id === id) setSelected(null);
    if (supabase) {
      if (target?.storagePath) await supabase.storage.from(DOC_BUCKET).remove([target.storagePath]);
      await supabase.from("documents").delete().eq("id", id);
    }
  }

  function openInBrowserTab(doc) {
    if (doc.fileUrl) { window.open(doc.fileUrl, "_blank", "noopener,noreferrer"); return; }
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      return;
    }
    alert("この資料はサンプルデータまたは未保存のためブラウザで開けません。");
  }

  function downloadDoc(doc) {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl; a.download = doc.name; a.target = "_blank"; a.rel = "noopener noreferrer"; a.click();
      return;
    }
    if (!doc.file) { alert("この資料はサンプルデータまたは未保存のためダウンロードできません。"); return; }
    const url = URL.createObjectURL(doc.file);
    const a = document.createElement("a"); a.href = url; a.download = doc.name; a.click();
    URL.revokeObjectURL(url);
  }

  async function updateKeyRecord(nextKey) {
    setKeys(prev => prev.map(item => item.id === nextKey.id ? nextKey : item));
    if (selectedKeyDetail?.id === nextKey.id) setSelectedKeyDetail(nextKey);
    if (supabase) await supabase.from("keys").upsert(nextKey);
  }

  function openKeyDetailModal(keyObj) {
    setSelectedKeyDetail(keyObj);
    setKeyEditForm({ name: keyObj.name || "", location: keyObj.location || "" });
    setIsEditingKey(false);
  }

  const closeKeyDetailModal = () => { setSelectedKeyDetail(null); setIsEditingKey(false); };

  async function saveKeyInfo() {
    if (!selectedKeyDetail || !keyEditForm.name.trim()) return;
    const trimmedName = keyEditForm.name.trim();
    const trimmedLocation = keyEditForm.location.trim() || "雄飛室・鍵ボックス";
    const nowStr = new Date().toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    await updateKeyRecord({
      ...selectedKeyDetail, name: trimmedName,
      location: selectedKeyDetail.status === "保管中" ? trimmedLocation : selectedKeyDetail.location,
      history: [{ time: nowStr, action: `情報編集（${trimmedName} / ${trimmedLocation}）`, user: CURRENT_USER_NAME }, ...(selectedKeyDetail.history || [])]
    });
    setIsEditingKey(false);
  }

  const defaultLocationForCategory = cat => cat === "ダスキン台車" ? "4棟前" : cat === "かご台車" ? "学セン階段下" : "雄飛室";

  async function updateCartRecord(nextCart) {
    setCarts(prev => prev.map(item => item.id === nextCart.id ? nextCart : item));
    if (selectedCartDetail?.id === nextCart.id) setSelectedCartDetail(nextCart);
    if (supabase) await supabase.from("carts").upsert(nextCart);
  }

  async function renameCartTab(oldTabName) {
    if (!oldTabName || oldTabName === "ALL") return;
    const trimmed = window.prompt("新しいタブ名を入力してください。", oldTabName)?.trim();
    if (!trimmed || trimmed === oldTabName) return;
    if (trimmed === "ALL" || trimmed === "すべて表示") { alert("その名前はタブ名に使用できません。"); return; }
    if (allCartTabs.includes(trimmed)) { alert("同じ名前のタブがすでに存在します。"); return; }
    setCartCategories(prev => Array.from(new Set(prev.map(t => (normalizeCartCategoryName(t) === oldTabName ? trimmed : t)))));
    const affectedCarts = carts.filter(c => normalizeCartCategoryName(c.category || inferCartCategory(c.name)) === oldTabName);
    setCarts(carts.map(c => normalizeCartCategoryName(c.category || inferCartCategory(c.name)) === oldTabName ? { ...c, category: trimmed } : c));
    setActiveCartTab(trimmed);
    if (supabase && affectedCarts.length > 0) await supabase.from("carts").upsert(affectedCarts.map(c => ({ ...c, category: trimmed })));
  }

  async function deleteCartTab(tabName) {
    if (!tabName || tabName === "ALL") return;
    const belongingCarts = carts.filter(c => normalizeCartCategoryName(c.category || inferCartCategory(c.name)) === tabName);
    if (belongingCarts.length > 0) {
      if (!window.confirm(`タブ「${tabName}」には ${belongingCarts.length}台 の台車が登録されています。\nタブと一緒に中の台車も削除しますか？`)) return;
      setCarts(carts.filter(c => normalizeCartCategoryName(c.category || inferCartCategory(c.name)) !== tabName));
      setCartCategories(prev => prev.filter(t => normalizeCartCategoryName(t) !== tabName));
      setActiveCartTab(null);
      if (supabase) await supabase.from("carts").delete().in("id", belongingCarts.map(c => c.id));
      return;
    }
    if (!window.confirm(`タブ「${tabName}」を削除しますか？`)) return;
    setCartCategories(prev => prev.filter(t => normalizeCartCategoryName(t) !== tabName));
    setActiveCartTab(null);
  }

  function openCartDetailModal(cartObj) {
    setSelectedCartDetail(cartObj);
    setCartEditForm({ category: normalizeCartCategoryName(cartObj.category || inferCartCategory(cartObj.name)), name: cartObj.name || "", location: cartObj.location || "" });
    setIsEditingCart(false);
  }

  const closeCartDetailModal = () => { setSelectedCartDetail(null); setIsEditingCart(false); };

  async function saveCartInfo() {
    if (!selectedCartDetail || !cartEditForm.name.trim()) return;
    const trimmedName = cartEditForm.name.trim();
    const resolvedCat = normalizeCartCategoryName(cartEditForm.category || "雄飛台車");
    const trimmedLocation = cartEditForm.location.trim() || defaultLocationForCategory(resolvedCat);
    const nowStr = new Date().toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    await updateCartRecord({
      ...selectedCartDetail, category: resolvedCat, name: trimmedName,
      location: selectedCartDetail.status === "保管中" ? trimmedLocation : selectedCartDetail.location,
      history: [{ time: nowStr, action: `情報編集（${resolvedCat} / ${trimmedName} / ${trimmedLocation}）`, user: CURRENT_USER_NAME }, ...(selectedCartDetail.history || [])]
    });
    setIsEditingCart(false);
  }

  function openCartAddModal() {
    const defaultCat = activeCartTab && activeCartTab !== "ALL" ? activeCartTab : (allCartTabs[0] || "雄飛台車");
    setAddModalMode("cart");
    setNewCartCategory(defaultCat);
    setNewCartName("");
    setNewCartLocation(defaultLocationForCategory(defaultCat));
    setNewTabName("");
    setShowCartAddModal(true);
  }

  const menuItems = [
    [CalendarDays, "カレンダー", "calendar"],
    [Megaphone, "お知らせ", "notices"],
    [KeyRound, "鍵管理", "keys"],
    [Truck, "台車管理", "carts"],
    [FolderOpen, "資料共有", "documents"],
    [Search, "落とし物", "lost"],
    [MessageCircle, "問い合わせ", "inquiry"],
    [Settings, "管理者設定", "admin"]
  ];

  const availableTeamsForScope = scope !== "全体公開" ? (teamsByDepartment[scope] || []) : [];
  const availableTeamsForEvent = eventForm.scope !== "全体公開" ? (teamsByDepartment[eventForm.scope] || []) : [];

  const uniformCellStyle = {
    minWidth: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    margin: 0
  };

  const uniformControlStyle = {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    height: "42px",
    padding: "0 10px",
    margin: 0,
    borderRadius: "10px",
    border: "1px solid #dfe5ec",
    fontSize: "13px",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    appearance: "none",
    display: "block"
  };

  return <div className="app-shell">
    <header className="topbar">
      <button type="button" className="brand-home-button" onClick={() => { setPage("home"); setSelected(null); closeKeyDetailModal(); closeCartDetailModal(); setSelectedLostDetail(null); }} aria-label="ホームへ戻る">
        <img src="/image.png" alt="ゆーぺいくん" className="brand-mascot" />
        <div className="brand-text">
          <div className="brand-name">YUPEI MOBILE</div>
          <div className="brand-sub">雄飛祭実行委員会</div>
        </div>
      </button>
      <button className="icon-button top-bell" aria-label="お知らせ" onClick={()=>setPage("notices")}><Bell size={20}/></button>
    </header>

    <main>
      {page === "home" && <section className="page">
        <p className="eyebrow">WELCOME BACK</p><h1>ホーム</h1>
        <div className="hero-card" style={{cursor: "pointer"}} onClick={()=>setPage("calendar")}>
          <div className="hero-label">NEXT EVENT</div>
          <h2>{nextUpcomingEvent ? nextUpcomingEvent.title : "雄飛祭 実行委員会全体会議"}</h2>
          <p>{nextUpcomingEvent ? `${nextUpcomingEvent.date}${nextUpcomingEvent.startTime ? ` ${nextUpcomingEvent.startTime}${nextUpcomingEvent.endTime ? `〜${nextUpcomingEvent.endTime}` : ""}` : ""}${nextUpcomingEvent.location ? ` ／ ${nextUpcomingEvent.location}` : ""}` : "次回の予定日時・場所が表示されます。"}</p>
        </div>

        <div className="section-heading">
          <h3>最新のお知らせ</h3>
          <button type="button" className="muted" onClick={()=>setPage("notices")} style={{background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", fontWeight: 700}}>一覧を表示 →</button>
        </div>

        {latestNotice ? (
          <div className="notice-card" style={{cursor: "pointer"}} onClick={()=>setPage("notices")}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px"}}>
              <strong>{latestNotice.title}</strong>
              <span style={{fontSize: "11px", color: "#203d64", fontWeight: 700, background: "#eef3f9", padding: "2px 8px", borderRadius: "999px", flexShrink: 0}}>{latestNotice.targets.join(" / ")}</span>
            </div>
            <p style={{margin: "6px 0"}}>{latestNotice.body}</p>
            <small>{latestNotice.author} ・ {new Date(latestNotice.createdAt).toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"})}</small>
          </div>
        ) : (
          <div className="notice-card" style={{cursor: "pointer"}} onClick={()=>setPage("notices")}><strong>お知らせはまだありません</strong></div>
        )}

        <h3 className="menu-title">メニュー</h3>
        <div className="menu-grid">
          {menuItems.map(([Icon,label,key]) => <button className="menu-tile" key={key} onClick={()=>setPage(key)}><Icon/><span>{label}</span></button>)}
        </div>
      </section>}

      {page === "lost" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">LOST & FOUND</p>
        <div className="list-heading" style={{marginBottom: "10px"}}>
          <div>
            <h1 style={{marginBottom: "2px"}}>落とし物</h1>
            <p className="muted" style={{margin: 0}}>拾得物の登録・保管状況・返却確認を行います。</p>
          </div>
          <button className="primary small" onClick={openNewLostModal}><Plus size={16}/> 追加</button>
        </div>

        <div style={{display: "flex", gap: "6px", marginBottom: "10px", alignItems: "center"}}>
          <div className="searchbox" style={{flex: 1, margin: 0}}>
            <Search size={18}/>
            <input
              value={lostSearchQuery}
              onChange={e=>setLostSearchQuery(e.target.value)}
              placeholder={lostSearchField === "location" ? "場所で検索（例：中央棟、4棟）" : "落とし物の名前で検索（例：傘、財布）"}
            />
            {lostSearchQuery && (
              <button type="button" aria-label="検索をクリア" onClick={()=>setLostSearchQuery("")} style={{background: "none", border: "none", padding: "2px", cursor: "pointer", color: "#64748b", display: "inline-flex", alignItems: "center"}}>
                <X size={16}/>
              </button>
            )}
          </div>
          <div style={{display: "inline-flex", background: "#eef2f6", padding: "3px", borderRadius: "9px", gap: "2px", flexShrink: 0}}>
            {[{ id: "name", label: "名前" }, { id: "location", label: "場所" }].map(opt => {
              const active = lostSearchField === opt.id;
              return (
                <button key={opt.id} type="button" onClick={()=>setLostSearchField(opt.id)} style={{
                  border: "none", background: active ? "#203d64" : "transparent", color: active ? "#ffffff" : "#475569",
                  borderRadius: "7px", padding: "6px 9px", fontSize: "12px", fontWeight: 700, cursor: "pointer"
                }}>{opt.label}</button>
              );
            })}
          </div>
        </div>

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px"}}>
          <button type="button" onClick={()=>setLostViewMode(prev => prev === "list" ? "photos" : "list")} style={{
            border: "1px solid #203d64", background: lostViewMode === "photos" ? "#203d64" : "#ffffff",
            color: lostViewMode === "photos" ? "#ffffff" : "#203d64", borderRadius: "9px", padding: "7px 11px",
            fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px"
          }}>
            {lostViewMode === "list" ? <><Grid3X3 size={14}/> 写真を表示</> : <><List size={14}/> リスト表示</>}
          </button>

          <div style={{display: "inline-flex", background: "#eef2f6", padding: "3px", borderRadius: "9px", gap: "2px"}}>
            {["保管中", "返却済", "すべて"].map(statusOption => {
              const active = lostStatusFilter === statusOption;
              return (
                <button key={statusOption} type="button" onClick={()=>setLostStatusFilter(statusOption)} style={{
                  border: "none", background: active ? "#203d64" : "transparent", color: active ? "#ffffff" : "#475569",
                  borderRadius: "7px", padding: "5px 10px", fontSize: "12px", fontWeight: 700, cursor: "pointer"
                }}>{statusOption}</button>
              );
            })}
          </div>
        </div>

        {lostViewMode === "photos" ? (
          filteredLostItemsNewestFirst.length === 0 ? (
            <div className="empty">該当する落とし物はありません。</div>
          ) : (
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px"}}>
              {filteredLostItemsNewestFirst.map(item => {
                const thumb = item.photos?.[0] || "";
                const isReturned = item.status === "返却済";
                return (
                  <button key={item.id} type="button" onClick={()=>setSelectedLostDetail(item)} style={{
                    position: "relative", aspectRatio: "3 / 4", borderRadius: "10px", overflow: "hidden",
                    border: isReturned ? "2px solid #2b6843" : "1px solid #dfe5ec", background: "#f1f5f9",
                    padding: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {thumb ? (
                      <img src={thumb} alt={item.name} style={{width: "100%", height: "100%", objectFit: "cover", opacity: isReturned ? 0.72 : 1}} />
                    ) : (
                      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "#64748b", padding: "6px"}}>
                        <Camera size={24}/>
                        <span style={{fontSize: "11px", fontWeight: 700, textAlign: "center", wordBreak: "break-all"}}>{item.name}</span>
                      </div>
                    )}
                    {isReturned && (
                      <span style={{position: "absolute", top: "5px", right: "5px", background: "#2b6843", color: "#ffffff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px"}}>返却済</span>
                    )}
                    <span style={{position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(15, 23, 42, 0.72)", color: "#ffffff", fontSize: "10px", fontWeight: 600, padding: "3px 5px", textAlign: "center"}}>
                      {formatPostedDateTime(item.createdAt)}
                    </span>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <div className="file-list">
            {filteredLostItemsNewestFirst.length === 0 ? (
              <div className="empty">該当する落とし物はありません。</div>
            ) : (
              filteredLostItemsNewestFirst.map(item => {
                const thumb = item.photos?.[0] || "";
                const isReturned = item.status === "返却済";
                return (
                  <div className="file-row" key={item.id} onClick={()=>setSelectedLostDetail(item)} style={{
                    alignItems: "flex-start", gap: "12px", cursor: "pointer",
                    background: isReturned ? "#f4fbf7" : "#ffffff", borderColor: isReturned ? "#b7dfc6" : undefined
                  }}>
                    <div style={{
                      width: "104px", height: "104px", borderRadius: "10px", overflow: "hidden",
                      background: "#f1f5f9", border: "1px solid #e2e8f0", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
                    }}>
                      {thumb ? <img src={thumb} alt={item.name} style={{width: "100%", height: "100%", objectFit: "cover"}} /> : <Camera size={26} color="#94a3b8"/>}
                      {item.photos && item.photos.length > 1 && (
                        <span style={{position: "absolute", bottom: "4px", right: "4px", background: "rgba(15,23,42,0.75)", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "5px"}}>+{item.photos.length - 1}</span>
                      )}
                    </div>
                    <div className="file-info" style={{minWidth: 0}}>
                      <div style={{display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap"}}>
                        <strong style={{fontSize: "15px"}}>{item.name}</strong>
                        <span style={{fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: isReturned ? "#2b6843" : "#fef3c7", color: isReturned ? "#ffffff" : "#92400e"}}>{item.status}</span>
                      </div>
                      <small style={{marginTop: "3px"}}>場所: {item.foundLocation || "未記入"} ／ 日時: {renderFoundDateTimeLabel(item)}</small>
                      <small>発見者: {item.finder} ／ 保管場所: <strong>{renderStorageLabel(item)}</strong></small>
                      {item.comment && <small className="file-note">{item.comment}</small>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>}

      {page === "notices" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">ANNOUNCEMENTS</p>
        <div className="list-heading" style={{marginBottom: "10px"}}>
          <div>
            <h1 style={{marginBottom: "2px"}}>お知らせ</h1>
            <p className="muted" style={{margin: 0}}>委員会全体・各局・各班への連絡事項を確認します。</p>
          </div>
          <button className="primary small" onClick={openNoticeAddModal}><Plus size={16}/> 追加</button>
        </div>
        <div className="file-list">
          {sortedNotices.length === 0 ? <div className="empty">お知らせはまだ登録されていません。</div> : sortedNotices.map(notice => (
            <div className="notice-card" key={notice.id} style={{marginBottom: "10px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px"}}>
                <strong style={{fontSize: "15px"}}>{notice.title}</strong>
                <button type="button" className="danger-outline small" aria-label="お知らせを削除" onClick={()=>deleteNotice(notice.id)}><Trash2 size={14}/></button>
              </div>
              <div style={{display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px"}}>
                {notice.targets.map(t => <span key={t} style={{fontSize: "11px", fontWeight: 700, color: "#203d64", background: "#eef3f9", padding: "2px 8px", borderRadius: "999px"}}>{t}</span>)}
              </div>
              <p style={{margin: "8px 0", whiteSpace: "pre-wrap", lineHeight: 1.55}}>{notice.body}</p>
              <small>作成者: {notice.author} ・ {new Date(notice.createdAt).toLocaleString("ja-JP", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"})}</small>
            </div>
          ))}
        </div>
      </section>}

      {page === "calendar" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">SCHEDULE & EVENTS</p>
        <div className="list-heading" style={{marginBottom: "8px"}}>
          <div>
            <h1 style={{marginBottom: "2px"}}>カレンダー</h1>
            <p className="muted" style={{margin: 0}}>会議・準備・当日のスケジュールを管理します。</p>
          </div>
          <button className="primary small" onClick={()=>openNewEventModal(selectedDate)}><Plus size={16}/> 予定を追加</button>
        </div>
        <div className="notice-card" style={{padding: "14px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px"}}>
            <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
              <strong style={{fontSize: "16px"}}>{currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月</strong>
              <button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "4px 8px", fontSize: "11px", fontWeight: 700, cursor: "pointer"}} onClick={()=>{ const now = new Date(); setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSelectedDate(formatDateKey(now)); }}>今日</button>
            </div>
            <div style={{display: "flex", gap: "6px"}}>
              <button type="button" className="icon-button" onClick={()=>setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}><ChevronLeft size={18}/></button>
              <button type="button" className="icon-button" onClick={()=>setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}><ChevronRight size={18}/></button>
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "12px", fontWeight: 700, marginBottom: "6px"}}>
            {["日","月","火","水","木","金","土"].map((w, idx) => <div key={w} style={{color: idx === 0 ? "#c63d3d" : idx === 6 ? "#24589c" : "#64748b", padding: "4px 0"}}>{w}</div>)}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px"}}>
            {calendarCells.map(cell => {
              if (cell.type === "empty") return <div key={cell.key} style={{height: "46px"}} />;
              const isSelected = cell.key === selectedDate;
              const isToday = cell.key === todayKey;
              const dayColor = isSelected ? "#ffffff" : cell.dayOfWeek === 0 ? "#c63d3d" : cell.dayOfWeek === 6 ? "#24589c" : "#1e293b";
              return (
                <button type="button" key={cell.key} onClick={()=>setSelectedDate(cell.key)} style={{
                  height: "46px", borderRadius: "10px", border: isToday && !isSelected ? "1.5px solid #203d64" : "1px solid transparent",
                  background: isSelected ? "#203d64" : isToday ? "#eef3f9" : "transparent", color: dayColor,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", cursor: "pointer", fontWeight: isToday || isSelected ? 700 : 500
                }}>
                  <span style={{fontSize: "13px", lineHeight: 1}}>{cell.day}</span>
                  <span style={{width: "6px", height: "6px", borderRadius: "999px", background: cell.hasEvents ? (isSelected ? "#93c5fd" : "#203d64") : "transparent"}} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="list-heading">
          <div><h2>{selectedDate} の予定</h2><small>{selectedDateEvents.length}件の予定</small></div>
          <button className="primary small" onClick={()=>openNewEventModal(selectedDate)}><Plus size={15}/> この日に追加</button>
        </div>
        <div className="file-list">
          {selectedDateEvents.length === 0 ? <div className="empty">この日の予定はまだ登録されていません。</div> : selectedDateEvents.map(ev => (
            <div className="file-row" key={ev.id} style={{flexDirection: "column", alignItems: "stretch", gap: "10px"}}>
              <div style={{display: "flex", alignItems: "flex-start", gap: "12px"}}>
                <div className="file-icon"><CalendarDays/></div>
                <div className="file-info">
                  <strong>{ev.title}</strong>
                  <small style={{display: "flex", alignItems: "center", gap: "4px", marginTop: "3px"}}><Clock size={13}/>{ev.startTime ? `${ev.startTime}${ev.endTime ? ` 〜 ${ev.endTime}` : ""}` : "終日 / 時間未定"}</small>
                  {ev.location && <small style={{display: "flex", alignItems: "center", gap: "4px", marginTop: "2px"}}><MapPin size={13}/> {ev.location}</small>}
                  <small style={{marginTop: "3px"}}>公開範囲: {ev.scope}{ev.targetTeam ? `（${ev.targetTeam}）` : ""}</small>
                  {ev.note && <small className="file-note">{ev.note}</small>}
                </div>
                <div style={{display: "flex", gap: "6px"}}>
                  <button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px"}} onClick={()=>openEditEventModal(ev)}><Pencil size={13}/> 編集</button>
                  <button type="button" className="danger-outline small" onClick={()=>deleteEvent(ev.id)}><Trash2 size={15}/></button>
                </div>
              </div>
              <div style={{display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "8px", borderTop: "1px solid #eef2f6"}}>
                <a href={buildGoogleCalendarUrl(ev)} target="_blank" rel="noopener noreferrer" style={{border: "1px solid #dfe5ec", background: "#f8fafc", color: "#1e293b", borderRadius: "8px", padding: "6px 10px", fontSize: "11px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px"}}><CalendarPlus size={13}/> Googleカレンダーに追加</a>
                <button type="button" onClick={()=>downloadEventIcs(ev)} style={{border: "1px solid #dfe5ec", background: "#f8fafc", color: "#1e293b", borderRadius: "8px", padding: "6px 10px", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px"}}><CalendarPlus size={13}/> iPhoneカレンダーに追加 (.ics)</button>
              </div>
            </div>
          ))}
        </div>
      </section>}

      {page === "documents" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">SHARED FILES</p><h1>資料共有</h1>
        <div className="category-grid">
          <button className={`category-tile all full-span ${section==="委員会活動全体"?"active":""}`} onClick={()=>{setSection("委員会活動全体");setSearch("");}}>
            <Users/><strong>委員会活動全体</strong><small>委員会全体の共有資料</small>
          </button>
          {departments.map(d => <button key={d} className={`department-tile ${section===d?"selected":""}`} onClick={()=>{setSection(d);setSearch("");}}>{d}</button>)}
        </div>
        <div className="list-heading"><div><h2>{section}</h2><small>{visibleDocs.length}件の資料</small></div><button className="primary small" onClick={openUploadModal}><Plus size={16}/> アップロード</button></div>
        <div className="searchbox"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ファイル名で検索"/></div>
        <div className="file-list">
          {visibleDocs.length === 0 ? <div className="empty">資料はまだ登録されていません。</div> : visibleDocs.map(doc=>(
            <div className="file-row" key={doc.id} style={{alignItems: "center", gap: "10px"}}>
              <button type="button" onClick={()=>setSelected(doc)} style={{display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0, background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer"}}>
                <div className="file-icon">{fileIcon(doc.name)}</div>
                <div className="file-info">
                  <strong>{doc.name}</strong>
                  <small>公開範囲: {doc.scope}{doc.targetTeam ? `（${doc.targetTeam}）` : ""} ・ {doc.owner} ・ 更新 {new Date(doc.updated).toLocaleDateString("ja-JP")}</small>
                  {doc.note && <small className="file-note">{doc.note}</small>}
                </div>
              </button>
              <button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0}} onClick={e=>{e.stopPropagation(); openInBrowserTab(doc);}}><ExternalLink size={14}/> 開く</button>
            </div>
          ))}
        </div>
      </section>}

      {page === "admin" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">ADMINISTRATION</p><h1>管理者設定</h1>
        <p className="muted">委員会全体の運用に関する設定を管理します。</p>
        <div className="admin-list">
          {[
            [UserCog, "委員・アカウント管理", "委員の登録、招待、利用停止、所属変更"],
            [Network, "局・班の管理", "局や班の追加、名称変更、編成変更"],
            [ShieldCheck, "権限管理", "委員長・副委員長・監査・局長・事務課などの権限設定"],
            [BellRing, "通知・緊急連絡設定", "通知対象や緊急連絡を発信できる役職の設定"],
            [CalendarCog, "年度・アプリ全体の設定", "年度切替、公開期間、各機能の基本設定"]
          ].map(([Icon, title, description], index) => <button className="notice-card admin-card" key={title} onClick={()=>index === 0 ? setPage("admin-members") : index === 1 ? setPage("admin-structure") : index === 2 ? setPage("admin-permissions") : alert("この機能は未実装です。") }>
            <div className="admin-card-icon"><Icon size={22}/></div>
            <div className="admin-card-copy"><strong>{title}</strong><p>{description}</p></div>
            <span className="admin-status">{index < 3 ? "詳細を確認" : "未実装"}</span>
            <ChevronRight size={17}/>
          </button>)}
        </div>
        <div className="placeholder">
          <ShieldCheck size={26}/>
          <strong>{supabase ? "Supabaseクラウド同期 有効" : "ローカル保存モード"}</strong>
          <p>{supabase ? "お知らせ・予定・資料・鍵・台車・落とし物データはSupabaseに保存され、複数端末で共有されます。" : "環境変数が未設定のためローカル保存で動作しています。"}</p>
        </div>
      </section>}

      {page === "admin-permissions" && <section className="page">
        <button className="back-link" onClick={()=>setPage("admin")}><ChevronLeft size={17}/> 管理者設定</button>
        <p className="eyebrow">PERMISSION MANAGEMENT</p><h1>権限管理</h1>
        {permissionRoles.map(role => <div className="notice-card permission-card" key={role}>
          <div className="list-heading" style={{marginBottom: "10px"}}><h2>{role}</h2></div>
          <div className="permission-list">
            {permissionItems.map(([key, label]) => <label className="permission-row" key={key}>
              <input type="checkbox" checked={!!permissions[role]?.[key]} onChange={e => setPermissions(prev => ({ ...prev, [role]: { ...prev[role], [key]: e.target.checked } }))} />
              <span className="permission-label">{label}</span>
            </label>)}
          </div>
        </div>)}
      </section>}

      {page === "admin-members" && <section className="page">
        <button className="back-link" onClick={()=>setPage("admin")}><ChevronLeft size={17}/> 管理者設定</button>
        <p className="eyebrow">MEMBER MANAGEMENT</p><h1>委員・アカウント管理</h1>
        <div className="list-heading">
          <div><h2>委員一覧</h2><small>{members.length}名登録</small></div>
          <button className="primary small" onClick={()=>setShowMemberForm(true)}><Plus size={16}/> 委員を追加</button>
        </div>
        <div className="file-list">
          {members.map(member => <div className="file-row member-row" key={member.id}>
            <div className="file-icon"><Users/></div>
            <div className="file-info">
              <strong>{member.name} <small className="member-role">{member.role}</small></strong>
              <small>{member.email}</small>
              <small>{member.dept}{member.team !== "未設定" && member.team ? ` ・ ${member.team}` : ""}</small>
              <small className={member.active ? "member-active" : "member-inactive"}>{member.active ? "利用中" : "利用停止中"}</small>
            </div>
            <button className="danger-outline member-toggle" onClick={()=>setMembers(prev=>prev.map(m=>m.id===member.id?{...m,active:!m.active}:m))}>{member.active ? "停止" : "再開"}</button>
          </div>)}
        </div>
      </section>}

      {page === "admin-structure" && <section className="page">
        <button className="back-link" onClick={()=>setPage("admin")}><ChevronLeft size={17}/> 管理者設定</button>
        <p className="eyebrow">ORGANIZATION SETTINGS</p><h1>局・班の管理</h1>
        <div className="notice-card">
          <strong>局を追加</strong>
          <div className="comment-entry">
            <input value={newDepartment} onChange={e=>setNewDepartment(e.target.value)} placeholder="新しい局の名称"/>
            <button className="primary" disabled={!newDepartment.trim() || departments.includes(newDepartment.trim())} onClick={()=>{
              const name=newDepartment.trim();setDepartments(prev=>[...prev,name]);setTeamsByDepartment(prev=>({...prev,[name]:[]}));setSelectedDept(name);setNewDepartment("");
            }}>登録</button>
          </div>
        </div>
        <div className="list-heading"><div><h2>局一覧</h2><small>{departments.length}局</small></div></div>
        <div className="file-list">
          {departments.map(dept=><div className="file-row" key={dept}>
            <div className="file-icon"><Building2/></div>
            <div className="file-info"><strong>{dept}</strong><small>{(teamsByDepartment[dept]||[]).length}班 ・ {members.filter(m=>m.dept===dept).length}名</small></div>
            <button className="secondary small" onClick={()=>{
              const renamed=window.prompt("新しい局名を入力してください。",dept)?.trim();
              if(!renamed || renamed===dept) return;
              if(departments.includes(renamed)){alert("同じ名前の局がすでに存在します。");return;}
              setDepartments(prev=>prev.map(d=>d===dept?renamed:d));
              setTeamsByDepartment(prev=>{const next={...prev,[renamed]:prev[dept]||[]};delete next[dept];return next;});
              setMembers(prev=>prev.map(m=>m.dept===dept?{...m,dept:renamed}:m));
              if(selectedDept===dept)setSelectedDept(renamed);
            }}>名称変更</button>
            <button className="danger-outline small" onClick={()=>{
              if(members.some(m=>m.dept===dept)){alert("この局に所属する委員がいるため削除できません。");return;}
              if(window.confirm(`${dept}を削除しますか？`)){setDepartments(prev=>prev.filter(d=>d!==dept));setTeamsByDepartment(prev=>{const next={...prev};delete next[dept];return next;});}
            }}>削除</button>
          </div>)}
        </div>
        <div className="list-heading"><div><h2>班の管理</h2><small>管理する局を選択</small></div></div>
        <label className="field-label">対象の局<select value={selectedDept} onChange={e=>setSelectedDept(e.target.value)}>{departments.map(d=><option key={d}>{d}</option>)}</select></label>
        <div className="notice-card">
          <strong>{selectedDept} に班を追加</strong>
          <div className="comment-entry">
            <input value={newTeam} onChange={e=>setNewTeam(e.target.value)} placeholder="新しい班の名称"/>
            <button className="primary" disabled={!newTeam.trim() || (teamsByDepartment[selectedDept]||[]).includes(newTeam.trim())} onClick={()=>{
              const name=newTeam.trim();setTeamsByDepartment(prev=>({...prev,[selectedDept]:[...(prev[selectedDept]||[]),name]}));setNewTeam("");
            }}>登録</button>
          </div>
        </div>
        <div className="file-list">
          {(teamsByDepartment[selectedDept]||[]).length===0 ? <div className="empty">登録されている班はありません。</div> : (teamsByDepartment[selectedDept]||[]).map(team=><div className="file-row" key={team}>
            <div className="file-icon"><Users/></div><div className="file-info"><strong>{team}</strong></div>
            <button className="secondary small" onClick={()=>{
              const renamed=window.prompt("新しい班名を入力してください。",team)?.trim();
              if(!renamed || renamed===team) return;
              if((teamsByDepartment[selectedDept]||[]).includes(renamed)){alert("同じ名前の班がすでに存在します。");return;}
              setTeamsByDepartment(prev=>({...prev,[selectedDept]:(prev[selectedDept]||[]).map(t=>t===team?renamed:t)}));
              setMembers(prev=>prev.map(m=>m.dept===selectedDept && m.team===team?{...m,team:renamed}:m));
            }}>名称変更</button>
            <button className="danger-outline small" onClick={()=>{
              if(members.some(m=>m.dept===selectedDept && m.team===team)){alert("この班に所属する委員がいるため削除できません。");return;}
              if(window.confirm(`${team}を削除しますか？`))setTeamsByDepartment(prev=>({...prev,[selectedDept]:(prev[selectedDept]||[]).filter(t=>t!==team)}));
            }}>削除</button>
          </div>)}
        </div>
      </section>}

      {page === "keys" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">KEY MANAGEMENT</p><h1>鍵管理</h1>
        <div className="notice-card" style={{marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: keys.filter(k => k.status === "貸出中").length > 0 ? "pointer" : "default"}} onClick={()=>{ if (keys.filter(k => k.status === "貸出中").length > 0) setShowLentModal(true); }}>
          <div>
            <strong>現在の貸出状況</strong>
            <p style={{margin: "4px 0 0"}}>保管中: {keys.filter(k => k.status === "保管中").length}件 ／ 全{keys.length}件</p>
            {keys.filter(k => k.status === "貸出中").length > 0 && <small style={{color: "#203d64", fontWeight: 700, display: "inline-block", marginTop: "4px"}}>詳細を確認（貸出中の鍵と所持者）</small>}
          </div>
          <div style={{textAlign: "right"}}>
            <span style={{fontSize: "11px", color: "#a34343", fontWeight: 700, display: "block"}}>貸出中</span>
            <strong style={{fontSize: "24px", color: "#a34343"}}>{keys.filter(k => k.status === "貸出中").length}<span style={{fontSize: "12px", marginLeft: "2px"}}>件</span></strong>
          </div>
        </div>
        <div className="list-heading">
          <div><h2>鍵一覧</h2><small>{keys.filter(k => k.name.toLowerCase().includes(keySearch.toLowerCase())).length}件の鍵</small></div>
          <button className="primary small" onClick={()=>setShowKeyAddModal(true)}><Plus size={16}/> 鍵を追加</button>
        </div>
        <div className="searchbox">
          <Search size={18}/>
          <input value={keySearch} onChange={e=>setKeySearch(e.target.value)} placeholder="鍵の名前で検索"/>
          {keySearch && (
            <button type="button" aria-label="検索文字を消す" onClick={()=>setKeySearch("")} style={{background: "none", border: "none", padding: "2px", cursor: "pointer", color: "#64748b", display: "inline-flex", alignItems: "center"}}>
              <X size={16}/>
            </button>
          )}
        </div>
        <div className="file-list">
          {keys.filter(k => k.name.toLowerCase().includes(keySearch.toLowerCase())).map(k => <div className="file-row" key={k.id} style={{alignItems: "center", cursor: "pointer"}} onClick={()=>openKeyDetailModal(k)}>
            <div className="file-icon"><KeyRound/></div>
            <div className="file-info">
              <strong>{k.name}</strong>
              <small>状態: <span style={{color: k.status === "保管中" ? "#2b6843" : "#a34343", fontWeight: 700}}>{k.status}</span></small>
              <small>{k.status === "貸出中" ? `所持者: ${k.holder}` : `保管場所: ${k.location}`}</small>
              <small style={{color: "#666", marginTop: "2px"}}>{k.history && k.history.length > 0 ? `最終操作: ${k.history[0].time} ${k.history[0].action}` : "履歴なし（初期状態）"}</small>
            </div>
            <div style={{display: "flex", gap: "6px"}} onClick={e=>e.stopPropagation()}>
              {k.status === "保管中" ? (
                <button className="primary small" onClick={async ()=>{
                  if (!window.confirm(`「${k.name}」の鍵を借りますか？`)) return;
                  const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                  await updateKeyRecord({ ...k, status: "貸出中", holder: CURRENT_USER_NAME, location: "所持中", history: [{time: nowStr, action: "借りる", user: CURRENT_USER_NAME}, ...(k.history || [])] });
                }}>借りる</button>
              ) : (
                <>
                  <button className="secondary small" style={{border: "1px solid #dfe5ec", background: "white", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", fontWeight: 700, cursor: "pointer"}} onClick={async ()=>{
                    if (!window.confirm(`「${k.name}」の鍵を引き継ぎますか？`)) return;
                    const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                    await updateKeyRecord({ ...k, status: "貸出中", holder: CURRENT_USER_NAME, location: "所持中", history: [{time: nowStr, action: "引き継ぐ", user: CURRENT_USER_NAME}, ...(k.history || [])] });
                  }}>引き継ぐ</button>
                  <button className="primary small" style={{background: "#2b6843"}} onClick={async ()=>{
                    if (!window.confirm(`「${k.name}」の鍵を返却しますか？`)) return;
                    const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                    await updateKeyRecord({ ...k, status: "保管中", holder: "-", location: "雄飛室・鍵ボックス", history: [{time: nowStr, action: "返す", user: CURRENT_USER_NAME}, ...(k.history || [])] });
                  }}>返す</button>
                </>
              )}
            </div>
          </div>)}
        </div>
      </section>}

      {page === "carts" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">CART MANAGEMENT</p><h1>台車管理</h1>
        <div className="notice-card" style={{marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: carts.filter(c => c.status === "貸出中").length > 0 ? "pointer" : "default"}} onClick={()=>{ if (carts.filter(c => c.status === "貸出中").length > 0) setShowCartLentModal(true); }}>
          <div>
            <strong>現在の貸出状況</strong>
            <p style={{margin: "4px 0 0"}}>保管中: {carts.filter(c => c.status === "保管中").length}台 ／ 全{carts.length}台</p>
            {carts.filter(c => c.status === "貸出中").length > 0 && <small style={{color: "#203d64", fontWeight: 700, display: "inline-block", marginTop: "4px"}}>詳細を確認（貸出中の台車と使用者）</small>}
          </div>
          <div style={{textAlign: "right"}}>
            <span style={{fontSize: "11px", color: "#a34343", fontWeight: 700, display: "block"}}>貸出中</span>
            <strong style={{fontSize: "24px", color: "#a34343"}}>{carts.filter(c => c.status === "貸出中").length}<span style={{fontSize: "12px", marginLeft: "2px"}}>台</span></strong>
          </div>
        </div>
        <div className="list-heading">
          <div>
            <h2>台車一覧</h2>
            <small>{activeCartTab ? `${activeCartTab === "ALL" ? "すべて" : activeCartTab}（${filteredCarts.length}台）` : "タブを押して開く"}</small>
          </div>
          <div style={{display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end"}}>
            {activeCartTab && activeCartTab !== "ALL" && (
              <>
                <button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "8px 10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px"}} onClick={()=>renameCartTab(activeCartTab)}><Pencil size={13}/> タブ名を編集</button>
                <button type="button" className="danger-outline small" style={{borderRadius: "8px", padding: "8px 10px", fontSize: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px"}} onClick={()=>deleteCartTab(activeCartTab)}><Trash2 size={13}/> タブを削除</button>
              </>
            )}
            <button className="primary small" onClick={openCartAddModal}><Plus size={16}/> 追加</button>
          </div>
        </div>
        <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px"}}>
          {allCartTabs.map(tab => {
            const count = carts.filter(c => normalizeCartCategoryName(c.category || inferCartCategory(c.name)) === tab).length;
            const lentCount = carts.filter(c => normalizeCartCategoryName(c.category || inferCartCategory(c.name)) === tab && c.status === "貸出中").length;
            const isOpen = activeCartTab === tab;
            return (
              <button key={tab} type="button" onClick={() => { setActiveCartTab(prev => prev === tab ? null : tab); setCartSearch(""); }} style={{
                border: isOpen ? "1.5px solid #203d64" : "1px solid #dfe5ec", background: isOpen ? "#203d64" : "#ffffff",
                color: isOpen ? "#ffffff" : "#1e293b", borderRadius: "10px", padding: "9px 12px", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px"
              }}>
                <span>{tab}</span>
                <span style={{fontSize: "11px", padding: "1px 6px", borderRadius: "999px", background: isOpen ? "rgba(255,255,255,0.2)" : "#f1f5f9", color: isOpen ? "#ffffff" : "#475569"}}>{count}台{lentCount > 0 ? `・貸出${lentCount}` : ""}</span>
              </button>
            );
          })}
          <button type="button" onClick={() => { setActiveCartTab(prev => prev === "ALL" ? null : "ALL"); setCartSearch(""); }} style={{
            border: activeCartTab === "ALL" ? "1.5px solid #203d64" : "1px solid #dfe5ec", background: activeCartTab === "ALL" ? "#203d64" : "#f8fafc",
            color: activeCartTab === "ALL" ? "#ffffff" : "#475569", borderRadius: "10px", padding: "9px 12px", fontSize: "13px", fontWeight: 700, cursor: "pointer"
          }}>すべて表示（{carts.length}台）</button>
        </div>
        {activeCartTab === null ? <div className="empty">上の種類別タブをタップすると、台車の一覧が表示されます。</div> : (
          <>
            <div className="searchbox"><Search size={18}/><input value={cartSearch} onChange={e=>setCartSearch(e.target.value)} placeholder={`${activeCartTab === "ALL" ? "台車" : activeCartTab}の中で検索`}/></div>
            <div className="file-list">
              {filteredCarts.length === 0 ? <div className="empty">このタブにはまだ台車が登録されていません。</div> : filteredCarts.map(c => <div className="file-row" key={c.id} style={{alignItems: "center", cursor: "pointer"}} onClick={()=>openCartDetailModal(c)}>
                <div className="file-icon"><Truck/></div>
                <div className="file-info">
                  <strong>{c.name}</strong>
                  <small>種類: {normalizeCartCategoryName(c.category || inferCartCategory(c.name))} ・ 状態: <span style={{color: c.status === "保管中" ? "#2b6843" : "#a34343", fontWeight: 700}}>{c.status}</span></small>
                  <small>{c.status === "貸出中" ? `使用者: ${c.holder}` : `保管場所: ${c.location}`}</small>
                  <small style={{color: "#666", marginTop: "2px"}}>{c.history && c.history.length > 0 ? `最終操作: ${c.history[0].time} ${c.history[0].action}` : "履歴なし（初期状態）"}</small>
                </div>
                <div style={{display: "flex", gap: "6px"}} onClick={e=>e.stopPropagation()}>
                  {c.status === "保管中" ? (
                    <button className="primary small" onClick={async ()=>{
                      if (!window.confirm(`「${c.name}」の台車を借りますか？`)) return;
                      const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                      await updateCartRecord({ ...c, status: "貸出中", holder: CURRENT_USER_NAME, history: [{time: nowStr, action: "借りる", user: CURRENT_USER_NAME}, ...(c.history || [])] });
                    }}>借りる</button>
                  ) : (
                    <>
                      <button className="secondary small" style={{border: "1px solid #dfe5ec", background: "white", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", fontWeight: 700, cursor: "pointer"}} onClick={async ()=>{
                        if (!window.confirm(`「${c.name}」の台車を引き継ぎますか？`)) return;
                        const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                        await updateCartRecord({ ...c, status: "貸出中", holder: CURRENT_USER_NAME, history: [{time: nowStr, action: "引き継ぐ", user: CURRENT_USER_NAME}, ...(c.history || [])] });
                      }}>引き継ぐ</button>
                      <button className="primary small" style={{background: "#2b6843"}} onClick={async ()=>{
                        if (!window.confirm(`「${c.name}」の台車を返却しますか？`)) return;
                        const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                        const cat = normalizeCartCategoryName(c.category || inferCartCategory(c.name));
                        await updateCartRecord({ ...c, status: "保管中", holder: "-", location: c.location || defaultLocationForCategory(cat), history: [{time: nowStr, action: "返す", user: CURRENT_USER_NAME}, ...(c.history || [])] });
                      }}>返す</button>
                    </>
                  )}
                </div>
              </div>)}
            </div>
          </>
        )}
      </section>}

      {page === "inquiry" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">YUPEI MOBILE</p><h1>問い合わせ</h1>
        <div className="placeholder"><ShieldCheck size={28}/><strong>未実装</strong><p>この機能は未実装です。</p></div>
      </section>}
    </main>

    {showLostFormModal && <div className="modal-backdrop" onClick={()=>{setShowLostFormModal(false);setEditingLostItem(null);}}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxHeight: "88vh", overflowY: "auto"}}>
      <div className="modal-head">
        <h2>{editingLostItem ? "落とし物を編集" : "落とし物を登録"}</h2>
        <button className="icon-button" onClick={()=>{setShowLostFormModal(false);setEditingLostItem(null);}}><X/></button>
      </div>
      <label className="field-label">落とし物の名前<input value={lostForm.name} onChange={e=>setLostForm(v=>({...v, name: e.target.value}))} placeholder="例：黒色の折りたたみ傘 / AirPodsケース"/></label>

      <div style={{display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "10px", marginTop: "10px", alignItems: "end"}}>
        <label className="field-label" style={uniformCellStyle}>
          <span>拾得場所</span>
          <input
            style={uniformControlStyle}
            value={lostForm.foundLocation}
            onChange={e=>setLostForm(v=>({...v, foundLocation: e.target.value}))}
            placeholder="例：中央棟 1F"
          />
        </label>

        <label className="field-label" style={uniformCellStyle}>
          <span>日付</span>
          <input
            type="date"
            style={uniformControlStyle}
            value={lostForm.foundDate}
            onChange={e=>setLostForm(v=>({...v, foundDate: e.target.value}))}
          />
        </label>

        <label className="field-label" style={uniformCellStyle}>
          <span>時間</span>
          <input
            type="time"
            disabled={lostForm.timeUnknown}
            value={lostForm.timeUnknown ? "" : lostForm.foundTime}
            onChange={e=>setLostForm(v=>({...v, foundTime: e.target.value, timeUnknown: false}))}
            style={{...uniformControlStyle, background: lostForm.timeUnknown ? "#f1f5f9" : "#ffffff"}}
          />
        </label>

        <div style={uniformCellStyle}>
          <span style={{visibility: "hidden", userSelect: "none"}}>時間不明</span>
          <button
            type="button"
            onClick={()=>setLostForm(v=>({...v, timeUnknown: !v.timeUnknown, foundTime: !v.timeUnknown ? "" : (v.foundTime || formatNowTimeInput())}))}
            style={{
              ...uniformControlStyle,
              border: lostForm.timeUnknown ? "1.5px solid #203d64" : "1px solid #dfe5ec",
              background: lostForm.timeUnknown ? "#203d64" : "#ffffff",
              color: lostForm.timeUnknown ? "#ffffff" : "#334155",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            時間不明
          </button>
        </div>
      </div>

      <label className="field-label">発見者名（ログイン名自動反映）<input value={lostForm.finder} onChange={e=>setLostForm(v=>({...v, finder: e.target.value}))} placeholder="発見者名"/></label>
      <div className="field-label" style={{marginTop: "10px"}}>
        <span>保管場所</span>
        <div style={{display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "8px", marginTop: "6px"}}>
          {["警備本部", "その他"].map(opt => {
            const active = lostForm.storageType === opt;
            return (
              <button key={opt} type="button" onClick={()=>setLostForm(v=>({...v, storageType: opt}))} style={{
                padding: "9px", borderRadius: "9px", border: active ? "1.5px solid #203d64" : "1px solid #dfe5ec",
                background: active ? "#203d64" : "#ffffff", color: active ? "#ffffff" : "#1e293b", fontWeight: 700, fontSize: "13px", cursor: "pointer"
              }}>{opt}</button>
            );
          })}
        </div>
        {lostForm.storageType === "その他" && <input style={{marginTop: "8px"}} value={lostForm.storageOther} onChange={e=>setLostForm(v=>({...v, storageOther: e.target.value}))} placeholder="例：発見者（藤﨑）が所持 / 雄飛室デスク"/>}
      </div>
      <div className="field-label" style={{marginTop: "10px"}}>
        <span>写真（複数枚選択可・1枚目がプレビューに表示されます）</span>
        <label className="upload-zone" style={{marginTop: "6px", padding: "14px"}}>
          <Camera size={24}/><strong>写真を追加する</strong><small>複数選択または追加で複数枚登録できます</small>
          <input type="file" accept="image/*" multiple onChange={handleLostPhotoSelect}/>
        </label>
        {(lostForm.existingPhotos.length > 0 || lostForm.newPreviews.length > 0) && (
          <div style={{display: "flex", gap: "8px", overflowX: "auto", padding: "8px 0"}}>
            {lostForm.existingPhotos.map((src, idx) => (
              <div key={`ex-${idx}`} style={{position: "relative", width: "76px", height: "76px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #cbd5e1"}}>
                <img src={src} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}}/>
                <button type="button" onClick={()=>setLostForm(prev => ({ ...prev, existingPhotos: prev.existingPhotos.filter((_, i) => i !== idx) }))} style={{position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "999px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}}><X size={12}/></button>
              </div>
            ))}
            {lostForm.newPreviews.map((src, idx) => (
              <div key={`new-${idx}`} style={{position: "relative", width: "76px", height: "76px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #203d64"}}>
                <img src={src} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}}/>
                <button type="button" onClick={()=>setLostForm(prev => ({ ...prev, newFiles: prev.newFiles.filter((_, i) => i !== idx), newPreviews: prev.newPreviews.filter((_, i) => i !== idx) }))} style={{position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "999px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}}><X size={12}/></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <label className="field-label">コメント（任意）<textarea rows={3} value={lostForm.comment} onChange={e=>setLostForm(v=>({...v, comment: e.target.value}))} placeholder="特徴や補足事項など（任意）"/></label>
      <button className="primary full" style={{marginTop: "12px"}} disabled={!lostForm.name.trim() || savingLostItem} onClick={saveLostItem}>{savingLostItem ? "保存中..." : (editingLostItem ? "更新を保存" : "登録する")}</button>
    </div></div>}

    {selectedLostDetail && <div className="modal-backdrop" onClick={()=>setSelectedLostDetail(null)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxHeight: "88vh", overflowY: "auto"}}>
      <div className="modal-head">
        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
          <h2 style={{margin: 0}}>{selectedLostDetail.name}</h2>
          <span style={{fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", background: selectedLostDetail.status === "返却済" ? "#2b6843" : "#fef3c7", color: selectedLostDetail.status === "返却済" ? "#ffffff" : "#92400e"}}>{selectedLostDetail.status}</span>
        </div>
        <button className="icon-button" onClick={()=>setSelectedLostDetail(null)}><X/></button>
      </div>
      {selectedLostDetail.photos && selectedLostDetail.photos.length > 0 ? (
        <div style={{margin: "12px 0"}}>
          <div style={{display: "flex", gap: "10px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "6px"}}>
            {selectedLostDetail.photos.map((photoUrl, idx) => (
              <div key={idx} style={{flex: "0 0 85%", maxWidth: "300px", aspectRatio: "4 / 3", borderRadius: "12px", overflow: "hidden", border: "1px solid #dfe5ec", background: "#f8fafc", scrollSnapAlign: "start"}}>
                <img src={photoUrl} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}}/>
              </div>
            ))}
          </div>
          {selectedLostDetail.photos.length > 1 && <small style={{color: "#64748b"}}>横にスワイプ・スクロールして全{selectedLostDetail.photos.length}枚の写真を確認できます</small>}
        </div>
      ) : <div className="empty" style={{margin: "12px 0"}}>写真は登録されていません。</div>}
      <div className="notice-card" style={{margin: "10px 0"}}>
        <p style={{margin: "0 0 6px"}}><strong>拾得場所:</strong> {selectedLostDetail.foundLocation || "未記入"}</p>
        <p style={{margin: "0 0 6px"}}><strong>日付:</strong> {selectedLostDetail.foundDate || "未記入"}</p>
        <p style={{margin: "0 0 6px"}}><strong>時間:</strong> {selectedLostDetail.timeUnknown || selectedLostDetail.foundTime === "時間不明" || !selectedLostDetail.foundTime ? "時間不明" : selectedLostDetail.foundTime}</p>
        <p style={{margin: "0 0 6px"}}><strong>発見者名:</strong> {selectedLostDetail.finder}</p>
        <p style={{margin: "0 0 6px"}}><strong>保管場所:</strong> {renderStorageLabel(selectedLostDetail)}</p>
        <p style={{margin: "0 0 6px"}}><strong>初回登録日時:</strong> {formatPostedDateTime(selectedLostDetail.createdAt)}</p>
        {selectedLostDetail.comment && <p style={{margin: "8px 0 0", paddingTop: "8px", borderTop: "1px solid #e2e8f0", whiteSpace: "pre-wrap"}}><strong>コメント:</strong> {selectedLostDetail.comment}</p>}
      </div>
      <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px"}}>
        <button type="button" className="primary" style={{flex: 1, background: selectedLostDetail.status === "保管中" ? "#2b6843" : "#475569", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px"}} onClick={()=>toggleLostItemStatus(selectedLostDetail)}>
          <CheckCircle2 size={16}/>{selectedLostDetail.status === "保管中" ? "返却済にする" : "保管中に戻す"}
        </button>
        <button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px"}} onClick={()=>openEditLostModal(selectedLostDetail)}><Pencil size={15}/> 編集</button>
        <button type="button" className="danger-outline" onClick={()=>deleteLostItem(selectedLostDetail.id)}><Trash2 size={16}/> 削除</button>
      </div>
    </div></div>}

    {showNoticeAddModal && <div className="modal-backdrop" onClick={()=>setShowNoticeAddModal(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxHeight: "88vh", overflowY: "auto"}}>
      <div className="modal-head"><h2>お知らせを作成</h2><button className="icon-button" onClick={()=>setShowNoticeAddModal(false)}><X/></button></div>
      <label className="field-label">タイトル<input value={noticeForm.title} onChange={e=>setNoticeForm(v=>({...v, title: e.target.value}))} placeholder="例：前日準備の集合時間について"/></label>
      <label className="field-label">作成者（自動反映）<input value={CURRENT_USER_NAME} readOnly style={{background: "#f1f5f9", color: "#475569"}}/></label>
      <label className="field-label">本文<textarea rows={4} value={noticeForm.body} onChange={e=>setNoticeForm(v=>({...v, body: e.target.value}))} placeholder="お知らせの内容を入力してください"/></label>
      <div className="field-label" style={{marginTop: "12px"}}>
        <span>公開設定（複数選択可）</span>
        <div style={{border: "1px solid #dfe5ec", borderRadius: "10px", padding: "8px", marginTop: "6px", background: "#f8fafc"}}>
          <label style={{display: "flex", alignItems: "center", gap: "8px", padding: "6px 4px", fontWeight: 700, cursor: "pointer"}}>
            <input type="checkbox" checked={noticeForm.targets.includes("全体公開")} onChange={()=>toggleNoticeTarget("全体公開")}/><span>全体公開</span>
          </label>
          {departments.map(dept => {
            const teams = teamsByDepartment[dept] || [];
            const isExpanded = !!expandedNoticeDepts[dept];
            return (
              <div key={dept} style={{borderTop: "1px solid #e2e8f0", paddingTop: "4px", marginTop: "4px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px"}}>
                  <label style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flex: 1}}>
                    <input type="checkbox" checked={noticeForm.targets.includes(dept)} onChange={()=>toggleNoticeTarget(dept)}/><span style={{fontWeight: 600}}>{dept}</span>
                  </label>
                  {teams.length > 0 && (
                    <button type="button" onClick={()=>setExpandedNoticeDepts(prev => ({ ...prev, [dept]: !prev[dept] }))} style={{border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: 700, color: "#334155", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px"}}>
                      {isExpanded ? <ChevronDown size={13}/> : <ChevronRight size={13}/>}班を選択 ({teams.length})
                    </button>
                  )}
                </div>
                {teams.length > 0 && isExpanded && (
                  <div style={{paddingLeft: "26px", paddingBottom: "6px", display: "flex", flexDirection: "column", gap: "4px"}}>
                    {teams.map(team => {
                      const teamTarget = `${dept}（${team}）`;
                      return (
                        <label key={team} style={{display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", padding: "2px 0"}}>
                          <input type="checkbox" checked={noticeForm.targets.includes(teamTarget)} onChange={()=>toggleNoticeTarget(teamTarget)}/><span>{team}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <button className="primary full" style={{marginTop: "14px"}} disabled={!noticeForm.title.trim() || !noticeForm.body.trim()} onClick={saveNotice}>投稿する</button>
    </div></div>}

    {showEventModal && <div className="modal-backdrop" onClick={()=>{setShowEventModal(false);setEditingEventId(null);}}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>{editingEventId !== null ? "予定を編集" : "予定を追加"}</h2><button className="icon-button" onClick={()=>{setShowEventModal(false);setEditingEventId(null);}}><X/></button></div>
      <label className="field-label">予定名<input value={eventForm.title} onChange={e=>setEventForm(v=>({...v, title: e.target.value}))} placeholder="例：各局代表者会議"/></label>
      <label className="field-label">日付<input type="date" value={eventForm.date} onChange={e=>setEventForm(v=>({...v, date: e.target.value}))}/></label>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
        <label className="field-label">開始時間<input type="time" value={eventForm.startTime} onChange={e=>setEventForm(v=>({...v, startTime: e.target.value}))}/></label>
        <label className="field-label">終了時間<input type="time" value={eventForm.endTime} onChange={e=>setEventForm(v=>({...v, endTime: e.target.value}))}/></label>
      </div>
      <label className="field-label">場所<input value={eventForm.location} onChange={e=>setEventForm(v=>({...v, location: e.target.value}))} placeholder="例：学生センターフリースペース"/></label>
      <label className="field-label">公開範囲（局）<select value={eventForm.scope} onChange={e=>setEventForm(v=>({...v, scope: e.target.value, targetTeam: ""}))}><option value="全体公開">全体公開</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></label>
      {availableTeamsForEvent.length > 0 && <label className="field-label">公開対象（班）<select value={eventForm.targetTeam} onChange={e=>setEventForm(v=>({...v, targetTeam: e.target.value}))}><option value="">{eventForm.scope} 全体</option>{availableTeamsForEvent.map(t => <option key={t} value={t}>{t}</option>)}</select></label>}
      <label className="field-label">メモ・備考（任意）<textarea value={eventForm.note} onChange={e=>setEventForm(v=>({...v, note: e.target.value}))}/></label>
      <button className="primary full" disabled={!eventForm.title.trim() || !eventForm.date} onClick={saveEvent}>{editingEventId !== null ? "更新を保存" : "登録"}</button>
    </div></div>}

    {showMemberForm && <div className="modal-backdrop" onClick={()=>setShowMemberForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>委員を追加</h2><button className="icon-button" onClick={()=>setShowMemberForm(false)}><X/></button></div>
      <label className="field-label">氏名<input value={memberForm.name} onChange={e=>setMemberForm(v=>({...v,name:e.target.value}))}/></label>
      <label className="field-label">メールアドレス<input type="email" value={memberForm.email} onChange={e=>setMemberForm(v=>({...v,email:e.target.value}))}/></label>
      <label className="field-label">所属局<select value={memberForm.dept} onChange={e=>setMemberForm(v=>({...v,dept:e.target.value,team:""}))}>{departments.map(d=><option key={d}>{d}</option>)}</select></label>
      <label className="field-label">班（任意）<input value={memberForm.team} onChange={e=>setMemberForm(v=>({...v,team:e.target.value}))}/></label>
      <label className="field-label">役職<select value={memberForm.role} onChange={e=>setMemberForm(v=>({...v,role:e.target.value}))}>{["委員長","副委員長","監査","局長","局次","班長","委員","事務課"].map(r=><option key={r}>{r}</option>)}</select></label>
      <button className="primary full" disabled={!memberForm.name.trim() || !memberForm.email.trim()} onClick={()=>{
        setMembers(prev=>[...prev,{id:Date.now(),name:memberForm.name.trim(),email:memberForm.email.trim(),dept:memberForm.dept,team:memberForm.team.trim()||"未設定",role:memberForm.role,active:true}]);
        setMemberForm({name:"",email:"",dept:"運営管理局",team:"",role:"委員"});setShowMemberForm(false);
      }}>登録</button>
    </div></div>}

    {showUpload && <div className="modal-backdrop" onClick={()=>setShowUpload(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>資料をアップロード</h2><button className="icon-button" onClick={()=>setShowUpload(false)}><X/></button></div>
      <label className="upload-zone"><UploadCloud size={27}/><strong>{file ? file.name : "ファイルを選択"}</strong><small>基本的なファイル形式に対応しています</small><input type="file" onChange={e=>setFile(e.target.files?.[0] || null)}/></label>
      <label className="field-label">公開範囲（局）<select value={scope} onChange={e => { setScope(e.target.value); setTargetTeam(""); }}><option value="全体公開">全体公開</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></label>
      {availableTeamsForScope.length > 0 && <label className="field-label">公開対象（班）<select value={targetTeam} onChange={e => setTargetTeam(e.target.value)}><option value="">{scope} 全体</option>{availableTeamsForScope.map(t => <option key={t} value={t}>{t}</option>)}</select></label>}
      <label className="field-label">説明・備考（任意）<textarea value={note} onChange={e=>setNote(e.target.value)}/></label>
      <button className="primary full" disabled={!file || uploadingDoc} onClick={upload}>{uploadingDoc ? "アップロード中..." : "登録"}</button>
    </div></div>}

    {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>資料の詳細</h2><button className="icon-button" onClick={()=>setSelected(null)}><X/></button></div>
      <div className="detail-file">
        <div className="file-icon large">{fileIcon(selected.name)}</div>
        <div><strong>{selected.name}</strong><small>{selected.dept} ・ {selected.scope}{selected.targetTeam ? `（${selected.targetTeam}）` : ""}</small></div>
      </div>
      {selected.note && <p className="detail-note">{selected.note}</p>}
      <div className="detail-actions" style={{flexWrap: "wrap"}}>
        <button className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px"}} onClick={()=>openInBrowserTab(selected)}><ExternalLink size={16}/> ブラウザで開く</button>
        <button className="primary" onClick={()=>downloadDoc(selected)}><Download size={17}/> ダウンロード</button>
        <button className="danger-outline" onClick={()=>removeDoc(selected.id)}><Trash2 size={17}/> 削除</button>
      </div>
      <h3 className="comments-title">コメント ({selected.comments.length})</h3>
      <div className="comments">{selected.comments.map((c,i)=><div className="comment" key={i}><p>{c}</p><small>{CURRENT_USER_NAME}</small></div>)}</div>
      <div className="comment-entry"><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="コメントを入力"/><button className="primary" onClick={addComment} disabled={!comment.trim()}>送信</button></div>
    </div></div>}

    {showLentModal && <div className="modal-backdrop" onClick={()=>setShowLentModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>貸出中の鍵一覧</h2><button className="icon-button" onClick={()=>setShowLentModal(false)}><X/></button></div>
      <div className="file-list" style={{maxHeight: "350px", overflowY: "auto", marginTop: "12px"}}>
        {keys.filter(k => k.status === "貸出中").map(k => (
          <div className="file-row" key={k.id} style={{flexDirection: "column", alignItems: "flex-start", gap: "4px"}}>
            <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}><strong>{k.name}</strong><span style={{fontSize: "12px", color: "#a34343", fontWeight: 700}}>貸出中</span></div>
            <small>所持者: <strong>{k.holder}</strong></small>
          </div>
        ))}
      </div>
      <button className="primary full" style={{marginTop: "16px"}} onClick={()=>setShowLentModal(false)}>閉じる</button>
    </div></div>}

    {selectedKeyDetail && <div className="modal-backdrop" onClick={closeKeyDetailModal}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>{selectedKeyDetail.name} の詳細</h2><button className="icon-button" onClick={closeKeyDetailModal}><X/></button></div>
      {!isEditingKey ? (
        <div className="notice-card" style={{margin: "12px 0"}}>
          <p style={{margin: 0}}>状態: <strong style={{color: selectedKeyDetail.status === "保管中" ? "#2b6843" : "#a34343"}}>{selectedKeyDetail.status}</strong></p>
          <p style={{margin: "4px 0 0"}}>所持者 / 保管場所: <strong>{selectedKeyDetail.status === "貸出中" ? selectedKeyDetail.holder : selectedKeyDetail.location}</strong></p>
          <div style={{marginTop: "10px"}}><button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px"}} onClick={()=>{ setKeyEditForm({ name: selectedKeyDetail.name || "", location: selectedKeyDetail.location || "" }); setIsEditingKey(true); }}><Pencil size={13}/> 名前・保管場所を編集</button></div>
        </div>
      ) : (
        <div className="notice-card" style={{margin: "12px 0"}}>
          <label className="field-label" style={{marginTop: 0}}>鍵の名前<input value={keyEditForm.name} onChange={e=>setKeyEditForm(v=>({...v, name: e.target.value}))}/></label>
          <label className="field-label">保管場所<input value={keyEditForm.location} onChange={e=>setKeyEditForm(v=>({...v, location: e.target.value}))}/></label>
          <div style={{display: "flex", gap: "8px", marginTop: "12px"}}>
            <button type="button" className="primary small" disabled={!keyEditForm.name.trim()} onClick={saveKeyInfo}>保存</button>
            <button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: 700, cursor: "pointer"}} onClick={()=>setIsEditingKey(false)}>キャンセル</button>
          </div>
        </div>
      )}
      <h3 style={{fontSize: "14px", margin: "16px 0 8px"}}>操作履歴</h3>
      <div className="file-list" style={{maxHeight: "250px", overflowY: "auto"}}>
        {!selectedKeyDetail.history || selectedKeyDetail.history.length === 0 ? <div className="empty">操作履歴はありません。</div> : selectedKeyDetail.history.map((h, i) => (
          <div className="file-row" key={i} style={{padding: "8px 12px"}}><div className="file-icon"><KeyRound size={16}/></div><div className="file-info"><strong>{h.action}</strong><small>{h.time} ・ {h.user}</small></div></div>
        ))}
      </div>
      <button className="primary full" style={{marginTop: "16px"}} onClick={closeKeyDetailModal}>閉じる</button>
    </div></div>}

    {showKeyAddModal && <div className="modal-backdrop" onClick={()=>setShowKeyAddModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>新しい鍵を追加</h2><button className="icon-button" onClick={()=>setShowKeyAddModal(false)}><X/></button></div>
      <label className="field-label">鍵の名前<input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)}/></label>
      <label className="field-label">保管場所<input value={newKeyLocation} onChange={e=>setNewKeyLocation(e.target.value)}/></label>
      <button className="primary full" disabled={!newKeyName.trim()} onClick={async ()=>{
        const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
        const newKey = { id: Date.now(), name: newKeyName.trim(), status: "保管中", holder: "-", location: newKeyLocation.trim() || "雄飛室・鍵ボックス", history: [{time: nowStr, action: "登録", user: CURRENT_USER_NAME}] };
        setKeys(prev => [newKey, ...prev]);
        if (supabase) await supabase.from("keys").insert(newKey);
        setNewKeyName(""); setNewKeyLocation("雄飛室・鍵ボックス"); setShowKeyAddModal(false);
      }}>登録</button>
    </div></div>}

    {showCartLentModal && <div className="modal-backdrop" onClick={()=>setShowCartLentModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>貸出中の台車一覧</h2><button className="icon-button" onClick={()=>setShowCartLentModal(false)}><X/></button></div>
      <div className="file-list" style={{maxHeight: "350px", overflowY: "auto", marginTop: "12px"}}>
        {carts.filter(c => c.status === "貸出中").map(c => (
          <div className="file-row" key={c.id} style={{flexDirection: "column", alignItems: "flex-start", gap: "4px"}}>
            <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}><strong>{c.name}</strong><span style={{fontSize: "12px", color: "#a34343", fontWeight: 700}}>貸出中</span></div>
            <small>種類: {normalizeCartCategoryName(c.category || inferCartCategory(c.name))} ・ 使用者: <strong>{c.holder}</strong></small>
          </div>
        ))}
      </div>
      <button className="primary full" style={{marginTop: "16px"}} onClick={()=>setShowCartLentModal(false)}>閉じる</button>
    </div></div>}

    {selectedCartDetail && <div className="modal-backdrop" onClick={closeCartDetailModal}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>{selectedCartDetail.name} の詳細</h2><button className="icon-button" onClick={closeCartDetailModal}><X/></button></div>
      {!isEditingCart ? (
        <div className="notice-card" style={{margin: "12px 0"}}>
          <p style={{margin: 0}}>種類（タブ）: <strong>{normalizeCartCategoryName(selectedCartDetail.category || inferCartCategory(selectedCartDetail.name))}</strong></p>
          <p style={{margin: "4px 0 0"}}>状態: <strong style={{color: selectedCartDetail.status === "保管中" ? "#2b6843" : "#a34343"}}>{selectedCartDetail.status}</strong></p>
          <p style={{margin: "4px 0 0"}}>使用者 / 保管場所: <strong>{selectedCartDetail.status === "貸出中" ? selectedCartDetail.holder : selectedCartDetail.location}</strong></p>
          <div style={{marginTop: "10px"}}><button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px"}} onClick={()=>{ setCartEditForm({ category: normalizeCartCategoryName(selectedCartDetail.category || inferCartCategory(selectedCartDetail.name)), name: selectedCartDetail.name || "", location: selectedCartDetail.location || "" }); setIsEditingCart(true); }}><Pencil size={13}/> 名前・保管場所を編集</button></div>
        </div>
      ) : (
        <div className="notice-card" style={{margin: "12px 0"}}>
          <label className="field-label" style={{marginTop: 0}}>種類（タブ）<select value={cartEditForm.category} onChange={e=>setCartEditForm(v=>({...v, category: e.target.value}))}>{allCartTabs.map(tab => <option key={tab} value={tab}>{tab}</option>)}</select></label>
          <label className="field-label">台車の名前・番号<input value={cartEditForm.name} onChange={e=>setCartEditForm(v=>({...v, name: e.target.value}))}/></label>
          <label className="field-label">保管場所<input value={cartEditForm.location} onChange={e=>setCartEditForm(v=>({...v, location: e.target.value}))}/></label>
          <div style={{display: "flex", gap: "8px", marginTop: "12px"}}>
            <button type="button" className="primary small" disabled={!cartEditForm.name.trim()} onClick={saveCartInfo}>保存</button>
            <button type="button" className="secondary small" style={{border: "1px solid #dfe5ec", background: "#fff", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: 700, cursor: "pointer"}} onClick={()=>setIsEditingCart(false)}>キャンセル</button>
          </div>
        </div>
      )}
      <h3 style={{fontSize: "14px", margin: "16px 0 8px"}}>操作履歴</h3>
      <div className="file-list" style={{maxHeight: "250px", overflowY: "auto"}}>
        {!selectedCartDetail.history || selectedCartDetail.history.length === 0 ? <div className="empty">操作履歴はありません。</div> : selectedCartDetail.history.map((h, i) => (
          <div className="file-row" key={i} style={{padding: "8px 12px"}}><div className="file-icon"><Truck size={16}/></div><div className="file-info"><strong>{h.action}</strong><small>{h.time} ・ {h.user}</small></div></div>
        ))}
      </div>
      <button className="primary full" style={{marginTop: "16px"}} onClick={closeCartDetailModal}>閉じる</button>
    </div></div>}

    {showCartAddModal && <div className="modal-backdrop" onClick={()=>setShowCartAddModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>追加</h2><button className="icon-button" onClick={()=>setShowCartAddModal(false)}><X/></button></div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px"}}>
        <button type="button" onClick={()=>setAddModalMode("cart")} style={{padding: "10px", borderRadius: "10px", border: addModalMode === "cart" ? "1.5px solid #203d64" : "1px solid #dfe5ec", background: addModalMode === "cart" ? "#203d64" : "#ffffff", color: addModalMode === "cart" ? "#ffffff" : "#1e293b", fontWeight: 700, fontSize: "13px", cursor: "pointer"}}>台車を追加</button>
        <button type="button" onClick={()=>setAddModalMode("tab")} style={{padding: "10px", borderRadius: "10px", border: addModalMode === "tab" ? "1.5px solid #203d64" : "1px solid #dfe5ec", background: addModalMode === "tab" ? "#203d64" : "#ffffff", color: addModalMode === "tab" ? "#ffffff" : "#1e293b", fontWeight: 700, fontSize: "13px", cursor: "pointer"}}>タブを追加</button>
      </div>
      {addModalMode === "cart" ? (
        <>
          <label className="field-label">種類（タブ）<select value={newCartCategory} onChange={e => { setNewCartCategory(e.target.value); setNewCartLocation(defaultLocationForCategory(e.target.value)); }}>{allCartTabs.map(tab => <option key={tab} value={tab}>{tab}</option>)}</select></label>
          <label className="field-label">台車の名前・番号<input value={newCartName} onChange={e=>setNewCartName(e.target.value)}/></label>
          <label className="field-label">保管場所<input value={newCartLocation} onChange={e=>setNewCartLocation(e.target.value)}/></label>
          <button className="primary full" disabled={!newCartName.trim()} onClick={async ()=>{
            const cat = normalizeCartCategoryName(newCartCategory || "雄飛台車");
            const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
            const newCart = { id: Date.now(), category: cat, name: newCartName.trim(), status: "保管中", holder: "-", location: newCartLocation.trim() || defaultLocationForCategory(cat), history: [{time: nowStr, action: "登録", user: CURRENT_USER_NAME}] };
            setCarts(prev => [newCart, ...prev]);
            if (supabase) await supabase.from("carts").insert(newCart);
            setActiveCartTab(cat); setNewCartName(""); setShowCartAddModal(false);
          }}>台車を登録</button>
        </>
      ) : (
        <>
          <label className="field-label">新しいタブ名（種類名）<input value={newTabName} onChange={e=>setNewTabName(e.target.value)}/></label>
          <button className="primary full" disabled={!newTabName.trim() || allCartTabs.includes(newTabName.trim())} onClick={()=>{
            const tabName = newTabName.trim();
            setCartCategories(prev => Array.from(new Set([...prev, tabName])));
            setActiveCartTab(tabName); setNewTabName(""); setShowCartAddModal(false);
          }}>タブを登録</button>
        </>
      )}
    </div></div>}
  </div>;
}
