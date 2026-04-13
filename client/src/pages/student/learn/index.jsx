import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  MessageCircle, 
  Zap, 
  Send, 
  X, 
  Trash2, 
  CheckCircle, 
  Download, 
  Award, 
  LayoutDashboard, 
  PlayCircle, 
  Info, 
  ChevronRight,
  ShieldCheck,
  Video,
  FileText,
  Layers
} from "lucide-react";
import { 
  fetchStudentViewCourseDetailsService, 
  downloadCertificateService, 
  checkCertificateEligibilityService, 
  getCurrentCourseProgressService,
  requestCertificateService,
} from "@/services";
import { useAuth } from "@/context/auth-context";
import { useSocket } from "@/context/socket-context";

function LearnPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const { auth } = useAuth();
  const { socket, connected } = useSocket();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [course, setCourse] = useState(null);
  const [eligible, setEligible] = useState({ requested: false, approved: false, rejected: false });
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [progress, setProgress] = useState(null);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const res = await fetchStudentViewCourseDetailsService(id);
      if (res?.success) setCourse(res.data);
    }
    load();
  }, [id]);

  useEffect(() => {
    async function checkEligibility() {
      try {
        setEligibilityChecked(false);
        if (!id || !auth?.user?._id) return;
        const res = await checkCertificateEligibilityService(id, auth.user._id);
        if (res?.success) {
          setEligible(res.data);
        }
      } finally {
        setEligibilityChecked(true);
      }
    }
    checkEligibility();
  }, [id, auth?.user?._id]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        if (!id || !auth?.user?._id) return;
        const res = await getCurrentCourseProgressService(auth.user._id, id);
        if (res?.success) setProgress(res.data);
      } finally {
        setProgressLoaded(true);
      }
    }
    fetchProgress();
  }, [id, auth?.user?._id]);


  // Internship task APIs removed – assignments tab now focuses on quizzes only.



  const menuItems = useMemo(() => ([
    { key: "overview", label: "Overview", icon: Info, color: "blue" },
    { key: "recorded", label: "Recorded videos", icon: PlayCircle, color: "blue" },
    { key: "certificate", label: "Certificate", icon: Award, color: "purple" },
  ]), []);

  async function handleDownloadCertificate() {
    try {
      setDownloading(true);
      const res = await downloadCertificateService(auth?.user?._id, id);
      if (res.status === 200) {
        const contentType = res.headers?.["content-type"] || "";
        const isPdf = contentType.includes("application/pdf");
        const blob = new Blob([res.data], { type: isPdf ? "application/pdf" : contentType || "application/octet-stream" });
        if (!isPdf) {
          const text = await blob.text();
          try {
            const data = JSON.parse(text);
            alert(data?.message || "Certificate not available yet.");
            return;
          } catch {
            alert("Certificate not available yet.");
            return;
          }
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate_${course?.title || "course"}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      }
    } finally {
      setDownloading(false);
    }
  }

  async function handleRequestCertificate() {
    try {
      setRequesting(true);
      const res = await requestCertificateService({ courseId: id, studentId: auth?.user?._id });
      if (res?.success) {
        setEligible(prev => ({ ...prev, requested: true }));
        alert("Certificate request submitted! Please wait for instructor approval.");
      }
    } finally {
      setRequesting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#f0f9ff] selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse italic" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/5 to-transparent shadow-[0_0_20px_blue]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
              <div>
                <h1 className="text-xl font-bold tracking-tight line-clamp-1">
                  {course?.title || "Course Dashboard"}
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 leading-none mt-1">
                  Student Learning Portal
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl h-10 px-6 font-bold transition-all text-xs uppercase tracking-widest"
            >
              Exit Dashboard
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-4 lg:p-8 gap-8">
          {/* Dashboard Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="p-3 bg-white/[0.03] border border-white/5 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
              <div className="px-6 py-4 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60">Terminal Navigator</p>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const active = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.8rem] transition-all duration-500 group relative overflow-hidden ${
                        active 
                          ? 'bg-blue-600 text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)]' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className={`relative z-10 flex items-center gap-4 w-full`}>
                        <Icon className={`w-5 h-5 transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'group-hover:scale-110 group-hover:text-blue-400'}`} />
                        <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                        {active && <ChevronRight className="w-5 h-5 ml-auto" />}
                      </div>
                      {/* Hover Backdrop */}
                      {!active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Elite Status Card */}
            <div className="relative p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5 rounded-[2.5rem] overflow-hidden group/status">
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 blur-2xl rounded-full" />
               <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Stream Status</span>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                       <span className="text-[10px] font-black text-emerald-500 uppercase">Live</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-white leading-tight">Active Learning Session</h4>
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl">
                     <ShieldCheck className="w-4 h-4 text-emerald-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Node Secure Verified</span>
                  </div>
               </div>
            </div>
          </aside>

          {/* Dynamic Content Frame */}
          <main className="flex-1 w-full animate-in fade-in slide-in-from-right-8 duration-700">
            {/* Global Progress Header */}
            {progressLoaded && (
               <div className="mb-8 p-8 bg-[#050e24] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 transition-all duration-1000 group-hover:bg-blue-600/10" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-2xl font-black text-white tracking-tight">Your Course Progress</h3>
                      <p className="text-slate-500 text-sm font-medium">Continue where you left off and finish the tracks.</p>
                    </div>
                    
                    <div className="flex items-center gap-8 pr-4">
                       <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Completion</p>
                          <div className="relative w-20 h-20 flex items-center justify-center">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="34" cx="40" cy="40" />
                                <circle 
                                  className="text-blue-500 transition-all duration-1000" 
                                  strokeWidth="6" 
                                  strokeDasharray={2 * Math.PI * 34} 
                                  strokeDashoffset={2 * Math.PI * 34 * (1 - (progress?.completed ? 1 : (progress?.progress?.filter(p=>p.viewed).length / (course?.curriculum?.length || 1))))} 
                                  strokeLinecap="round" 
                                  stroke="currentColor" 
                                  fill="transparent" 
                                  r="34" cx="40" cy="40" 
                                />
                             </svg>
                             <span className="absolute text-sm font-black text-white">
                                {progress?.completed ? '100%' : Math.round((progress?.progress?.filter(p=>p.viewed).length / (course?.curriculum?.length || 1)) * 100) + '%'}
                             </span>
                          </div>
                       </div>

                       <div className="h-12 w-[1px] bg-white/5 hidden sm:block" />

                       <div className="hidden sm:block">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Next Milestone</p>
                          <Button 
                            onClick={() => navigate(`/course-progress/${id}`)}
                            className="bg-blue-600 hover:bg-blue-500 h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20"
                          >
                            Resume Learning
                          </Button>
                       </div>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* What you'll learn */}
                <Card className="border border-white/10 bg-[#020617] rounded-2xl">
                  <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-white uppercase tracking-wide">What you'll learn</CardTitle>
                        <p className="text-slate-400 text-xs mt-0.5">Core competencies and industry expectations</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course?.objectives
                        ?.split(",")
                        .map((objective, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <CheckCircle className="w-4 h-4 text-emerald-500/80 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-sm leading-relaxed">{objective}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Brochure */}
                {course?.brochureUrl && (
                  <Card className="border border-white/10 bg-[#020617] rounded-2xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                          <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-white uppercase tracking-wide">Course brochure</CardTitle>
                          <p className="text-slate-400 text-xs mt-0.5">Download the detailed syllabus and program outline as a PDF.</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {course.brochureFileName || "course-brochure.pdf"}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">PDF file • opens in a new tab</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            let url = course.brochureUrl;
                            if (url && url.startsWith('http://')) url = url.replace('http://', 'https://');
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View brochure</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            let url = course.brochureUrl;
                            if (!url) return;

                            // Ensure HTTPS 
                            if (url.startsWith('http://')) {
                              url = url.replace('http://', 'https://');
                            }

                            if (url.includes('/upload/') && !url.includes('/upload/fl_attachment/')) {
                              url = url.replace('/upload/', '/upload/fl_attachment/');
                            }
                            const link = document.createElement("a");
                            link.href = url;
                            link.target = "_self";
                            link.download = course.brochureFileName || "course-brochure.pdf";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Course Syllabus / Overview */}
                <Card className="border border-white/10 bg-[#020617] rounded-2xl">
                  <CardHeader className="border-b border-white/5 pb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                          <Layers className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-white uppercase tracking-wide">Course Syllabus</CardTitle>
                          <p className="text-slate-400 text-xs mt-0.5">A comprehensive deep dive into the subject matter</p>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {course?.description ||
                        "No description has been added for this course yet."}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-white/10 bg-[#020617] rounded-2xl">
                    <CardContent className="flex items-center justify-between py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase">
                            Modules
                          </p>
                          <p className="text-lg font-semibold text-white">
                            {course?.curriculum?.length || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/10 bg-[#020617] rounded-2xl">
                    <CardContent className="flex items-center justify-between py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                          <Video className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase">
                            Format
                          </p>
                          <p className="text-lg font-semibold text-white">
                            Recorded sessions
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}



            {activeTab === "recorded" && (
              <Card className="border border-white/10 bg-[#020617] rounded-2xl">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Recorded videos
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-1">
                      Modules and lectures
                    </p>
                  </div>
                  <Button onClick={() => navigate(`/course-progress/${id}`)}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Launch course player
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.isArray(course?.curriculum) &&
                  course.curriculum.length > 0 ? (
                    course.curriculum.map((lec, idx) => {
                      const isViewed = progress?.progress?.some(p => p.lectureId === lec._id && p.viewed);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => navigate(`/course-progress/${id}`)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                            isViewed 
                              ? "bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10" 
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                              isViewed ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-600/20 text-blue-300"
                            }`}>
                              {isViewed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span className={`truncate text-sm ${isViewed ? "text-emerald-50/80" : "text-slate-100"}`}>
                              {lec.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {isViewed && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 hidden sm:block">Viewed</span>
                            )}
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-400">
                      No recorded content is available for this course yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "certificate" && (
              <Card className="border border-white/10 bg-[#020617] rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <Award className="w-5 h-5 text-blue-400" />
                    Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Once you complete this course and meet the eligibility
                    criteria, you can download your completion certificate as a
                    PDF.
                  </p>

                  {!progressLoaded ? (
                    <p className="text-sm text-slate-400">
                      Loading your learning progress…
                    </p>
                  ) : !progress?.completed ? (
                    <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-500">Course Incomplete</p>
                        <p className="text-xs text-amber-500/70 mt-1">You must complete 100% of the lessons to unlock your certificate. Keep going!</p>
                      </div>
                    </div>
                  ) : !eligibilityChecked ? (
                    <p className="text-sm text-slate-400">
                      Checking your certificate status…
                    </p>
                  ) : !eligible?.requested ? (
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-400">Excellent Work! 🎉</p>
                        <p className="text-xs text-blue-400/70 mt-1">You've completed all modules. Please request your certificate for instructor approval.</p>
                      </div>
                    </div>
                  ) : eligible?.approved ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-500">Certificate Approved! 🏅</p>
                        <p className="text-xs text-emerald-500/70 mt-1">Congratulations! Your certificate has been approved. You can now download it.</p>
                      </div>
                    </div>
                  ) : eligible?.rejected ? (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <X className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-500">Request Rejected</p>
                        <p className="text-xs text-red-500/70 mt-1">Your certificate request was rejected. Please contact your instructor for details.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-400">Request Pending</p>
                        <p className="text-xs text-blue-400/70 mt-1">Your request is waiting for instructor approval. This usually takes 24-48 hours.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {!eligible?.requested ? (
                    <Button
                      onClick={handleRequestCertificate}
                      disabled={!progress?.completed || requesting}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500"
                    >
                      {requesting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Requesting…</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>Request Certificate</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDownloadCertificate}
                      disabled={!eligible?.approved || downloading}
                      className="flex items-center gap-2"
                    >
                      {downloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-400/40 border-t-blue-400 rounded-full animate-spin" />
                          <span>Downloading…</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{eligible?.approved ? "Download certificate" : "Wait for Approval"}</span>
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default LearnPage;

