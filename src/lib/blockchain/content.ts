import {
  sha256Record,
  sha256Url,
} from "./hash";

export type VerifiableType = "certificate" | "resume" | "achievement" | "project";

export interface ContentProof {
  hash: string;
  /** "file" = the actual document bytes were hashed, "metadata" = the record content. */
  source: "file" | "metadata";
  label: string;
}

/**
 * Canonical content proof for each verifiable entity. The SAME function is used
 * by the admin when registering and by visitors when verifying, so any later
 * edit to the underlying file or record produces a different hash.
 */
export const buildContentProof = async (
  type: VerifiableType,
  entity: Record<string, unknown>,
): Promise<ContentProof> => {
  if (type === "certificate" || type === "achievement") {
    const fileUrl = entity.file_url as string | undefined;
    if (fileUrl) {
      return { hash: await sha256Url(fileUrl), source: "file", label: "Certificate document" };
    }
    return {
      hash: await sha256Record(
        type === "certificate"
          ? {
              title: entity.title,
              issuer: entity.issuer,
              year: entity.year,
              description: entity.description,
              skills: entity.skills,
            }
          : {
              title: entity.title,
              label: entity.label,
              description: entity.description,
              details: entity.details,
              team: entity.team,
            },
      ),
      source: "metadata",
      label: "Record metadata",
    };
  }

  if (type === "resume") {
    const url = entity.url as string;
    return { hash: await sha256Url(url), source: "file", label: "Resume document" };
  }

  return {
    hash: await sha256Record({
      title: entity.title,
      description: entity.description,
      full_description: entity.full_description,
      tags: entity.tags,
      team: entity.team,
      challenges: entity.challenges,
      outcome: entity.outcome,
      github_link: entity.github_link,
      demo_link: entity.demo_link,
    }),
    source: "metadata",
    label: "Project snapshot",
  };
};

export const RECORD_TYPE_LABEL: Record<VerifiableType, string> = {
  certificate: "Certificate",
  resume: "Resume",
  achievement: "Achievement",
  project: "Project Version",
};

export const TIMELINE_EVENT_LABEL: Record<VerifiableType, string> = {
  certificate: "Certificate Added",
  resume: "Resume Updated",
  achievement: "Achievement Verified",
  project: "Project Updated",
};
