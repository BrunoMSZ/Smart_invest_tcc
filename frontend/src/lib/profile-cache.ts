import type { UserProfile } from "@/lib/api";

const PROFILE_CACHE_KEY = "smartinvest_profile_cache";
const AVATAR_CACHE_KEY = "smartinvest_avatar_cache";
export const PROFILE_UPDATED_EVENT = "smartinvest:profile-updated";

/** Fallback em memória quando o localStorage não aguenta data URL grande */
let memoryAvatar: string | null = null;
let memoryProfile: UserProfile | null = null;

export function getMemoryAvatar(): string | null {
  return memoryAvatar;
}

function stripAvatar(profile: UserProfile): UserProfile {
  const { avatar_url: _ignored, ...rest } = profile;
  return rest;
}

export function readCachedProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UserProfile) : null;
    const avatar =
      memoryAvatar ||
      localStorage.getItem(AVATAR_CACHE_KEY) ||
      parsed?.avatar_url ||
      null;
    if (parsed) {
      return avatar ? { ...parsed, avatar_url: avatar } : parsed;
    }
    if (memoryProfile) {
      return avatar ? { ...memoryProfile, avatar_url: avatar } : memoryProfile;
    }
    return avatar ? ({ name: "Investidor", avatar_url: avatar } as UserProfile) : null;
  } catch {
    if (memoryProfile) {
      return memoryAvatar
        ? { ...memoryProfile, avatar_url: memoryAvatar }
        : memoryProfile;
    }
    return null;
  }
}

export function cacheAvatarAlone(dataUrl: string | null | undefined) {
  if (typeof window === "undefined") return;
  memoryAvatar = dataUrl || null;
  try {
    if (dataUrl) localStorage.setItem(AVATAR_CACHE_KEY, dataUrl);
    else localStorage.removeItem(AVATAR_CACHE_KEY);
  } catch {
    // Quota: mantém só em memória — o chat ainda enxerga via event/memory
  }
}

export function writeCachedProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  memoryProfile = profile;
  if (profile.avatar_url) {
    cacheAvatarAlone(profile.avatar_url);
  }

  const forEvent: UserProfile = {
    ...profile,
    avatar_url: profile.avatar_url || memoryAvatar,
  };

  try {
    // Perfil sem data URL pesada; avatar fica em chave separada / memória
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(stripAvatar(profile)));
  } catch {
    try {
      localStorage.setItem(
        PROFILE_CACHE_KEY,
        JSON.stringify({
          name: profile.name,
          initials: profile.initials,
          bio: profile.bio,
        }),
      );
    } catch {
      /* ignore */
    }
  }

  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, { detail: forEvent }),
  );
}

export function mergeAvatarFromCache(profile: UserProfile): UserProfile {
  if (profile.avatar_url) {
    memoryAvatar = profile.avatar_url;
    return profile;
  }
  if (typeof window === "undefined") {
    return memoryAvatar ? { ...profile, avatar_url: memoryAvatar } : profile;
  }
  const cachedAvatar =
    memoryAvatar || localStorage.getItem(AVATAR_CACHE_KEY) || null;
  if (cachedAvatar) return { ...profile, avatar_url: cachedAvatar };
  const cached = readCachedProfile();
  if (cached?.avatar_url) return { ...profile, avatar_url: cached.avatar_url };
  return profile;
}
