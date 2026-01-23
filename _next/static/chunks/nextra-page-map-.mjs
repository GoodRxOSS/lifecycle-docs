import meta from "../../../src/pages/_meta.ts";
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
        "tags": ["deploy", "auto", "labels", "lifecycle-deploy", "lifecycle-disabled"]
      }
    }, {
      name: "configurable-labels",
      route: "/docs/features/configurable-labels",
      frontMatter: {
        "title": "Configurable Labels",
        "tags": ["labels", "configuration", "deploy", "disabled", "keep", "status-comments", "global-config"]
      }
    }, {
      name: "environment-ttl",
      route: "/docs/features/environment-ttl",
      frontMatter: {
        "title": "Environment TTL",
        "tags": ["ttl", "cleanup", "lifecycle-keep", "inactivity", "global-config"]
      }
    }, {
      name: "native-helm-deployment",
      route: "/docs/features/native-helm-deployment",
      frontMatter: {
        "title": "Native Helm Deployment",
        "description": "Deploy services using Helm directly in Kubernetes without external CI/CD dependencies",
        "tags": ["helm", "deployment", "kubernetes", "native"]
      }
    }, {
      name: "secrets",
      route: "/docs/features/secrets",
      frontMatter: {
        "title": "Cloud Secrets",
        "tags": ["secrets", "aws", "gcp", "environment variables", "security"]
      }
    }, {
      name: "service-dependencies",
      route: "/docs/features/service-dependencies",
      frontMatter: {
        "title": "Service Dependencies",
        "description": "Understand service dependencies, their impact, and configuration.",
        "tags": ["lifecycle", "service-dependencies", "configuration", "defaultServices", "optionalServices"]
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
        "tags": ["webhook", "automation", "codefresh", "deployment", "lifecycle", "docker", "command"]
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
      name: "aurora-restore",
      route: "/docs/schema/aurora-restore",
      frontMatter: {
        "title": "Aurora Restore Service",
        "description": "Restore AWS Aurora database snapshots for ephemeral environments",
        "tags": ["schema", "aurora", "database", "aws", "restore"]
      }
    }, {
      name: "codefresh",
      route: "/docs/schema/codefresh",
      frontMatter: {
        "title": "Codefresh Service",
        "description": "Trigger external Codefresh pipelines for deployment and destruction",
        "tags": ["schema", "codefresh", "pipeline", "ci-cd"]
      }
    }, {
      name: "configuration",
      route: "/docs/schema/configuration",
      frontMatter: {
        "title": "Configuration Service",
        "description": "Deploy configuration-only services for feature flags and shared configuration",
        "tags": ["schema", "configuration", "feature-flags", "config"]
      }
    }, {
      name: "docker",
      route: "/docs/schema/docker",
      frontMatter: {
        "title": "Docker Service",
        "description": "Deploy pre-built Docker images like databases, caches, and other infrastructure components",
        "tags": ["schema", "docker", "database", "redis", "postgres"]
      }
    }, {
      name: "environment",
      route: "/docs/schema/environment",
      frontMatter: {
        "title": "Environment Configuration",
        "description": "Configure deployment behavior, service grouping, and automation for ephemeral environments",
        "tags": ["schema", "environment", "configuration", "services"]
      }
    }, {
      name: "github",
      route: "/docs/schema/github",
      frontMatter: {
        "title": "GitHub Service",
        "description": "Build and deploy services from GitHub repositories with Docker",
        "tags": ["schema", "github", "docker", "deployment", "build"]
      }
    }, {
      name: "helm",
      route: "/docs/schema/helm",
      frontMatter: {
        "title": "Helm Service",
        "description": "Deploy services using Helm charts - local, OCI, or public repositories",
        "tags": ["schema", "helm", "kubernetes", "charts"]
      }
    }, {
      name: "overview",
      route: "/docs/schema/overview",
      frontMatter: {
        "title": "Schema Overview",
        "description": "Introduction to the lifecycle.yaml configuration file and its structure",
        "tags": ["schema", "configuration", "lifecycle.yaml"]
      }
    }, {
      name: "webhooks",
      route: "/docs/schema/webhooks",
      frontMatter: {
        "title": "Webhooks Configuration",
        "description": "Schema reference for configuring webhooks to automate actions on deployment events",
        "tags": ["schema", "webhooks", "automation", "codefresh", "docker"]
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
        "tags": ["deploy", "issues", "error", "todo", "codefresh"]
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
      "tags": ["core", "lifecycle", "intro"]
    }
  }]
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "title": "Lifecycle",
    "description": "Enterprise-grade ephemeral environments that grow with you"
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
    name: "aurora",
    route: "/tags/aurora",
    frontMatter: {
      "title": "aurora",
      "description": "Lifecycle \"aurora\" docs"
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
    name: "charts",
    route: "/tags/charts",
    frontMatter: {
      "title": "charts",
      "description": "Lifecycle \"charts\" docs"
    }
  }, {
    name: "ci-cd",
    route: "/tags/ci-cd",
    frontMatter: {
      "title": "ci-cd",
      "description": "Lifecycle \"ci-cd\" docs"
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
    name: "command",
    route: "/tags/command",
    frontMatter: {
      "title": "command",
      "description": "Lifecycle \"command\" docs"
    }
  }, {
    name: "comment",
    route: "/tags/comment",
    frontMatter: {
      "title": "comment",
      "description": "Lifecycle \"comment\" docs"
    }
  }, {
    name: "config",
    route: "/tags/config",
    frontMatter: {
      "title": "config",
      "description": "Lifecycle \"config\" docs"
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
    name: "database",
    route: "/tags/database",
    frontMatter: {
      "title": "database",
      "description": "Lifecycle \"database\" docs"
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
    name: "disabled",
    route: "/tags/disabled",
    frontMatter: {
      "title": "disabled",
      "description": "Lifecycle \"disabled\" docs"
    }
  }, {
    name: "docker",
    route: "/tags/docker",
    frontMatter: {
      "title": "docker",
      "description": "Lifecycle \"docker\" docs"
    }
  }, {
    name: "edit",
    route: "/tags/edit",
    frontMatter: {
      "title": "edit",
      "description": "Lifecycle \"edit\" docs"
    }
  }, {
    name: "environment variables",
    route: "/tags/environment variables",
    frontMatter: {
      "title": "environment variables",
      "description": "Lifecycle \"environment variables\" docs"
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
    name: "feature-flags",
    route: "/tags/feature-flags",
    frontMatter: {
      "title": "feature-flags",
      "description": "Lifecycle \"feature-flags\" docs"
    }
  }, {
    name: "first environment",
    route: "/tags/first environment",
    frontMatter: {
      "title": "first environment",
      "description": "Lifecycle \"first environment\" docs"
    }
  }, {
    name: "gcp",
    route: "/tags/gcp",
    frontMatter: {
      "title": "gcp",
      "description": "Lifecycle \"gcp\" docs"
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
    name: "global-config",
    route: "/tags/global-config",
    frontMatter: {
      "title": "global-config",
      "description": "Lifecycle \"global-config\" docs"
    }
  }, {
    name: "glossary",
    route: "/tags/glossary",
    frontMatter: {
      "title": "glossary",
      "description": "Lifecycle \"glossary\" docs"
    }
  }, {
    name: "helm",
    route: "/tags/helm",
    frontMatter: {
      "title": "helm",
      "description": "Lifecycle \"helm\" docs"
    }
  }, {
    name: "inactivity",
    route: "/tags/inactivity",
    frontMatter: {
      "title": "inactivity",
      "description": "Lifecycle \"inactivity\" docs"
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
    name: "keep",
    route: "/tags/keep",
    frontMatter: {
      "title": "keep",
      "description": "Lifecycle \"keep\" docs"
    }
  }, {
    name: "kubernetes",
    route: "/tags/kubernetes",
    frontMatter: {
      "title": "kubernetes",
      "description": "Lifecycle \"kubernetes\" docs"
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
    name: "lifecycle-keep",
    route: "/tags/lifecycle-keep",
    frontMatter: {
      "title": "lifecycle-keep",
      "description": "Lifecycle \"lifecycle-keep\" docs"
    }
  }, {
    name: "lifecycle",
    route: "/tags/lifecycle",
    frontMatter: {
      "title": "lifecycle",
      "description": "Lifecycle \"lifecycle\" docs"
    }
  }, {
    name: "lifecycle.yaml",
    route: "/tags/lifecycle.yaml",
    frontMatter: {
      "title": "lifecycle.yaml",
      "description": "Lifecycle \"lifecycle.yaml\" docs"
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
    name: "native",
    route: "/tags/native",
    frontMatter: {
      "title": "native",
      "description": "Lifecycle \"native\" docs"
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
    name: "pipeline",
    route: "/tags/pipeline",
    frontMatter: {
      "title": "pipeline",
      "description": "Lifecycle \"pipeline\" docs"
    }
  }, {
    name: "postgres",
    route: "/tags/postgres",
    frontMatter: {
      "title": "postgres",
      "description": "Lifecycle \"postgres\" docs"
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
    name: "redis",
    route: "/tags/redis",
    frontMatter: {
      "title": "redis",
      "description": "Lifecycle \"redis\" docs"
    }
  }, {
    name: "requirements",
    route: "/tags/requirements",
    frontMatter: {
      "title": "requirements",
      "description": "Lifecycle \"requirements\" docs"
    }
  }, {
    name: "restore",
    route: "/tags/restore",
    frontMatter: {
      "title": "restore",
      "description": "Lifecycle \"restore\" docs"
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
    name: "secrets",
    route: "/tags/secrets",
    frontMatter: {
      "title": "secrets",
      "description": "Lifecycle \"secrets\" docs"
    }
  }, {
    name: "security",
    route: "/tags/security",
    frontMatter: {
      "title": "security",
      "description": "Lifecycle \"security\" docs"
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
    name: "services",
    route: "/tags/services",
    frontMatter: {
      "title": "services",
      "description": "Lifecycle \"services\" docs"
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
    name: "status-comments",
    route: "/tags/status-comments",
    frontMatter: {
      "title": "status-comments",
      "description": "Lifecycle \"status-comments\" docs"
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
    name: "ttl",
    route: "/tags/ttl",
    frontMatter: {
      "title": "ttl",
      "description": "Lifecycle \"ttl\" docs"
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
  }, {
    name: "webhooks",
    route: "/tags/webhooks",
    frontMatter: {
      "title": "webhooks",
      "description": "Lifecycle \"webhooks\" docs"
    }
  }]
}];