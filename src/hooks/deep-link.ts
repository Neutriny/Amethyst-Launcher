import micromatch from "micromatch";
import { useEffect, useRef } from "react";

const ARCMC_LINK_PREFIX = "arcmc://";
const EMIT_DEEPLINK_EVENT = "deeplink:emit";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

type TriggerRule = string | string[] | RegExp | ((subpath: string) => boolean);

interface UseDeepLinkOptions {
  trigger: TriggerRule;
  onCall: (path: string, subpath: string) => void;
}

// Do not use openUrl so this helper can be used during development.
export const emitDeepLink = (urls: string[]) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<string[]>(EMIT_DEEPLINK_EVENT, {
      detail: urls,
    })
  );
};

export const useDeepLink = ({ trigger, onCall }: UseDeepLinkOptions) => {
  const didInit = useRef(false);
  const unlistenRef = useRef<() => void>();

  useEffect(() => {
    if (!isTauri) return;

    function matchSubpath(path: string, rule: TriggerRule): boolean {
      if (typeof rule === "string" || Array.isArray(rule)) {
        return micromatch.isMatch(path, rule);
      } else if (rule instanceof RegExp) {
        return rule.test(path);
      } else if (typeof rule === "function") {
        return rule(path);
      }
      return false;
    }

    const handleUrls = (urls: string[]) => {
      urls.forEach((url) => {
        if (url.startsWith(ARCMC_LINK_PREFIX)) {
          const subpath = url.slice(ARCMC_LINK_PREFIX.length);
          if (matchSubpath(subpath, trigger)) {
            onCall(url, subpath);
          }
        }
      });
    };

    const handleDevUrls = (event: Event) => {
      const customEvent = event as CustomEvent<string[]>;
      handleUrls(customEvent.detail || []);
    };

    const setup = async () => {
      const { getCurrent, onOpenUrl } =
        await import("@tauri-apps/plugin-deep-link");

      if (!didInit.current) {
        didInit.current = true;

        try {
          const currentUrls = await getCurrent();
          if (currentUrls) {
            handleUrls(currentUrls);
          }
        } catch (err) {
          logger.error("getCurrent failed:", err);
        }
      }

      try {
        unlistenRef.current = await onOpenUrl(handleUrls);
      } catch (err) {
        logger.error("Failed to listen to deep links:", err);
      }
    };

    window.addEventListener(EMIT_DEEPLINK_EVENT, handleDevUrls);
    setup();

    return () => {
      window.removeEventListener(EMIT_DEEPLINK_EVENT, handleDevUrls);
      if (unlistenRef.current) {
        unlistenRef.current();
      }
    };
  }, [trigger, onCall]);
};

export default useDeepLink;
