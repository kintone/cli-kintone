import type { CommandModule } from "yargs";
import chalk from "chalk";

const command = "tone";

const bannerLarge = `
 ██████╗██╗     ██╗     ██╗  ██╗██╗███╗   ██╗████████╗ ██████╗ ███╗   ██╗███████╗
██╔════╝██║     ██║     ██║ ██╔╝██║████╗  ██║╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝
██║     ██║     ██║████╗█████╔╝ ██║██╔██╗ ██║   ██║   ██║   ██║██╔██╗ ██║█████╗
██║     ██║     ██║╚═══╝██╔═██╗ ██║██║╚██╗██║   ██║   ██║   ██║██║╚██╗██║██╔══╝
╚██████╗███████╗██║     ██║  ██╗██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚████║███████╗
 ╚═════╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝
`;

const bannerMedium = `
      _ _     _    _       _                   
  ___| (_)   | | _(_)_ __ | |_ ___  _ __   ___ 
 / __| | |___| |/ / | '_ \\| __/ _ \\| '_ \\ / _ \\
| (__| | |___|   <| | | | | || (_) | | | |  __/
 \\___|_|_|   |_|\\_\\_|_| |_|\\__\\___/|_| |_|\\___|
`;

const bannerSmall = `
  ╔═════════════════════════════╗
  ║         cli-kintone         ║
  ╚═════════════════════════════╝
`;

const handler = () => {
  const cols = process.stdout.columns || 80;

  let banner: string;
  if (cols >= 82) {
    banner = bannerLarge;
  } else if (cols >= 48) {
    banner = bannerMedium;
  } else {
    banner = bannerSmall;
  }

  console.log(chalk.yellow(banner));
};

export const kintoneCommand: CommandModule = {
  command,
  describe: false,
  handler,
};
