import {
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from "@chakra-ui/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuExternalLink } from "react-icons/lu";
import { MenuSelector } from "@/components/common/menu-selector";
import { useLauncherConfig } from "@/contexts/config";

type VendorKey = "temurin" | "microsoft" | "zulu";
const DEFAULT_VENDOR: VendorKey = "temurin";
const DEFAULT_VERSION = "25" as const;
const DEFAULT_TYPE = "jre" as const;

interface JavaVendor {
  label: string;
  hasJre: boolean;
  archMap: Record<string, string>;
  versions?: string[];
  getUrl: (params: {
    version: string;
    os: string;
    archParam: string;
    type: "jdk" | "jre";
  }) => string;
}

const buildDownloadUrl = (baseUrl: string, params: Record<string, string>) => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
};

export const DownloadJavaModal: React.FC<Omit<ModalProps, "children">> = ({
  ...props
}) => {
  const { t } = useTranslation();
  const { config } = useLauncherConfig();
  const primaryColor = config.appearance.theme.primaryColor;
  const os = config.basicInfo.osType;
  const arch = config.basicInfo.arch;

  const [vendor, setVendor] = useState<VendorKey | "">(DEFAULT_VENDOR);
  const [version, setVersion] = useState<"" | "8" | "11" | "17" | "21" | "25">(
    DEFAULT_VERSION
  );
  const [type, setType] = useState<"" | "jdk" | "jre">(DEFAULT_TYPE);

  const VENDORS: Record<VendorKey, JavaVendor> = {
    temurin: {
      label: "Temurin",
      hasJre: true,
      archMap: { x86_64: "x64", aarch64: "aarch64" },
      versions: ["8", "11", "17", "21", "25"],
      getUrl: ({ version, os, archParam, type }) => {
        const osMap: Record<string, string> = {
          windows: "windows",
          linux: "linux",
          macos: "mac",
        };
        const pkg = type === "jre" ? "jre" : "jdk";
        return `https://api.adoptium.net/v3/binary/latest/${version}/ga/${osMap[os]}/${archParam}/${pkg}/eclipse/hotspot/normal/eclipse?project=jdk`;
      },
    },
    microsoft: {
      label: "Microsoft",
      hasJre: false,
      archMap: { x86_64: "x64", aarch64: "aarch64" },
      versions: ["11", "17", "21"],
      getUrl: ({ version, os }) => {
        const osMap: Record<string, string> = {
          windows: "windows",
          linux: "linux",
          macos: "macOS",
        };
        return `https://learn.microsoft.com/zh-cn/java/openjdk/download#openjdk-${version}`;
      },
    },
    zulu: {
      label: "Zulu",
      hasJre: true,
      archMap: {
        x86_64: "x86-64-bit",
        aarch64: "arm-64-bit",
      },
      getUrl: ({ version, os, archParam, type }) => {
        return (
          buildDownloadUrl("https://www.azul.com/downloads/", {
            version: `java-${version}-lts`,
            os,
            architecture: archParam,
            package: type,
            "show-old-builds": "true",
          }) + "#zulu"
        );
      },
    },
  };

  useEffect(() => {
    if (!props.isOpen) return;
    setVendor(DEFAULT_VENDOR);
    setVersion(DEFAULT_VERSION);
    setType(DEFAULT_TYPE);
  }, [props.isOpen]);

  const handleConfirm = async () => {
    if (!vendor || !version || !type) return;

    const selectedVendor = VENDORS[vendor as VendorKey];
    const archParam = selectedVendor.archMap[arch] || "";
    const url = selectedVendor.getUrl({
      version,
      os,
      archParam,
      type: type as "jdk" | "jre",
    });
    await openUrl(url);
    props.onClose?.();
  };

  return (
    <Modal
      size={{ base: "sm", lg: "md" }}
      returnFocusOnClose={false}
      {...props}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("DownloadJavaModal.header.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch">
            <Grid templateColumns="1fr 1fr 1fr" gap={4} w="100%">
              <MenuSelector
                options={Object.entries(VENDORS).map(([key, val]) => ({
                  value: key,
                  label: val.label,
                }))}
                value={vendor}
                onSelect={(val) => {
                  const selected = val as VendorKey;
                  if (!VENDORS[selected].hasJre && type === "jre") {
                    setType("jdk");
                  }
                  if (
                    VENDORS[selected]?.versions &&
                    !VENDORS[selected].versions.includes(version)
                  ) {
                    setVersion("");
                  }
                  setVendor(selected);
                }}
                placeholder={t("DownloadJavaModal.selector.vendor")}
                size="sm"
                fontSize="sm"
              />

              <MenuSelector
                options={
                  VENDORS[vendor as VendorKey]?.versions || [
                    "8",
                    "11",
                    "17",
                    "21",
                    "25",
                  ]
                }
                value={version}
                onSelect={(val) => setVersion(val as typeof version)}
                placeholder={t("DownloadJavaModal.selector.version")}
                size="sm"
                fontSize="sm"
              />

              <MenuSelector
                options={[
                  { value: "jdk", label: "JDK" },
                  ...(vendor && VENDORS[vendor as VendorKey]?.hasJre
                    ? [{ value: "jre", label: "JRE" }]
                    : []),
                ]}
                disabled={false}
                value={type}
                onSelect={(val) => setType(val as typeof type)}
                placeholder={t("DownloadJavaModal.selector.type")}
                size="sm"
                fontSize="sm"
              />
            </Grid>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={props.onClose}>
            {t("General.cancel")}
          </Button>
          <Button
            colorScheme={primaryColor}
            rightIcon={<LuExternalLink />}
            isDisabled={!(vendor && version && type)}
            onClick={handleConfirm}
          >
            {t("General.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
