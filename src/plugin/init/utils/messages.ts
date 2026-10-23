const messages = {
  Q_ProjectName: "Input your project name (target directory)",
  Q_ProjectNameError: "Project name must be at least 1 character",
  Q_NameEn: "Input your plug-in name in English [1-64chars]",
  Q_NameEnError: "Plug-in name must be 1-64chars",
  Q_DescriptionEn: "Input your plug-in description in English [1-200chars]",
  Q_DescriptionEnError: "Plug-in description must be 1-200chars",
  Q_SupportJa: "Does your plug-in support Japanese?",
  Q_NameJa: "Input your plug-in name in Japanese [1-64chars]",
  Q_NameJaError: "Plug-in name must be 1-64chars",
  Q_DescriptionJa: "Input your plug-in description in Japanese [1-200chars]",
  Q_DescriptionJaError: "Plug-in description must be 1-200chars",
  Q_SupportZh: "Does your plug-in support Chinese?",
  Q_NameZh: "Input your plug-in name in Chinese [1-64chars]",
  Q_NameZhError: "Plug-in name must be 1-64chars",
  Q_DescriptionZh: "Input your plug-in description in Chinese [1-200chars]",
  Q_DescriptionZhError: "Plug-in description must be 1-200chars",
  Q_SupportEs: "Does your plug-in support Spanish?",
  Q_NameEs: "Input your plug-in name in Spanish [1-64chars]",
  Q_NameEsError: "Plug-in name must be 1-64chars",
  Q_DescriptionEs: "Input your plug-in description in Spanish [1-200chars]",
  Q_DescriptionEsError: "Plug-in description must be 1-200chars",
  Q_WebsiteUrlEn: "Input your home page url for English (Optional)",
  Q_WebsiteUrlJa: "Input your home page url for Japanese (Optional)",
  Q_WebsiteUrlZh: "Input your home page url for Chinese (Optional)",
  Q_WebsiteUrlEs: "Input your home page url for Spanish (Optional)",
  settingUpTemplate: "Starting to set up template...",
  templateSetupCompleted: "Template set up successfully",
  installDependencies: "Starting to install dependencies...",
  dependenciesInstalled: "Dependencies installed successfully",
  generatingPrivateKey: "Starting to generate private key...",
  privateKeyGenerated: "Private key generated successfully",
  introduction: `
Please answer some questions to create your Kintone plug-in project :)
Let's start!
    `,
  npmStart:
    "Start watching file changes and create a Kintone plug-in zip file.",
  npmBuild: "Create a Kintone plug-in zip file.",
  npmLint: "Lint JS files with ESLint.",
  nextAction: "Try the following commands",
  lastMessage: "Have fun developing Kintone plug-ins!",
};

type MessageKey = keyof typeof messages;

export const getMessage = (key: MessageKey): string => messages[key];
