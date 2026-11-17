import React, { useMemo, useState } from "react";
import {
  Home, CalendarDays, KeyRound, FolderOpen, Truck, Search, Plus,
  Bell, MessageCircle, Download, FileText, Image, FileSpreadsheet,
  Presentation, Music, Video, ChevronLeft, X, UploadCloud, Trash2,
  Users, Building2, ShieldCheck, Settings, UserCog, Network, BellRing,
  CalendarCog, ChevronRight
} from "lucide-react";

const initialDepartments = [
  "運営管理局", "ステージPA局", "総務局", "渉外局",
  "情報局", "企画局", "警備局", "財務局"
];

const initialDocs = [
  { id: 1, name: "雄飛祭全体スケジュール.pdf", dept: "委員会活動全体", scope: "全体公開", targetTeam: "", note: "全体の準備日程・当日スケジュール", updated: "2026-11-13T10:00:00", owner: "委員長", comments: ["最新版を掲載しました。"] },
  { id: 2, name: "ステージ音響機材一覧.xlsx", dept: "ステージPA局", scope: "ステージPA局", targetTeam: "", note: "使用機材と数量の一覧", updated: "2026-11-12T15:30:00", owner: "PA 藤﨑", comments: [] },
  { id: 3, name: "警備配置図.pdf", dept: "警備局", scope: "警備局", targetTeam: "トランシーバー班", note: "", updated: "2026-11-11T09:20:00", owner: "警備 佐藤", comments: ["配置の確認をお願いします。"] }
];

