import {
  Box,
  Icon,
  Input,
  NumberInput,
  NumberInputField,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuSparkles, LuWifi } from "react-icons/lu";
import { CommonIconButton } from "@/components/common/common-icon-button";
import {
  OptionItemGroup,
  OptionItemGroupProps,
} from "@/components/common/option-item";
import { useLauncherConfig } from "@/contexts/config";
import { IntelligenceService } from "@/services/intelligence";

const IntelligenceSettingsPage = () => {
  const { t } = useTranslation();
  const { config, update } = useLauncherConfig();
  const primaryColor = config.appearance.theme.primaryColor;
  const toast = useToast();

  const [port, setPort] = useState<number>(
    config.intelligence.mcpServer.launcher.port
  );

  const [logAnalysisBaseUrl, setLogAnalysisBaseUrl] = useState(
    config.intelligence.logAnalysis.baseUrl
  );
  const [logAnalysisApiKey, setLogAnalysisApiKey] = useState(
    config.intelligence.logAnalysis.apiKey
  );
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    setPort(config.intelligence.mcpServer.launcher.port);
  }, [config.intelligence.mcpServer.launcher.port]);

  useEffect(() => {
    setLogAnalysisBaseUrl(config.intelligence.logAnalysis.baseUrl);
  }, [config.intelligence.logAnalysis.baseUrl]);

  useEffect(() => {
    setLogAnalysisApiKey(config.intelligence.logAnalysis.apiKey);
  }, [config.intelligence.logAnalysis.apiKey]);

  const handleTestConnection = useCallback(async () => {
    setIsTestingConnection(true);
    try {
      const response = await IntelligenceService.testLLMConnection();
      if (response.status === "success" && response.data?.success) {
        toast({
          title: t(
            "IntelligenceSettingsPage.logAnalysis.settings.testConnection.success"
          ),
          status: "success",
        });
      } else {
        toast({
          title: t(
            "IntelligenceSettingsPage.logAnalysis.settings.testConnection.error"
          ),
          description: response.data?.message || response.message,
          status: "error",
        });
      }
    } catch (error) {
      toast({
        title: t(
          "IntelligenceSettingsPage.logAnalysis.settings.testConnection.error"
        ),
        description: String(error),
        status: "error",
      });
    } finally {
      setIsTestingConnection(false);
    }
  }, [t, toast]);

  const SparklesIconBox = () => {
    const bg = useColorModeValue(
      // light mode: colorful background
      `
      radial-gradient(circle at top left,     #4299E1 0%, transparent 70%),   // blue.400
      radial-gradient(circle at top right,    #ED64A6 0%, transparent 70%),   // pink.400
      radial-gradient(circle at bottom left,  #ED8936 0%, transparent 70%),   // orange.400
      radial-gradient(circle at bottom right, #ED64A6 0%, transparent 70%)
      `,
      // dark mode: neutral gray background
      "linear-gradient(135deg, #171923, #2D3748)"
    );

    return (
      <Box
        boxSize="32px"
        borderRadius="4px"
        bg={bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={LuSparkles} boxSize="16px" color="white" />
      </Box>
    );
  };

  const settingsGroups: OptionItemGroupProps[] = [
    {
      items: [
        {
          prefixElement: <SparklesIconBox />,
          title: t("IntelligenceSettingsPage.title"),
          description: t("IntelligenceSettingsPage.description"),
          children: <></>,
        },
      ],
    },
    {
      title: t("IntelligenceSettingsPage.mcpServer.title"),
      headExtra: (
        <Box display="flex" alignItems="center">
          <Text fontSize="xs" className="secondary-text">
            {t("IntelligenceSettingsPage.mcpServer.headExtra")}
          </Text>
        </Box>
      ),
      items: [
        {
          title: t("IntelligenceSettingsPage.mcpServer.settings.enabled.title"),
          description: t(
            "IntelligenceSettingsPage.mcpServer.settings.enabled.description"
          ),
          children: (
            <Switch
              colorScheme={primaryColor}
              isChecked={config.intelligence.mcpServer.launcher.enabled}
              onChange={(e) => {
                update(
                  "intelligence.mcpServer.launcher.enabled",
                  e.target.checked
                );
              }}
            />
          ),
        },
        ...(config.intelligence.mcpServer.launcher.enabled
          ? [
              {
                title: t(
                  "IntelligenceSettingsPage.mcpServer.settings.docs.title"
                ),
                description: t(
                  "IntelligenceSettingsPage.mcpServer.settings.docs.description"
                ),
                children: (
                  <CommonIconButton
                    label={t(
                      "IntelligenceSettingsPage.mcpServer.settings.docs.url"
                    )}
                    icon="external"
                    withTooltip
                    tooltipPlacement="bottom-end"
                    size="xs"
                    onClick={() => {
                      openUrl(
                        t(
                          "IntelligenceSettingsPage.mcpServer.settings.docs.url"
                        )
                      );
                    }}
                  />
                ),
              },
              {
                title: t(
                  "IntelligenceSettingsPage.mcpServer.settings.port.title"
                ),
                description: t(
                  "IntelligenceSettingsPage.mcpServer.settings.port.description"
                ),
                children: (
                  <NumberInput
                    min={1}
                    max={65535}
                    size="xs"
                    maxW={16}
                    value={port}
                    onChange={(value) => {
                      if (!/^\d*$/.test(value)) return;
                      setPort(Number(value));
                    }}
                    onBlur={() => {
                      const nextPort = Math.max(
                        1,
                        Math.min(port || 18970, 65535)
                      );
                      setPort(nextPort);
                      update("intelligence.mcpServer.launcher.port", nextPort);
                    }}
                  >
                    <NumberInputField pr={0} />
                  </NumberInput>
                ),
              },
            ]
          : []),
      ],
    },
    {
      title: t("IntelligenceSettingsPage.logAnalysis.title"),
      headExtra: (
        <Box display="flex" alignItems="center">
          <Text fontSize="xs" className="secondary-text">
            {t("IntelligenceSettingsPage.logAnalysis.headExtra")}
          </Text>
        </Box>
      ),
      items: [
        {
          title: t(
            "IntelligenceSettingsPage.logAnalysis.settings.enabled.title"
          ),
          description: t(
            "IntelligenceSettingsPage.logAnalysis.settings.enabled.description"
          ),
          children: (
            <Switch
              colorScheme={primaryColor}
              isChecked={config.intelligence.logAnalysis.enabled}
              onChange={(e) => {
                update("intelligence.logAnalysis.enabled", e.target.checked);
              }}
            />
          ),
        },
        ...(config.intelligence.logAnalysis.enabled
          ? [
              {
                title: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.baseUrl.title"
                ),
                description: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.baseUrl.description"
                ),
                children: (
                  <Input
                    size="xs"
                    maxW={200}
                    placeholder="https://api.openai.com"
                    value={logAnalysisBaseUrl}
                    onChange={(e) => setLogAnalysisBaseUrl(e.target.value)}
                    onBlur={() => {
                      update(
                        "intelligence.logAnalysis.baseUrl",
                        logAnalysisBaseUrl
                      );
                    }}
                  />
                ),
              },
              {
                title: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.apiKey.title"
                ),
                description: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.apiKey.description"
                ),
                children: (
                  <Input
                    size="xs"
                    maxW={200}
                    type="password"
                    placeholder="sk-..."
                    value={logAnalysisApiKey}
                    onChange={(e) => setLogAnalysisApiKey(e.target.value)}
                    onBlur={() => {
                      update(
                        "intelligence.logAnalysis.apiKey",
                        logAnalysisApiKey
                      );
                    }}
                  />
                ),
              },
              {
                title: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.model.title"
                ),
                description: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.model.description"
                ),
                children: (
                  <Input
                    size="xs"
                    maxW={200}
                    placeholder={t(
                      "IntelligenceSettingsPage.logAnalysis.settings.model.placeholder"
                    )}
                    value={config.intelligence.logAnalysis.selectedModel}
                    onChange={(e) => {
                      update(
                        "intelligence.logAnalysis.selectedModel",
                        e.target.value
                      );
                    }}
                  />
                ),
              },
              {
                title: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.testConnection.title"
                ),
                description: t(
                  "IntelligenceSettingsPage.logAnalysis.settings.testConnection.description"
                ),
                children: (
                  <CommonIconButton
                    label={t(
                      "IntelligenceSettingsPage.logAnalysis.settings.testConnection.title"
                    )}
                    icon={LuWifi}
                    size="xs"
                    isLoading={isTestingConnection}
                    onClick={handleTestConnection}
                  />
                ),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <>
      {settingsGroups.map((group, index) => (
        <OptionItemGroup key={index} {...group} />
      ))}
    </>
  );
};

export default IntelligenceSettingsPage;
