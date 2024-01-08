export interface Argument {
  getArgumentQuery: () => string;
}

export class BaseUrl implements Argument {
  private readonly baseUrl?: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  getArgumentQuery() {
    if (this.baseUrl && this.baseUrl.length > 0) {
      return `--baseUrl ${this.baseUrl}`;
    }

    return "";
  }
}

export class App implements Argument {
  private readonly app?: string;

  constructor(app?: string) {
    this.app = app;
  }

  getArgumentQuery() {
    if (this.app && this.app.length > 0) {
      return `--app ${this.app}`;
    }

    return "";
  }
}

export class FilePath implements Argument {
  private readonly filePath?: string;

  constructor(filePath?: string) {
    this.filePath = filePath;
  }

  getArgumentQuery() {
    if (this.filePath && this.filePath.length > 0) {
      return `--filePath ${this.filePath}`;
    }

    return "";
  }
}

export class Username implements Argument {
  private readonly username?: string;

  constructor(username?: string) {
    this.username = username;
  }

  getArgumentQuery() {
    if (this.username && this.username.length > 0) {
      return `--username ${this.username}`;
    }

    return "";
  }
}

export class Password implements Argument {
  private readonly password?: string;

  constructor(password?: string) {
    this.password = password;
  }

  getArgumentQuery() {
    if (this.password && this.password.length > 0) {
      return `--password ${this.password}`;
    }

    return "";
  }
}

export class ApiToken implements Argument {
  private readonly apiToken?: string | string[];

  constructor(apiToken?: string | string[]) {
    this.apiToken = apiToken;
  }

  getArgumentQuery() {
    if (this.apiToken) {
      if (typeof this.apiToken === "string") {
        return `--apiToken ${this.apiToken}`;
      }

      return `--apiToken ${this.apiToken.join(",")}`;
    }

    return "";
  }
}

export class GuestSpaceId implements Argument {
  private readonly guestSpaceId?: string;

  constructor(guestSpaceId?: string) {
    this.guestSpaceId = guestSpaceId;
  }

  getArgumentQuery() {
    if (this.guestSpaceId && this.guestSpaceId.length > 0) {
      return `--guestSpaceId ${this.guestSpaceId}`;
    }

    return "";
  }
}

export class Encoding implements Argument {
  private readonly encoding?: string;

  constructor(encoding?: string) {
    this.encoding = encoding;
  }

  getArgumentQuery() {
    if (this.encoding && this.encoding.length > 0) {
      return `--encoding ${this.encoding}`;
    }

    return "";
  }
}

export class Fields implements Argument {
  private readonly fields?: string[];

  constructor(fields?: string[]) {
    this.fields = fields;
  }

  getArgumentQuery() {
    if (this.fields && this.fields.length > 0) {
      return `--fields ${this.fields.join(",")}`;
    }

    return "";
  }
}

export class Condition implements Argument {
  private readonly condition?: string;

  constructor(condition?: string) {
    this.condition = condition;
  }

  getArgumentQuery() {
    if (this.condition && this.condition.length > 0) {
      return `--condition ${this.condition}`;
    }

    return "";
  }
}

export class OrderBy implements Argument {
  private readonly orderBy?: string;

  constructor(orderBy?: string) {
    this.orderBy = orderBy;
  }

  getArgumentQuery() {
    if (this.orderBy && this.orderBy.length > 0) {
      return `--orderBy ${this.orderBy}`;
    }

    return "";
  }
}

export class Yes implements Argument {
  private readonly yes?: boolean;

  constructor(yes?: boolean) {
    this.yes = yes;
  }

  getArgumentQuery() {
    if (this.yes) {
      return `--yes`;
    }

    return "";
  }
}

export class UpdateKey implements Argument {
  private readonly updateKey?: string;

  constructor(updateKey?: string) {
    this.updateKey = updateKey;
  }

  getArgumentQuery() {
    if (this.updateKey && this.updateKey.length > 0) {
      return `--updateKey ${this.updateKey}`;
    }

    return "";
  }
}

export class AttachmentsDir implements Argument {
  private readonly attachmentsDir?: string;

  constructor(attachmentsDir?: string) {
    this.attachmentsDir = attachmentsDir;
  }

  getArgumentQuery() {
    if (this.attachmentsDir && this.attachmentsDir.length > 0) {
      return `--attachmentsDir ${this.attachmentsDir}`;
    }

    return "";
  }
}