function fileIcon(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg","jpeg","png","gif","webp"].includes(ext)) return <Image />;
  if (["xls","xlsx","csv"].includes(ext)) return <FileSpreadsheet />;
  if (["ppt","pptx"].includes(ext)) return <Presentation />;
  if (["mp3","wav","m4a"].includes(ext)) return <Music />;
  if (["mp4","mov"].includes(ext)) return <Video />;
  return <FileText />;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [section, setSection] = useState("委員会活動全体");
  const [docs, setDocs] = useState(initialDocs);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [keys, setKeys] = useState([
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
  ]);
  const [showLentModal, setShowLentModal] = useState(false);
  const [selectedKeyDetail, setSelectedKeyDetail] = useState(null);
  const [keySearch, setKeySearch] = useState("");
  const [showKeyAddModal, setShowKeyAddModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyLocation, setNewKeyLocation] = useState("雄飛室・鍵ボックス");
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [scope, setScope] = useState("全体公開");
  const [targetTeam, setTargetTeam] = useState("");
  const [note, setNote] = useState("");
  const [comment, setComment] = useState("");
  const [departments, setDepartments] = useState(initialDepartments);
  const [teamsByDepartment, setTeamsByDepartment] = useState({
    "運営管理局": ["衛生班", "エポ班", "火器班", "ダスキン班", "デンポ班"],
    "ステージPA局": [],
    "総務局": [],
    "渉外局": [],
    "情報局": ["広告班", "広報班", "パンフ班"],
    "企画局": ["テント班", "プロコン班", "ホラー班", "開閉班"],
    "警備局": ["看板・自転車班", "イルミ班", "トランシーバー班"],
    "財務局": []
  });
  const [selectedDept, setSelectedDept] = useState("運営管理局");
  const [newDepartment, setNewDepartment] = useState("");
  const [newTeam, setNewTeam] = useState("");
  const [members, setMembers] = useState([
    { id: 1, name: "藤﨑", email: "pa@example.com", dept: "ステージPA局", team: "未設定", role: "委員", active: true },
    { id: 2, name: "佐藤", email: "security@example.com", dept: "警備局", team: "トランシーバー班", role: "局長", active: true }
  ]);
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
  const [permissions, setPermissions] = useState({
    "委員長": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
    "副委員長": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
    "監査": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
    "局長": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true},
    "局次": {viewAll:false,editAll:false,emergency:false,manageMembers:false,manageOrg:false},
    "班長": {viewAll:false,editAll:false,emergency:false,manageMembers:false,manageOrg:false},
    "委員": {viewAll:false,editAll:false,emergency:false,manageMembers:false,manageOrg:false},
    "事務課": {viewAll:true,editAll:true,emergency:true,manageMembers:true,manageOrg:true}
  });

  const visibleDocs = useMemo(() => docs
    .filter(d => d.dept === section)
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => new Date(b.updated) - new Date(a.updated)), [docs, section, search]);

  function upload() {
    if (!file) return;
    const now = new Date().toISOString();
    const availableTeams = scope !== "全体公開" ? (teamsByDepartment[scope] || []) : [];
    const resolvedTeam = availableTeams.length > 0 ? targetTeam : "";
    setDocs(prev => [{
      id: Date.now(),
      name: file.name,
      file,
      dept: section,
      scope,
      targetTeam: resolvedTeam,
      note,
      updated: now,
      owner: "ログインユーザー",
      comments: []
    }, ...prev]);
    setFile(null);
    setNote("");
    setScope("全体公開");
    setTargetTeam("");
    setShowUpload(false);
  }

  function addComment() {
    if (!comment.trim() || !selected) return;
    const updated = docs.map(d => d.id === selected.id ? {...d, comments: [...d.comments, comment.trim()]} : d);
    setDocs(updated); setSelected(updated.find(d => d.id === selected.id)); setComment("");
  }

  function removeDoc(id) {
    if (!window.confirm("この資料を完全に削除しますか？この操作は取り消せません。")) return;
    setDocs(prev => prev.filter(d => d.id !== id)); setSelected(null);
  }

  function downloadDoc(doc) {
    if (!doc.file) { alert("サンプル資料のためダウンロードできません。データベース連携後に利用可能になります。"); return; }
    const url = URL.createObjectURL(doc.file);
    const a = document.createElement("a"); a.href = url; a.download = doc.name; a.click();
    URL.revokeObjectURL(url);
  }

  const menuItems = [
    [CalendarDays, "カレンダー", "calendar"],
    [KeyRound, "鍵管理", "keys"],
    [FolderOpen, "資料共有", "documents"],
    [Truck, "台車管理", "carts"]
  ];

  const availableTeamsForScope = scope !== "全体公開" ? (teamsByDepartment[scope] || []) : [];

  return <div className="app-shell">
    <header className="topbar">
      <button
        type="button"
        className="brand-home-button"
        onClick={() => { setPage("home"); setSelected(null); setSelectedKeyDetail(null); }}
        aria-label="ホームへ戻る"
      >
        <img src="/image.png" alt="ゆーぺいくん" className="brand-mascot" />
        <div className="brand-text">
          <div className="brand-name">YUPEI MOBILE</div>
          <div className="brand-sub">雄飛祭実行委員会</div>
        </div>
      </button>
      <button className="icon-button top-bell" aria-label="通知"><Bell size={20}/></button>
    </header>

    <main>
      {page === "home" && <section className="page">
        <p className="eyebrow">WELCOME BACK</p><h1>ホーム</h1>
        <div className="hero-card"><div className="hero-label">NEXT EVENT</div><h2>雄飛祭 実行委員会全体会議</h2><p>次回の予定日時・場所が表示されます。</p></div>
        <div className="section-heading"><h3>最新のお知らせ</h3><span className="muted">一覧を表示 →</span></div>
        <div className="notice-card"><strong>資料共有のテスト運用について</strong><p>新しい資料共有画面の動作確認を実施中です。</p><small>サンプル通知</small></div>
        <h3 className="menu-title">メニュー</h3>
        <div className="menu-grid">
          {menuItems.map(([Icon,label,key]) => <button className="menu-tile" key={key} onClick={()=>setPage(key)}><Icon/><span>{label}</span></button>)}
          <button className="menu-tile" onClick={()=>setPage("lost")}><Search/><span>落とし物</span></button>
          <button className="menu-tile" onClick={()=>setPage("inquiry")}><MessageCircle/><span>問い合わせ</span></button>
          <button className="menu-tile" onClick={()=>setPage("admin")}><Settings/><span>管理者設定</span></button>
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
        <div className="list-heading"><div><h2>{section}</h2><small>{visibleDocs.length}件の資料</small></div><button className="primary small" onClick={()=>{setScope("全体公開");setTargetTeam("");setShowUpload(true);}}><Plus size={16}/> アップロード</button></div>
        <div className="searchbox"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ファイル名で検索"/></div>
        <div className="file-list">
          {visibleDocs.length === 0 ? <div className="empty">資料はまだ登録されていません。</div> : visibleDocs.map(doc=><button className="file-row" key={doc.id} onClick={()=>setSelected(doc)}>
            <div className="file-icon">{fileIcon(doc.name)}</div>
            <div className="file-info">
              <strong>{doc.name}</strong>
              <small>公開範囲: {doc.scope}{doc.targetTeam ? `（${doc.targetTeam}）` : ""} ・ {doc.owner} ・ 更新 {new Date(doc.updated).toLocaleDateString("ja-JP")}</small>
              {doc.note && <small className="file-note">{doc.note}</small>}
            </div>
            <span className="file-arrow">›</span>
          </button>)}
        </div>
      </section>}

      {page === "admin" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>管理者設定</h1>
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
          <strong>管理者機能（試作版）</strong>
          <p>データベース連携後に実際の権限・アカウント制御が有効になります。</p>
        </div>
      </section>}

      {page === "admin-permissions" && <section className="page">
        <button className="back-link" onClick={()=>setPage("admin")}><ChevronLeft size={17}/> 管理者設定</button>
        <p className="eyebrow">PERMISSION MANAGEMENT</p>
        <h1>権限管理</h1>
        <p className="muted">役職ごとの操作権限を設定します。</p>
        {permissionRoles.map(role => <div className="notice-card permission-card" key={role}>
          <div className="list-heading" style={{marginBottom: "10px"}}>
            <h2>{role}</h2>
          </div>
          <div className="permission-list">
            {permissionItems.map(([key, label]) => <label className="permission-row" key={key}>
              <input
                type="checkbox"
                checked={!!permissions[role]?.[key]}
                onChange={e => setPermissions(prev => ({
                  ...prev,
                  [role]: { ...prev[role], [key]: e.target.checked }
                }))}
              />
              <span className="permission-label">{label}</span>
            </label>)}
          </div>
        </div>)}
        <p className="fine-print">※現在は画面上の試作状態です。データベース導入時にサーバー側でも同じ権限チェックを適用します。</p>
      </section>}

      {page === "admin-members" && <section className="page">
        <button className="back-link" onClick={()=>setPage("admin")}><ChevronLeft size={17}/> 管理者設定</button>
        <p className="eyebrow">MEMBER MANAGEMENT</p>
        <h1>委員・アカウント管理</h1>
        <p className="muted">登録されている委員の一覧と所属・役職を管理します。</p>
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
        <p className="fine-print">※現在は試作用データです。データベース接続後に永続保存および招待メール送信が有効になります。</p>
      </section>}

      {page === "admin-structure" && <section className="page">
        <button className="back-link" onClick={()=>setPage("admin")}><ChevronLeft size={17}/> 管理者設定</button>
        <p className="eyebrow">ORGANIZATION SETTINGS</p>
        <h1>局・班の管理</h1>
        <p className="muted">委員会の局と、各局に所属する班を管理します。</p>

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
              if(members.some(m=>m.dept===dept)){alert("この局に所属する委員がいるため削除できません。先に委員の所属を変更してください。");return;}
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
              if(members.some(m=>m.dept===selectedDept && m.team===team)){alert("この班に所属する委員がいるため削除できません。先に委員の所属を変更してください。");return;}
              if(window.confirm(`${team}を削除しますか？`))setTeamsByDepartment(prev=>({...prev,[selectedDept]:(prev[selectedDept]||[]).filter(t=>t!==team)}));
            }}>削除</button>
          </div>)}
        </div>
        <p className="fine-print">※追加・変更した班は資料アップロード時の公開範囲にも自動反映されます。</p>
      </section>}

      {page === "keys" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">KEY MANAGEMENT</p>
        <h1>鍵管理</h1>
        <div className="notice-card" style={{marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: keys.filter(k => k.status === "貸出中").length > 0 ? "pointer" : "default"}} onClick={()=>{
          if (keys.filter(k => k.status === "貸出中").length > 0) setShowLentModal(true);
        }}>
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
        <p className="muted">鍵の保管・貸出状況の確認、および借受・返却・引き継ぎを行います。</p>

        <div className="list-heading">
          <div><h2>鍵一覧</h2><small>{keys.filter(k => k.name.toLowerCase().includes(keySearch.toLowerCase())).length}件の鍵</small></div>
          <button className="primary small" onClick={()=>setShowKeyAddModal(true)}><Plus size={16}/> 鍵を追加</button>
        </div>
        <div className="searchbox"><Search size={18}/><input value={keySearch} onChange={e=>setKeySearch(e.target.value)} placeholder="鍵の名前で検索（例：フリスペ、楓、暁月）"/></div>

        <div className="file-list">
          {keys.filter(k => k.name.toLowerCase().includes(keySearch.toLowerCase())).map(k => <div className="file-row" key={k.id} style={{alignItems: "center", cursor: "pointer"}} onClick={()=>setSelectedKeyDetail(k)}>
            <div className="file-icon"><KeyRound/></div>
            <div className="file-info">
              <strong>{k.name}</strong>
              <small>状態: <span style={{color: k.status === "保管中" ? "#2b6843" : "#a34343", fontWeight: 700}}>{k.status}</span></small>
              <small>{k.status === "貸出中" ? `所持者: ${k.holder}` : `保管場所: ${k.location}`}</small>
              <small style={{color: "#666", marginTop: "2px"}}>
                {k.history && k.history.length > 0
                  ? `最終操作: ${k.history[0].time} ${k.history[0].action}`
                  : "履歴なし（初期状態）"}
              </small>
            </div>
            <div style={{display: "flex", gap: "6px"}} onClick={e=>e.stopPropagation()}>
              {k.status === "保管中" ? (
                <button className="primary small" onClick={()=>{
                  if (!window.confirm(`「${k.name}」の鍵を借りますか？`)) return;
                  const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                  setKeys(prev => prev.map(item => item.id === k.id ? {
                    ...item,
                    status: "貸出中",
                    holder: "ログインユーザー",
                    location: "所持中",
                    history: [{time: nowStr, action: "借りる", user: "ログインユーザー"}, ...(item.history || [])]
                  } : item));
                }}>借りる</button>
              ) : (
                <>
                  <button className="secondary small" style={{border: "1px solid #dfe5ec", background: "white", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", fontWeight: 700, cursor: "pointer"}} onClick={()=>{
                    if (!window.confirm(`「${k.name}」の鍵を引き継ぎますか？`)) return;
                    const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                    setKeys(prev => prev.map(item => item.id === k.id ? {
                      ...item,
                      status: "貸出中",
                      holder: "ログインユーザー",
                      location: "所持中",
                      history: [{time: nowStr, action: "引き継ぐ", user: "ログインユーザー"}, ...(item.history || [])]
                    } : item));
                  }}>引き継ぐ</button>
                  <button className="primary small" style={{background: "#2b6843"}} onClick={()=>{
                    if (!window.confirm(`「${k.name}」の鍵を返却しますか？`)) return;
                    const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
                    setKeys(prev => prev.map(item => item.id === k.id ? {
                      ...item,
                      status: "保管中",
                      holder: "-",
                      location: "雄飛室・鍵ボックス",
                      history: [{time: nowStr, action: "返す", user: "ログインユーザー"}, ...(item.history || [])]
                    } : item));
                  }}>返す</button>
                </>
              )}
            </div>
          </div>)}
        </div>
        <p className="fine-print">※引き継ぎ時は操作した利用者が受取人となり、貸出中状態のまま所持者のみが更新されます。</p>
      </section>}

      {page !== "home" && page !== "documents" && page !== "admin" && page !== "admin-members" && page !== "admin-structure" && page !== "admin-permissions" && page !== "keys" && <section className="page">
        <button className="back-link" onClick={()=>setPage("home")}><ChevronLeft size={17}/> ホーム</button>
        <p className="eyebrow">YUPEI MOBILE</p><h1>{{calendar:"カレンダー",carts:"台車管理",lost:"落とし物",inquiry:"問い合わせ"}[page] || "機能"}</h1>
        <div className="placeholder"><ShieldCheck size={28}/><strong>未実装</strong><p>この機能は未実装です。</p></div>
      </section>}
    </main>

    {showMemberForm && <div className="modal-backdrop" onClick={()=>setShowMemberForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>委員を追加</h2><button className="icon-button" onClick={()=>setShowMemberForm(false)}><X/></button></div>
      <label className="field-label">氏名<input value={memberForm.name} onChange={e=>setMemberForm(v=>({...v,name:e.target.value}))} placeholder="例：山田 太郎"/></label>
      <label className="field-label">メールアドレス<input type="email" value={memberForm.email} onChange={e=>setMemberForm(v=>({...v,email:e.target.value}))} placeholder="例：member@example.com"/></label>
      <label className="field-label">所属局<select value={memberForm.dept} onChange={e=>setMemberForm(v=>({...v,dept:e.target.value,team:""}))}>{departments.map(d=><option key={d}>{d}</option>)}</select></label>
      <label className="field-label">班（任意）<input value={memberForm.team} onChange={e=>setMemberForm(v=>({...v,team:e.target.value}))} placeholder="例：広報班"/></label>
      <label className="field-label">役職<select value={memberForm.role} onChange={e=>setMemberForm(v=>({...v,role:e.target.value}))}>{["委員長","副委員長","監査","局長","局次","班長","委員","事務課"].map(r=><option key={r}>{r}</option>)}</select></label>
      <button className="primary full" disabled={!memberForm.name.trim() || !memberForm.email.trim()} onClick={()=>{
        setMembers(prev=>[...prev,{id:Date.now(),name:memberForm.name.trim(),email:memberForm.email.trim(),dept:memberForm.dept,team:memberForm.team.trim()||"未設定",role:memberForm.role,active:true}]);
        setMemberForm({name:"",email:"",dept:"運営管理局",team:"",role:"委員"});setShowMemberForm(false);
        alert("登録しました。");
      }}>登録</button>
      <p className="fine-print">※データベース接続後に永続保存および招待メール送信が有効になります。</p>
    </div></div>}

    {showUpload && <div className="modal-backdrop" onClick={()=>setShowUpload(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>資料をアップロード</h2><button className="icon-button" onClick={()=>setShowUpload(false)}><X/></button></div>
      <label className="upload-zone"><UploadCloud size={27}/><strong>{file ? file.name : "ファイルを選択"}</strong><small>基本的なファイル形式に対応しています</small><input type="file" onChange={e=>setFile(e.target.files?.[0] || null)}/></label>
      <label className="field-label">公開範囲（局）
        <select
          value={scope}
          onChange={e => {
            setScope(e.target.value);
            setTargetTeam("");
          }}
        >
          <option value="全体公開">全体公開</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>
      {availableTeamsForScope.length > 0 && (
        <label className="field-label">公開対象（班）
          <select value={targetTeam} onChange={e => setTargetTeam(e.target.value)}>
            <option value="">{scope} 全体</option>
            {availableTeamsForScope.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      )}
      <label className="field-label">説明・備考（任意）<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="資料についての説明"/></label>
      <button className="primary full" disabled={!file} onClick={upload}>登録</button>
      <p className="fine-print">※データベース連携後、サーバー側でも公開範囲に応じた閲覧権限を制御します。</p>
    </div></div>}

    {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><h2>資料の詳細</h2><button className="icon-button" onClick={()=>setSelected(null)}><X/></button></div>
      <div className="detail-file">
        <div className="file-icon large">{fileIcon(selected.name)}</div>
        <div>
          <strong>{selected.name}</strong>
          <small>{selected.dept} ・ {selected.scope}{selected.targetTeam ? `（${selected.targetTeam}）` : ""}</small>
        </div>
      </div>
      {selected.note && <p className="detail-note">{selected.note}</p>}
      <div className="detail-actions"><button className="primary" onClick={()=>downloadDoc(selected)}><Download size={17}/> ダウンロード</button><button className="danger-outline" onClick={()=>removeDoc(selected.id)}><Trash2 size={17}/> 削除</button></div>
      <h3 className="comments-title">コメント ({selected.comments.length})</h3>
      <div className="comments">{selected.comments.map((c,i)=><div className="comment" key={i}><p>{c}</p><small>ログインユーザー</small></div>)}</div>
      <div className="comment-entry"><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="コメントを入力"/><button className="primary" onClick={addComment} disabled={!comment.trim()}>送信</button></div>
      <p className="fine-print">※コメント通知は資料のアップロード者のみに送信される設計です。</p>
    </div></div>}

    {showLentModal && <div className="modal-backdrop" onClick={()=>setShowLentModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head">
        <h2>貸出中の鍵一覧</h2>
        <button className="icon-button" onClick={()=>setShowLentModal(false)}><X/></button>
      </div>
      <p className="muted">現在貸出中となっている鍵と所持者の情報です。</p>
      <div className="file-list" style={{maxHeight: "350px", overflowY: "auto", marginTop: "12px"}}>
        {keys.filter(k => k.status === "貸出中").length === 0 ? (
          <div className="empty">現在貸出中の鍵はありません。</div>
        ) : (
          keys.filter(k => k.status === "貸出中").map(k => (
            <div className="file-row" key={k.id} style={{flexDirection: "column", alignItems: "flex-start", gap: "4px"}}>
              <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                <strong>{k.name}</strong>
                <span style={{fontSize: "12px", color: "#a34343", fontWeight: 700}}>貸出中</span>
              </div>
              <small>所持者: <strong>{k.holder}</strong></small>
              {k.history && k.history.length > 0 && (
                <small style={{color: "#555"}}>直近の操作: {k.history[0].time} {k.history[0].action}</small>
              )}
            </div>
          ))
        )}
      </div>
      <button className="primary full" style={{marginTop: "16px"}} onClick={()=>setShowLentModal(false)}>閉じる</button>
    </div></div>}

    {selectedKeyDetail && <div className="modal-backdrop" onClick={()=>setSelectedKeyDetail(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head">
        <h2>{selectedKeyDetail.name} の詳細</h2>
        <button className="icon-button" onClick={()=>setSelectedKeyDetail(null)}><X/></button>
      </div>
      <div className="notice-card" style={{margin: "12px 0"}}>
        <p style={{margin: 0}}>状態: <strong style={{color: selectedKeyDetail.status === "保管中" ? "#2b6843" : "#a34343"}}>{selectedKeyDetail.status}</strong></p>
        <p style={{margin: "4px 0 0"}}>所持者 / 保管場所: <strong>{selectedKeyDetail.status === "貸出中" ? selectedKeyDetail.holder : selectedKeyDetail.location}</strong></p>
      </div>
      <h3 style={{fontSize: "14px", margin: "16px 0 8px"}}>操作履歴（日時・アクション）</h3>
      <div className="file-list" style={{maxHeight: "250px", overflowY: "auto"}}>
        {!selectedKeyDetail.history || selectedKeyDetail.history.length === 0 ? (
          <div className="empty">操作履歴はありません。</div>
        ) : (
          selectedKeyDetail.history.map((h, i) => (
            <div className="file-row" key={i} style={{padding: "8px 12px"}}>
              <div className="file-icon"><KeyRound size={16}/></div>
              <div className="file-info">
                <strong>{h.action}</strong>
                <small>{h.time} ・ {h.user}</small>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="primary full" style={{marginTop: "16px"}} onClick={()=>setSelectedKeyDetail(null)}>閉じる</button>
    </div></div>}

    {showKeyAddModal && <div className="modal-backdrop" onClick={()=>setShowKeyAddModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div className="modal-head">
        <h2>新しい鍵を追加</h2>
        <button className="icon-button" onClick={()=>setShowKeyAddModal(false)}><X/></button>
      </div>
      <label className="field-label">鍵の名前<input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} placeholder="例：理科室前倉庫の鍵"/></label>
      <label className="field-label">保管場所<input value={newKeyLocation} onChange={e=>setNewKeyLocation(e.target.value)} placeholder="例：雄飛室・鍵ボックス"/></label>
      <button className="primary full" disabled={!newKeyName.trim()} onClick={()=>{
        const name = newKeyName.trim();
        const nowStr = new Date().toLocaleString("ja-JP", {month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
        setKeys(prev => [
          {
            id: Date.now(),
            name,
            status: "保管中",
            holder: "-",
            location: newKeyLocation.trim() || "雄飛室・鍵ボックス",
            history: [{time: nowStr, action: "登録", user: "ログインユーザー"}]
          },
          ...prev
        ]);
        setNewKeyName("");
        setNewKeyLocation("雄飛室・鍵ボックス");
        setShowKeyAddModal(false);
        alert("保存しました。");
      }}>登録</button>
      <p className="fine-print">※登録した鍵は鍵一覧に即座に反映されます。</p>
    </div></div>}
  </div>;
}
