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
    title: "資料共有
