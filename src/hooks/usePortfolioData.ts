import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteContent = (section: string) =>
  useQuery({
    queryKey: ["site_content", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", section);
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((row: any) => { map[row.key] = row.value; });
      return map;
    },
  });

export const useEducation = () =>
  useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useSkillCategories = () =>
  useQuery({
    queryKey: ["skill_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*, skills(*)")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useCertifications = () =>
  useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useInternships = () =>
  useQuery({
    queryKey: ["internships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useAchievements = () =>
  useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useIdeas = () =>
  useQuery({
    queryKey: ["ideas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useGoals = () =>
  useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

export const useContactMessages = () =>
  useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
