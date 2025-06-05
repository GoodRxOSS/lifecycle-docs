import meta from "../../../src/pages/_meta.ts";
import articles_meta from "../../../src/pages/articles/_meta.ts";
import docs_meta from "../../../src/pages/docs/_meta.ts";
import docs_features_meta from "../../../src/pages/docs/features/_meta.ts";
import docs_getting_started_meta from "../../../src/pages/docs/getting-started/_meta.ts";
import docs_schema_meta from "../../../src/pages/docs/schema/_meta.ts";
import docs_setup_meta from "../../../src/pages/docs/setup/_meta.ts";
import docs_tips_meta from "../../../src/pages/docs/tips/_meta.ts";
import docs_troubleshooting_meta from "../../../src/pages/docs/troubleshooting/_meta.ts";
import tags_meta from "../../../src/pages/tags/_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "articles",
  route: "/articles",
  children: [{
    data: articles_meta
  }, {
    name: "introduction",
    route: "/articles/introduction",
    frontMatter: {
      "title": "Introducing Lifecycle",
      "tags": ["intro", "lifecycle", "core"],
      "date": "2025-05-23"
    }
  }]
}, {
  name: "docs",
  route: "/docs",
  children: [{
    data: docs_meta
  }, {
    name: "features",
    route: "/docs/features",
    children: [{
      data: docs_features_meta
    }, {
      name: "auto-deployment",
      route: "/docs/features/auto-deployment",
      frontMatter: {
        "title": "Auto Deploy & Labels",
        "description": "How to setup auto deploy for pull requests and control envionment with labels",
        "tags": ["deploy", "auto", "labels", "lifecycle-deploy", "lifecycle-disabled"],
        "date": "2025-01-29"
      }
    }, {
      name: "service-dependencies",
      route: "/docs/features/service-dependencies",
      frontMatter: {
        "title": "Service Dependencies",
        "description": "Understand service dependencies, their impact, and configuration.",
        "tags": ["lifecycle", "service-dependencies", "configuration", "defaultServices", "optionalServices"],
        "date": "2025-02-16"
      }
    }, {
      name: "template-variables",
      route: "/docs/features/template-variables",
      frontMatter: {
        "title": "Template Variables",
        "tags": ["template", "variables", "buildUUID", "publicUrl", "sha", "branchName", "UUID", "internalHostname", "review"]
      }
    }, {
      name: "webhooks",
      route: "/docs/features/webhooks",
      frontMatter: {
        "title": "Webhooks",
        "tags": ["webhook", "automation", "codefresh", "deployment", "lifecycle"],
        "date": "2025-02-16"
      }
    }]
  }, {
    name: "getting-started",
    route: "/docs/getting-started",
    children: [{
      data: docs_getting_started_meta
    }, {
      name: "configure-environment",
      route: "/docs/getting-started/configure-environment",
      frontMatter: {
        "title": "Configure environment",
        "tags": ["tutorial", "configure", "edit"]
      }
    }, {
      name: "create-environment",
      route: "/docs/getting-started/create-environment",
      frontMatter: {
        "title": "Create environment",
        "tags": ["lifecycle", "tutorial", "ephemeral-env", "start", "first environment"]
      }
    }, {
      name: "delete-environment",
      route: "/docs/getting-started/delete-environment",
      frontMatter: {
        "title": "Delete environment",
        "tags": ["lifecycle", "tutorial", "delete", "tear down", "cleanup", "lifecycle-disabled", "close"]
      }
    }, {
      name: "explore-environment",
      route: "/docs/getting-started/explore-environment",
      frontMatter: {
        "title": "Explore environment",
        "tags": ["lifecycle", "tutorial", "explore"]
      }
    }, {
      name: "explore-static-environment",
      route: "/docs/getting-started/explore-static-environment",
      frontMatter: {
        "title": "Explore static environment",
        "description": "Create the first and default static environment",
        "tags": ["tutorial", "dev-0", "static", "onboard"]
      }
    }, {
      name: "terminology",
      route: "/docs/getting-started/terminology",
      frontMatter: {
        "title": "Terminology",
        "tags": ["build", "terminology", "glossary", "term", "environment", "webhook", "deploy", "service", "review"]
      }
    }]
  }, {
    name: "schema",
    route: "/docs/schema",
    children: [{
      data: docs_schema_meta
    }, {
      name: "full",
      route: "/docs/schema/full",
      frontMatter: {
        "title": "Lifecycle Full Schema",
        "description": "Lifecycle Schema documentation; this page contains the full schema as defined in lifecycle core—all at once.",
        "navtext": "All at once",
        "tags": ["schema", "lifecycle"],
        "date": "2025-05-31"
      }
    }, {
      name: "index",
      route: "/docs/schema",
      frontMatter: {
        "title": "Lifecycle Schema",
        "description": "Lifecycle Schema documentation; a section by section breakdown of the Lifecycle schema.",
        "navtext": "Section by section",
        "tags": ["schema", "lifecycle"],
        "date": "2025-03-28"
      }
    }]
  }, {
    name: "setup",
    route: "/docs/setup",
    children: [{
      data: docs_setup_meta
    }, {
      name: "configure-lifecycle",
      route: "/docs/setup/configure-lifecycle",
      frontMatter: {
        "title": "Additional Configuration",
        "tags": ["configure", "lifecycle", "install", "setup"]
      }
    }, {
      name: "create-github-app",
      route: "/docs/setup/create-github-app",
      frontMatter: {
        "title": "Configure Application",
        "tags": ["github", "app", "install", "setup"]
      }
    }, {
      name: "install-lifecycle",
      route: "/docs/setup/install-lifecycle",
      frontMatter: {
        "title": "Install Lifecycle",
        "tags": ["lifecycle", "install", "getting-started", "setup"]
      }
    }, {
      name: "prerequisites",
      route: "/docs/setup/prerequisites",
      frontMatter: {
        "title": "Prerequisites",
        "tags": ["requirements", "prerequisites", "setup"]
      }
    }, {
      name: "setup-infra",
      route: "/docs/setup/setup-infra",
      frontMatter: {
        "title": "Setup your cluster",
        "tags": ["cluster", "setup", "gke", "aws"]
      }
    }]
  }, {
    name: "tips",
    route: "/docs/tips",
    children: [{
      data: docs_tips_meta
    }, {
      name: "telemetry",
      route: "/docs/tips/telemetry",
      frontMatter: {
        "title": "Telemetry",
        "tags": ["logs", "metrics", "telemetry", "datadog", "observability"]
      }
    }, {
      name: "using-mission-control",
      route: "/docs/tips/using-mission-control",
      frontMatter: {
        "title": "Mission Control comment",
        "description": "Use the Mission Control PR Comment to modify and customize your environment directly from the pull request comment.",
        "tags": ["pull request", "comment", "mission control", "environment", "pr"]
      }
    }]
  }, {
    name: "troubleshooting",
    route: "/docs/troubleshooting",
    children: [{
      data: docs_troubleshooting_meta
    }, {
      name: "build-issues",
      route: "/docs/troubleshooting/build-issues",
      frontMatter: {
        "title": "Troubleshooting Build Issues",
        "description": "Understand how to handle common build issues with environments",
        "tags": ["build", "issues", "error", "codefresh"],
        "navtext": "Build Issues"
      }
    }, {
      name: "deploy-issues",
      route: "/docs/troubleshooting/deploy-issues",
      frontMatter: {
        "title": "Deploy Issues",
        "description": "Understand how to handle common deploy issues with environments",
        "tags": ["deploy", "issues", "error", "todo", "codefresh"],
        "date": "2025-03-11"
      }
    }, {
      name: "github-app-webhooks",
      route: "/docs/troubleshooting/github-app-webhooks",
      frontMatter: {
        "title": "Missing PR comment",
        "tags": ["mission control", "comment", "missing", "issue", "setup"]
      }
    }]
  }, {
    name: "what-is-lifecycle",
    route: "/docs/what-is-lifecycle",
    frontMatter: {
      "title": "What is Lifecycle?",
      "description": "Lifecycle is your effortless way to test and create ephemeral environments",
      "tags": ["core", "lifecycle", "intro"],
      "date": "2025-03-12"
    }
  }]
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "title": "Lifecycle",
    "description": "Transform your pull requests into connected development playgrounds! 🚤"
  }
}, {
  name: "tags",
  route: "/tags",
  children: [{
    data: tags_meta
  }, {
    name: "app",
    route: "/tags/app",
    frontMatter: {
      "title": "app",
      "description": "Lifecycle \"app\" docs"
    }
  }, {
    name: "auto",
    route: "/tags/auto",
    frontMatter: {
      "title": "auto",
      "description": "Lifecycle \"auto\" docs"
    }
  }, {
    name: "automation",
    route: "/tags/automation",
    frontMatter: {
      "title": "automation",
      "description": "Lifecycle \"automation\" docs"
    }
  }, {
    name: "aws",
    route: "/tags/aws",
    frontMatter: {
      "title": "aws",
      "description": "Lifecycle \"aws\" docs"
    }
  }, {
    name: "branchname",
    route: "/tags/branchname",
    frontMatter: {
      "title": "branchname",
      "description": "Lifecycle \"branchname\" docs"
    }
  }, {
    name: "build",
    route: "/tags/build",
    frontMatter: {
      "title": "build",
      "description": "Lifecycle \"build\" docs"
    }
  }, {
    name: "builduuid",
    route: "/tags/builduuid",
    frontMatter: {
      "title": "builduuid",
      "description": "Lifecycle \"builduuid\" docs"
    }
  }, {
    name: "cleanup",
    route: "/tags/cleanup",
    frontMatter: {
      "title": "cleanup",
      "description": "Lifecycle \"cleanup\" docs"
    }
  }, {
    name: "close",
    route: "/tags/close",
    frontMatter: {
      "title": "close",
      "description": "Lifecycle \"close\" docs"
    }
  }, {
    name: "cluster",
    route: "/tags/cluster",
    frontMatter: {
      "title": "cluster",
      "description": "Lifecycle \"cluster\" docs"
    }
  }, {
    name: "codefresh",
    route: "/tags/codefresh",
    frontMatter: {
      "title": "codefresh",
      "description": "Lifecycle \"codefresh\" docs"
    }
  }, {
    name: "comment",
    route: "/tags/comment",
    frontMatter: {
      "title": "comment",
      "description": "Lifecycle \"comment\" docs"
    }
  }, {
    name: "configuration",
    route: "/tags/configuration",
    frontMatter: {
      "title": "configuration",
      "description": "Lifecycle \"configuration\" docs"
    }
  }, {
    name: "configure",
    route: "/tags/configure",
    frontMatter: {
      "title": "configure",
      "description": "Lifecycle \"configure\" docs"
    }
  }, {
    name: "core",
    route: "/tags/core",
    frontMatter: {
      "title": "core",
      "description": "Lifecycle \"core\" docs"
    }
  }, {
    name: "datadog",
    route: "/tags/datadog",
    frontMatter: {
      "title": "datadog",
      "description": "Lifecycle \"datadog\" docs"
    }
  }, {
    name: "defaultservices",
    route: "/tags/defaultservices",
    frontMatter: {
      "title": "defaultservices",
      "description": "Lifecycle \"defaultservices\" docs"
    }
  }, {
    name: "delete",
    route: "/tags/delete",
    frontMatter: {
      "title": "delete",
      "description": "Lifecycle \"delete\" docs"
    }
  }, {
    name: "deploy",
    route: "/tags/deploy",
    frontMatter: {
      "title": "deploy",
      "description": "Lifecycle \"deploy\" docs"
    }
  }, {
    name: "deployment",
    route: "/tags/deployment",
    frontMatter: {
      "title": "deployment",
      "description": "Lifecycle \"deployment\" docs"
    }
  }, {
    name: "dev-0",
    route: "/tags/dev-0",
    frontMatter: {
      "title": "dev-0",
      "description": "Lifecycle \"dev-0\" docs"
    }
  }, {
    name: "edit",
    route: "/tags/edit",
    frontMatter: {
      "title": "edit",
      "description": "Lifecycle \"edit\" docs"
    }
  }, {
    name: "environment",
    route: "/tags/environment",
    frontMatter: {
      "title": "environment",
      "description": "Lifecycle \"environment\" docs"
    }
  }, {
    name: "ephemeral-env",
    route: "/tags/ephemeral-env",
    frontMatter: {
      "title": "ephemeral-env",
      "description": "Lifecycle \"ephemeral-env\" docs"
    }
  }, {
    name: "error",
    route: "/tags/error",
    frontMatter: {
      "title": "error",
      "description": "Lifecycle \"error\" docs"
    }
  }, {
    name: "explore",
    route: "/tags/explore",
    frontMatter: {
      "title": "explore",
      "description": "Lifecycle \"explore\" docs"
    }
  }, {
    name: "first environment",
    route: "/tags/first environment",
    frontMatter: {
      "title": "first environment",
      "description": "Lifecycle \"first environment\" docs"
    }
  }, {
    name: "getting-started",
    route: "/tags/getting-started",
    frontMatter: {
      "title": "getting-started",
      "description": "Lifecycle \"getting-started\" docs"
    }
  }, {
    name: "github",
    route: "/tags/github",
    frontMatter: {
      "title": "github",
      "description": "Lifecycle \"github\" docs"
    }
  }, {
    name: "gke",
    route: "/tags/gke",
    frontMatter: {
      "title": "gke",
      "description": "Lifecycle \"gke\" docs"
    }
  }, {
    name: "glossary",
    route: "/tags/glossary",
    frontMatter: {
      "title": "glossary",
      "description": "Lifecycle \"glossary\" docs"
    }
  }, {
    name: "install",
    route: "/tags/install",
    frontMatter: {
      "title": "install",
      "description": "Lifecycle \"install\" docs"
    }
  }, {
    name: "internalhostname",
    route: "/tags/internalhostname",
    frontMatter: {
      "title": "internalhostname",
      "description": "Lifecycle \"internalhostname\" docs"
    }
  }, {
    name: "intro",
    route: "/tags/intro",
    frontMatter: {
      "title": "intro",
      "description": "Lifecycle \"intro\" docs"
    }
  }, {
    name: "issue",
    route: "/tags/issue",
    frontMatter: {
      "title": "issue",
      "description": "Lifecycle \"issue\" docs"
    }
  }, {
    name: "issues",
    route: "/tags/issues",
    frontMatter: {
      "title": "issues",
      "description": "Lifecycle \"issues\" docs"
    }
  }, {
    name: "labels",
    route: "/tags/labels",
    frontMatter: {
      "title": "labels",
      "description": "Lifecycle \"labels\" docs"
    }
  }, {
    name: "lifecycle-deploy",
    route: "/tags/lifecycle-deploy",
    frontMatter: {
      "title": "lifecycle-deploy",
      "description": "Lifecycle \"lifecycle-deploy\" docs"
    }
  }, {
    name: "lifecycle-disabled",
    route: "/tags/lifecycle-disabled",
    frontMatter: {
      "title": "lifecycle-disabled",
      "description": "Lifecycle \"lifecycle-disabled\" docs"
    }
  }, {
    name: "lifecycle",
    route: "/tags/lifecycle",
    frontMatter: {
      "title": "lifecycle",
      "description": "Lifecycle \"lifecycle\" docs"
    }
  }, {
    name: "logs",
    route: "/tags/logs",
    frontMatter: {
      "title": "logs",
      "description": "Lifecycle \"logs\" docs"
    }
  }, {
    name: "metrics",
    route: "/tags/metrics",
    frontMatter: {
      "title": "metrics",
      "description": "Lifecycle \"metrics\" docs"
    }
  }, {
    name: "missing",
    route: "/tags/missing",
    frontMatter: {
      "title": "missing",
      "description": "Lifecycle \"missing\" docs"
    }
  }, {
    name: "mission control",
    route: "/tags/mission control",
    frontMatter: {
      "title": "mission control",
      "description": "Lifecycle \"mission control\" docs"
    }
  }, {
    name: "observability",
    route: "/tags/observability",
    frontMatter: {
      "title": "observability",
      "description": "Lifecycle \"observability\" docs"
    }
  }, {
    name: "onboard",
    route: "/tags/onboard",
    frontMatter: {
      "title": "onboard",
      "description": "Lifecycle \"onboard\" docs"
    }
  }, {
    name: "optionalservices",
    route: "/tags/optionalservices",
    frontMatter: {
      "title": "optionalservices",
      "description": "Lifecycle \"optionalservices\" docs"
    }
  }, {
    name: "pr",
    route: "/tags/pr",
    frontMatter: {
      "title": "pr",
      "description": "Lifecycle \"pr\" docs"
    }
  }, {
    name: "prerequisites",
    route: "/tags/prerequisites",
    frontMatter: {
      "title": "prerequisites",
      "description": "Lifecycle \"prerequisites\" docs"
    }
  }, {
    name: "publicurl",
    route: "/tags/publicurl",
    frontMatter: {
      "title": "publicurl",
      "description": "Lifecycle \"publicurl\" docs"
    }
  }, {
    name: "pull request",
    route: "/tags/pull request",
    frontMatter: {
      "title": "pull request",
      "description": "Lifecycle \"pull request\" docs"
    }
  }, {
    name: "requirements",
    route: "/tags/requirements",
    frontMatter: {
      "title": "requirements",
      "description": "Lifecycle \"requirements\" docs"
    }
  }, {
    name: "review",
    route: "/tags/review",
    frontMatter: {
      "title": "review",
      "description": "Lifecycle \"review\" docs"
    }
  }, {
    name: "schema",
    route: "/tags/schema",
    frontMatter: {
      "title": "schema",
      "description": "Lifecycle \"schema\" docs"
    }
  }, {
    name: "service-dependencies",
    route: "/tags/service-dependencies",
    frontMatter: {
      "title": "service-dependencies",
      "description": "Lifecycle \"service-dependencies\" docs"
    }
  }, {
    name: "service",
    route: "/tags/service",
    frontMatter: {
      "title": "service",
      "description": "Lifecycle \"service\" docs"
    }
  }, {
    name: "setup",
    route: "/tags/setup",
    frontMatter: {
      "title": "setup",
      "description": "Lifecycle \"setup\" docs"
    }
  }, {
    name: "sha",
    route: "/tags/sha",
    frontMatter: {
      "title": "sha",
      "description": "Lifecycle \"sha\" docs"
    }
  }, {
    name: "start",
    route: "/tags/start",
    frontMatter: {
      "title": "start",
      "description": "Lifecycle \"start\" docs"
    }
  }, {
    name: "static",
    route: "/tags/static",
    frontMatter: {
      "title": "static",
      "description": "Lifecycle \"static\" docs"
    }
  }, {
    name: "tear down",
    route: "/tags/tear down",
    frontMatter: {
      "title": "tear down",
      "description": "Lifecycle \"tear down\" docs"
    }
  }, {
    name: "telemetry",
    route: "/tags/telemetry",
    frontMatter: {
      "title": "telemetry",
      "description": "Lifecycle \"telemetry\" docs"
    }
  }, {
    name: "template",
    route: "/tags/template",
    frontMatter: {
      "title": "template",
      "description": "Lifecycle \"template\" docs"
    }
  }, {
    name: "term",
    route: "/tags/term",
    frontMatter: {
      "title": "term",
      "description": "Lifecycle \"term\" docs"
    }
  }, {
    name: "terminology",
    route: "/tags/terminology",
    frontMatter: {
      "title": "terminology",
      "description": "Lifecycle \"terminology\" docs"
    }
  }, {
    name: "todo",
    route: "/tags/todo",
    frontMatter: {
      "title": "todo",
      "description": "Lifecycle \"todo\" docs"
    }
  }, {
    name: "tutorial",
    route: "/tags/tutorial",
    frontMatter: {
      "title": "tutorial",
      "description": "Lifecycle \"tutorial\" docs"
    }
  }, {
    name: "uuid",
    route: "/tags/uuid",
    frontMatter: {
      "title": "uuid",
      "description": "Lifecycle \"uuid\" docs"
    }
  }, {
    name: "variables",
    route: "/tags/variables",
    frontMatter: {
      "title": "variables",
      "description": "Lifecycle \"variables\" docs"
    }
  }, {
    name: "webhook",
    route: "/tags/webhook",
    frontMatter: {
      "title": "webhook",
      "description": "Lifecycle \"webhook\" docs"
    }
  }]
}];