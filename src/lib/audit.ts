import { supabase } from "@/integrations/supabase/client";

export interface AuditPayload {
  action: string;
  status?: string;
  entity?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
}

/**
 * Fire-and-forget audit trail entry. The backend attaches timestamp, IP address,
 * user agent, request id and the authenticated user (when signed in).
 */
export const logAudit = (payload: AuditPayload) => {
  void supabase.functions
    .invoke("audit-log", { body: payload })
    .catch(() => {
      /* auditing must never break a user action */
    });
};
