import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  CalendarDays,
  Fingerprint,
  Shield,
  ShieldCheck,
  XCircle,
  Zap,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import TextLogo from "@/components/common/text-logo";

export default function CertificateVerificationPage() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!certificateId) return;

    let isMounted = true;

    const fetchVerification = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/public/verify-certificate/${certificateId}`);

        if (!isMounted) return;
        if (response.data.success) {
          setVerification(response.data.data);
        } else {
          setError(response.data.message || "Certificate not found");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to verify certificate");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVerification();

    return () => {
      isMounted = false;
    };
  }, [certificateId]);

  const issueDate = verification?.issueDate || verification?.approvedAt || verification?.createdAt;

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 grid-bg opacity-[0.05]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="flex justify-center mb-12">
            <TextLogo />
          </div>
          <Card className="glass-card border-white/5 bg-white/[0.01] backdrop-blur-xl">
            <CardContent className="py-20 flex flex-col items-center space-y-10">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-t-2 border-r-2 border-blue-500"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-blue-400/50" />
                </span>
                <div className="absolute -inset-8 bg-blue-500/10 blur-3xl rounded-full" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Authenticating...</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Secure verification in progress</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#050505]">
        <div className="absolute inset-0 grid-bg opacity-[1.05]" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="flex justify-center mb-10">
            <TextLogo />
          </div>
          <Card className="glass-card border-red-500/10 bg-red-500/[0.01]">
            <CardHeader className="flex flex-col items-center text-center space-y-6 pt-12">
              <div className="w-24 h-24 rounded-full bg-red-500/5 flex items-center justify-center border border-red-500/10">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <div className="space-y-3">
                <CardTitle className="text-4xl font-black text-white italic tracking-tighter uppercase">Invalid Credential</CardTitle>
                <p className="text-red-400/60 font-black uppercase text-[10px] tracking-widest leading-relaxed">
                   The provided certificate identifier could not be verified.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-white text-black hover:bg-gray-200 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
                Return to Safety
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-200 overflow-x-hidden selection:bg-blue-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-24 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-10"
        >
          <TextLogo />
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-end gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Verification Active
              </p>
              <p className="text-[9px] text-gray-600 uppercase font-bold mt-1 tracking-tight">Sync ID: {certificateId?.slice(0, 12)}...</p>
            </div>
            <div className="w-px h-10 bg-white/5 hidden sm:block" />
            <ShieldCheck className="w-10 h-10 text-emerald-400/80" />
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-8"
          >
            <Card className="glass-card border-white/5 bg-white/[0.01] overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <CardContent className="p-8 sm:p-12 space-y-12">
                <div className="flex flex-col items-center text-center space-y-8">
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400"
                    >
                       <Award className="w-3 h-3" />
                       <span className="text-[10px] font-black uppercase tracking-widest leading-none">Verified Achievement</span>
                    </motion.div>
                    <h1 className="text-4xl sm:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                      {verification?.studentName}
                    </h1>
                    <p className="text-sm sm:text-lg text-gray-500 font-medium tracking-tight">
                      Has successfully completed the prescribed track under the accreditation of <span className="text-white">Nexora Learn</span>
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 w-full pt-8">
                    <InfoTile
                      icon={Award}
                      label="Certificate ID"
                      value={verification?.certificateId}
                    />
                     <InfoTile
                      icon={CalendarDays}
                      label="Issuance Date"
                      value={issueDate ? new Date(issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                    />
                    <InfoTile
                      icon={BookOpen}
                      label="Technical Domain"
                      value={verification?.courseTitle}
                      highlight={verification?.grade ? `Performance Index: ${verification.grade}` : null}
                    />
                    <InfoTile
                      icon={ShieldCheck}
                      label="Verification State"
                      value={verification?.revoked ? "REVOKED" : "AUTHENTIC"}
                      accent={verification?.revoked ? "text-red-500" : "text-emerald-400"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-6"
          >
            <Card className="glass-card border-white/5 bg-white/[0.01] h-full">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                   <Fingerprint className="w-4 h-4 text-blue-500" />
                   Security Meta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <MetaRow
                  icon={Fingerprint}
                  label="Registry ID"
                  value={verification?.customStudentId || verification?.studentId || "UNASSIGNED"}
                />
                <MetaRow
                  icon={Shield}
                  label="Accreditation"
                  value={verification?.issuedBy || "NEXORA_LEARN_CORE"}
                />
                <div className="rounded-3xl border border-blue-500/10 bg-blue-500/[0.02] p-6 space-y-4">
                  <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                     <Zap className="w-3 h-3" /> Ledger Note
                  </h5>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight italic">
                    This digital credential utilizes cryptographic hashing to ensure absolute data integrity. Valid only when synchronized with live Nexora Learn registers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5"
        >
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 italic">
               © {new Date().getFullYear()} Nexora Learn Global Accreditation.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="border-white/5 text-gray-500 hover:bg-white/5 h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[9px]"
            >
              Export Report
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="bg-white text-black hover:bg-gray-200 h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[9px]"
            >
              Close Link
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, highlight }) {
  if (!value) return null;
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.015] p-8 space-y-4 hover:bg-white/[0.025] transition-all duration-300">
      <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
        <Icon className="w-4 h-4 text-blue-500/80" />
        <span>{label}</span>
      </div>
      <div className="space-y-1">
         <p className="text-xl font-black text-white italic tracking-tight uppercase">{value}</p>
         {highlight && (
           <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-blue-500/40" />
              {highlight}
           </p>
         )}
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-5 border border-white/5 rounded-3xl p-5 bg-white/[0.02] group transition-all duration-300 hover:border-white/10">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-blue-500/10 transition-colors">
        <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-700 mb-1">{label}</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight group-hover:text-white transition-colors">{value}</p>
      </div>
    </div>
  );
}

InfoTile.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  highlight: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

MetaRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};
