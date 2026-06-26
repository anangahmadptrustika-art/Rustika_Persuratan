import {
  FileText,
  FileSignature,
  BookOpen,
  FileCheck2,
  Info,
} from "lucide-react";

export const JENIS_ICONS = {
  FileText,
  FileSignature,
  BookOpen,
  FileCheck2,
  Info,
};

export function resolveJenisIcon(name) {
  return JENIS_ICONS[name] || FileText;
}
