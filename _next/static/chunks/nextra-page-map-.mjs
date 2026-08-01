import meta from "../../../src/pages/_meta.ts";
import docs_meta from "../../../src/pages/docs/_meta.ts";
import docs_api_authentication_meta from "../../../src/pages/docs/api-authentication/_meta.ts";
import docs_api_meta from "../../../src/pages/docs/api/_meta.ts";
import docs_features_meta from "../../../src/pages/docs/features/_meta.ts";
import docs_getting_started_meta from "../../../src/pages/docs/getting-started/_meta.ts";
import docs_operations_meta from "../../../src/pages/docs/operations/_meta.ts";
import docs_reference_meta from "../../../src/pages/docs/reference/_meta.ts";
import docs_releases_meta from "../../../src/pages/docs/releases/_meta.ts";
import docs_schema_meta from "../../../src/pages/docs/schema/_meta.ts";
import docs_setup_meta from "../../../src/pages/docs/setup/_meta.ts";
import docs_tips_meta from "../../../src/pages/docs/tips/_meta.ts";
import docs_troubleshooting_meta from "../../../src/pages/docs/troubleshooting/_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "docs",
  route: "/docs",
  children: [{
    data: docs_meta
  }, {
    name: "api",
    route: "/docs/api",
    children: [{
      data: docs_api_meta
    }, {
      name: "overview",
      route: "/docs/api/overview",
      frontMatter: {
        "title": "Lifecycle API overview",
        "description": "Use the authenticated Lifecycle v2 API, read response envelopes, and make safe integrations.",
        "audience": ["api-user"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["api", "integration", "authentication"]
      }
    }]
  }, {
    name: "api-authentication",
    route: "/docs/api-authentication",
    children: [{
      data: docs_api_authentication_meta
    }, {
      name: "api-keys",
      route: "/docs/api-authentication/api-keys",
      frontMatter: {
        "title": "API keys",
        "description": "Create, scope, use, rotate, and revoke personal or service API keys for authenticated Lifecycle v2 requests.",
        "audience": ["api-user", "administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["api", "authentication", "api-keys", "security"]
      }
    }, {
      name: "overview",
      route: "/docs/api-authentication/overview",
      frontMatter: {
        "title": "API authentication",
        "description": "Select a supported authentication method for Lifecycle v2 API requests and understand typical authorization failures.",
        "audience": ["api-user", "administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["api", "authentication", "security"]
      }
    }]
  }, {
    name: "features",
    route: "/docs/features",
    children: [{
      data: docs_features_meta
    }, {
      name: "agent-administration",
      route: "/docs/features/agent-administration",
      frontMatter: {
        "title": "Agent administration",
        "description": "Administer Lifecycle Agent availability, models, instructions, permissions, tools, workspaces, and session audit.",
        "audience": ["administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ai", "agent", "administration", "security"]
      }
    }, {
      name: "agent-sessions",
      route: "/docs/features/agent-sessions",
      frontMatter: {
        "title": "Agent Sessions",
        "description": "Start, examine, and continue repository work with Lifecycle Agent in an isolated workspace.",
        "audience": ["agent-user"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ai", "agent", "sessions", "workspaces"]
      }
    }, {
      name: "ai-agent-configuration",
      route: "/docs/features/ai-agent-configuration",
      frontMatter: {
        "title": "Configure Lifecycle Agent",
        "description": "Configure models, instructions, tools, approvals, and repository overrides for Lifecycle Agent from Settings.",
        "audience": ["administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ai", "agent", "administration", "settings"]
      }
    }, {
      name: "ai-agent",
      route: "/docs/features/ai-agent",
      frontMatter: {
        "title": "Lifecycle Agent",
        "description": "Investigate a Lifecycle Environment, examine evidence, and do approved recovery tasks from the Environment details page.",
        "audience": ["agent-user"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ai", "agent", "debugging", "environments"]
      }
    }, {
      name: "api-environments",
      route: "/docs/features/api-environments",
      frontMatter: {
        "title": "API-created Environments",
        "description": "Create branch-based Lifecycle Environments without a pull request. Then, track, extend, redeploy, or tear them down.",
        "audience": ["api-user", "application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["environments", "api", "automation", "ttl"]
      }
    }, {
      name: "authentication",
      route: "/docs/features/authentication",
      frontMatter: {
        "title": "Authentication",
        "description": "Sign in to Lifecycle, link GitHub, sign out, and verify access controls.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["authentication", "keycloak", "github", "security"]
      }
    }, {
      name: "auto-deployment",
      route: "/docs/features/auto-deployment",
      frontMatter: {
        "title": "Auto-deploy and labels",
        "description": "Automatically deploy pull request Environments and control them with configurable GitHub labels.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["deploy", "auto", "labels", "lifecycle-deploy", "lifecycle-disabled"]
      }
    }, {
      name: "build-metadata-links",
      route: "/docs/features/build-metadata-links",
      frontMatter: {
        "title": "Build metadata links",
        "description": "Add administrator-managed links to Environment details using build environment variables as templates.",
        "audience": ["application-developer", "platform-operator", "administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["environments", "metadata", "links", "administration"]
      }
    }, {
      name: "cli-telemetry",
      route: "/docs/features/cli-telemetry",
      frontMatter: {
        "title": "Lifecycle CLI telemetry",
        "description": "Understand the pseudonymous command-usage event sent by lfc, its destination, and how to opt out.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["cli", "telemetry", "privacy"]
      }
    }, {
      name: "cli",
      route: "/docs/features/cli",
      frontMatter: {
        "title": "CLI (lfc)",
        "description": "Install and use the Lifecycle CLI to examine Environments, manage Services, stream logs, and validate configuration.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-08-01",
        "verificationBaseline": "2026-08-01-configuration-schema-fix",
        "contentProfile": "asd-ste100",
        "tags": ["cli", "lfc", "operators", "tooling", "automation"]
      }
    }, {
      name: "configurable-labels",
      route: "/docs/features/configurable-labels",
      frontMatter: {
        "title": "Configurable Labels",
        "description": "Use deployment-specific GitHub labels to control Environments, cleanup, and status comments.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["labels", "configuration", "deploy", "disabled", "keep", "status-comments"]
      }
    }, {
      name: "environment-ttl",
      route: "/docs/features/environment-ttl",
      frontMatter: {
        "title": "Environment expiration and cleanup",
        "description": "Understand how Lifecycle cleans up pull-request environments and expires API-created environments.",
        "audience": ["application-developer", "platform-operator", "administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["environments", "cleanup", "ttl", "api"]
      }
    }, {
      name: "ignore-file-patterns",
      route: "/docs/features/ignore-file-patterns",
      frontMatter: {
        "title": "Ignore File Patterns",
        "description": "Skip push redeploys for documentation, metadata, and other non-runtime changes.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ignoreFiles", "push", "redeploy", "configuration"]
      }
    }, {
      name: "lifecycle-ui",
      route: "/docs/features/lifecycle-ui",
      frontMatter: {
        "title": "Use the Lifecycle UI",
        "description": "Use the web UI to find Environments, examine Services and logs, run actions, and examine webhooks.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ui", "environment", "logs"]
      }
    }, {
      name: "mcp-integration",
      route: "/docs/features/mcp-integration",
      frontMatter: {
        "title": "Connect external MCP servers",
        "description": "Add administrator-approved Model Context Protocol servers and complete authentication for each Lifecycle Agent user.",
        "audience": ["agent-user", "administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ai", "mcp", "integrations", "administration"]
      }
    }, {
      name: "mcp-server",
      route: "/docs/features/mcp-server",
      frontMatter: {
        "title": "Lifecycle MCP",
        "description": "Enable Lifecycle MCP, connect an OAuth client, and use Lifecycle tools with existing user permissions.",
        "audience": ["agent-user", "administrator", "platform-operator"],
        "lastVerified": "2026-08-01",
        "verificationBaseline": "2026-08-01-lifecycle-mcp-preparation",
        "contentProfile": "asd-ste100",
        "tags": ["mcp", "oauth", "agents", "administration"]
      }
    }, {
      name: "native-helm-deployment",
      route: "/docs/features/native-helm-deployment",
      frontMatter: {
        "title": "Native Helm deployment",
        "description": "Deploy Services with Helm directly in Kubernetes without an external CI/CD deployment pipeline.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["helm", "deployment", "kubernetes", "native"]
      }
    }, {
      name: "secrets",
      route: "/docs/features/secrets",
      frontMatter: {
        "title": "Cloud secrets",
        "description": "Reference External Secrets Operator values from Lifecycle Services and native Helm deployments.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["secrets", "aws", "gcp", "barbican", "environment variables", "security"]
      }
    }, {
      name: "service-dependencies",
      route: "/docs/features/service-dependencies",
      frontMatter: {
        "title": "Service Dependencies",
        "description": "Understand Service dependencies, their effects, and configuration.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["lifecycle", "service-dependencies", "configuration", "defaultServices", "optionalServices"]
      }
    }, {
      name: "sites",
      route: "/docs/features/sites",
      frontMatter: {
        "title": "Sites",
        "description": "Upload and manage static HTML sites through Lifecycle's UI, CLI, or authenticated v2 API.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["sites", "static-hosting", "cli", "api"]
      }
    }, {
      name: "template-variables",
      route: "/docs/features/template-variables",
      frontMatter: {
        "title": "Template Variables",
        "description": "Use Environment, Service, and configuration values in Lifecycle Service settings.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["template", "variables", "buildUUID", "publicUrl", "sha", "branchName", "repoName", "UUID", "internalHostname", "review"]
      }
    }, {
      name: "webhooks",
      route: "/docs/features/webhooks",
      frontMatter: {
        "title": "Webhooks",
        "description": "Run Codefresh pipelines or Kubernetes Jobs after an Environment deploys, fails, or is torn down.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["webhook", "automation", "codefresh", "deployment", "lifecycle", "docker", "command"]
      }
    }, {
      name: "workspace-backends",
      route: "/docs/features/workspace-backends",
      frontMatter: {
        "title": "Agent workspace backends",
        "description": "Compare and safely activate the runtime backend used for new Lifecycle Agent workspaces.",
        "audience": ["administrator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["ai", "agent", "workspaces", "administration"]
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
        "title": "Configure an Environment",
        "description": "Set Service selection, dependencies, builds, and deployments in lifecycle.yaml.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["tutorial", "configure", "edit"]
      }
    }, {
      name: "create-environment",
      route: "/docs/getting-started/create-environment",
      frontMatter: {
        "title": "Create your first Environment",
        "description": "Onboard a repository and create a pull-request Environment from a correct Lifecycle configuration.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["lifecycle", "tutorial", "environment"]
      }
    }, {
      name: "delete-environment",
      route: "/docs/getting-started/delete-environment",
      frontMatter: {
        "title": "Delete an Environment",
        "description": "Tear down a pull-request or API-created Environment safely from GitHub, the UI, the CLI, or the API.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["lifecycle", "environment", "cleanup"]
      }
    }, {
      name: "explore-environment",
      route: "/docs/getting-started/explore-environment",
      frontMatter: {
        "title": "Explore an Environment",
        "description": "Make sure an Environment is ready, open a deployed Service, and use Lifecycle's pull request comments.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["lifecycle", "tutorial", "explore"]
      }
    }, {
      name: "explore-static-environment",
      route: "/docs/getting-started/explore-static-environment",
      frontMatter: {
        "title": "Create a default static Environment",
        "description": "Create and pin a long-lived dev-0 Environment with supported Lifecycle controls.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["environment", "dev-0", "static"]
      }
    }, {
      name: "onboard-repository",
      route: "/docs/getting-started/onboard-repository",
      frontMatter: {
        "title": "Onboard a repository",
        "description": "Add a GitHub App installation repository to Lifecycle so pull-request and push events can create Environments.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["github", "repository", "onboarding"]
      }
    }, {
      name: "terminology",
      route: "/docs/getting-started/terminology",
      frontMatter: {
        "title": "Terminology",
        "description": "Canonical Lifecycle terms for Environments, Services, deployments, and automation.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["build", "terminology", "glossary", "term", "environment", "webhook", "deploy", "service", "review"]
      }
    }]
  }, {
    name: "index",
    route: "/docs",
    frontMatter: {
      "title": "Lifecycle documentation",
      "description": "Select a task-oriented path through Lifecycle as an application developer, evaluator, platform operator, API user, or Agent administrator.",
      "audience": ["evaluator", "application-developer", "platform-operator", "agent-user", "api-user", "administrator"],
      "lastVerified": "2026-08-01",
      "verificationBaseline": "2026-08-01-lifecycle-mcp-preparation",
      "contentProfile": "asd-ste100",
      "tags": ["core", "lifecycle", "start"]
    }
  }, {
    name: "operations",
    route: "/docs/operations",
    children: [{
      data: docs_operations_meta
    }, {
      name: "architecture",
      route: "/docs/operations/architecture",
      frontMatter: {
        "title": "Lifecycle architecture",
        "description": "Understand how requests become Lifecycle Environments and plan dependencies, security controls, availability, and recovery.",
        "audience": ["evaluator", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["operator", "architecture", "security"]
      }
    }, {
      name: "configuration",
      route: "/docs/operations/configuration",
      frontMatter: {
        "title": "Runtime configuration surfaces",
        "description": "Select a supported UI, API, Helm, or repository configuration surface and verify each change.",
        "audience": ["platform-operator", "administrator"],
        "lastVerified": "2026-08-01",
        "verificationBaseline": "2026-08-01-lifecycle-mcp-preparation",
        "contentProfile": "asd-ste100",
        "tags": ["operator", "configuration", "settings"]
      }
    }, {
      name: "day-two",
      route: "/docs/operations/day-two",
      frontMatter: {
        "title": "Day-two operations",
        "description": "Plan Lifecycle upgrades, backups, rollback decisions, recovery validation, and uninstall.",
        "audience": ["platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["operator", "upgrade", "backup"]
      }
    }, {
      name: "monitoring",
      route: "/docs/operations/monitoring",
      frontMatter: {
        "title": "Monitor Lifecycle",
        "description": "Interpret health endpoints, verify end-to-end operation, and collect safe diagnostic data for stuck work.",
        "audience": ["platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["operator", "monitoring", "troubleshooting"]
      }
    }, {
      name: "security",
      route: "/docs/operations/security",
      frontMatter: {
        "title": "Security boundaries",
        "description": "Understand Lifecycle authentication, network, Kubernetes, secret, and Agent boundaries before other networks can reach a deployment.",
        "audience": ["platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["operator", "security", "authentication"]
      }
    }]
  }, {
    name: "reference",
    route: "/docs/reference",
    children: [{
      data: docs_reference_meta
    }, {
      name: "statuses",
      route: "/docs/reference/statuses",
      frontMatter: {
        "title": "Environment and Service statuses",
        "description": "Interpret Lifecycle Environment, build, deployment, and Service states. Select the correct response.",
        "audience": ["application-developer", "api-user", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["reference", "status", "troubleshooting"]
      }
    }]
  }, {
    name: "releases",
    route: "/docs/releases",
    children: [{
      data: docs_releases_meta
    }, {
      name: "compatibility",
      route: "/docs/releases/compatibility",
      frontMatter: {
        "title": "Compatibility and deprecation policy",
        "description": "Select compatible Lifecycle components and prepare a safe upgrade or rollback.",
        "audience": ["platform-operator", "application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["release", "compatibility", "deprecation"]
      }
    }, {
      name: "index",
      route: "/docs/releases",
      frontMatter: {
        "title": "Releases",
        "description": "Find your installed Lifecycle versions and the release information for an upgrade.",
        "audience": ["platform-operator", "application-developer"],
        "lastVerified": "2026-08-01",
        "verificationBaseline": "2026-08-01-lifecycle-mcp-preparation",
        "contentProfile": "asd-ste100",
        "tags": ["release", "version", "changelog"]
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
        "description": "Make an AWS Aurora point-in-time copy for an ephemeral Environment.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "aurora", "database", "aws", "restore"]
      }
    }, {
      name: "codefresh",
      route: "/docs/schema/codefresh",
      frontMatter: {
        "title": "Codefresh Service",
        "description": "Trigger external Codefresh pipelines for deployment and teardown.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "codefresh", "pipeline", "ci-cd"]
      }
    }, {
      name: "configuration",
      route: "/docs/schema/configuration",
      frontMatter: {
        "title": "Configuration Service",
        "description": "Deploy configuration-only Services for feature flags and shared configuration.",
        "audience": ["application-developer"],
        "lastVerified": "2026-08-01",
        "verificationBaseline": "2026-08-01-configuration-schema-fix",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "configuration", "feature-flags", "config"]
      }
    }, {
      name: "docker",
      route: "/docs/schema/docker",
      frontMatter: {
        "title": "Docker Service",
        "description": "Deploy pre-built Docker images for databases, caches, and other infrastructure components.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "docker", "database", "redis", "postgres"]
      }
    }, {
      name: "environment",
      route: "/docs/schema/environment",
      frontMatter: {
        "title": "Environment configuration",
        "description": "Configure deployment behavior, Service groups, and automation for ephemeral Environments.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "environment", "configuration", "services"]
      }
    }, {
      name: "external-http",
      route: "/docs/schema/external-http",
      frontMatter: {
        "title": "External HTTP Service",
        "description": "Use an existing hosted HTTP dependency. Lifecycle does not build or deploy it.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "service", "external"]
      }
    }, {
      name: "github",
      route: "/docs/schema/github",
      frontMatter: {
        "title": "GitHub Service",
        "description": "Build and deploy Services from GitHub repositories with Docker.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "github", "docker", "deployment", "build"]
      }
    }, {
      name: "helm",
      route: "/docs/schema/helm",
      frontMatter: {
        "title": "Helm Service",
        "description": "Deploy Services with local, OCI, or public Helm charts.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "helm", "kubernetes", "charts"]
      }
    }, {
      name: "overview",
      route: "/docs/schema/overview",
      frontMatter: {
        "title": "Schema overview",
        "description": "Understand the lifecycle.yaml configuration file and its structure.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["schema", "configuration", "lifecycle.yaml"]
      }
    }, {
      name: "webhooks",
      route: "/docs/schema/webhooks",
      frontMatter: {
        "title": "Webhook configuration",
        "description": "Configure webhooks that start automated actions after Environment events.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
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
        "title": "Optional configuration",
        "description": "Apply optional installation-wide settings safely after Lifecycle is running.",
        "audience": ["platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["configure", "lifecycle", "install", "setup"]
      }
    }, {
      name: "create-github-app",
      route: "/docs/setup/create-github-app",
      frontMatter: {
        "title": "Create the GitHub App",
        "description": "Create and connect a private GitHub App for Lifecycle.",
        "audience": ["platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["github", "app", "install", "setup"]
      }
    }, {
      name: "install-lifecycle",
      route: "/docs/setup/install-lifecycle",
      frontMatter: {
        "title": "Install Lifecycle",
        "description": "Select the OpenTofu-managed or standalone Helm installation path. Make sure that the API, UI, identity, and cluster are healthy.",
        "audience": ["evaluator", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["lifecycle", "install", "helm", "setup"]
      }
    }, {
      name: "prerequisites",
      route: "/docs/setup/prerequisites",
      frontMatter: {
        "title": "Starter infrastructure prerequisites",
        "description": "Prepare cloud, DNS, domain, and command-line access for the starter OpenTofu evaluation path.",
        "audience": ["evaluator", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["requirements", "prerequisites", "setup"]
      }
    }, {
      name: "setup-infra",
      route: "/docs/setup/setup-infra",
      frontMatter: {
        "title": "Set up an evaluation cluster",
        "description": "Provision starter GKE or EKS infrastructure, DNS, dependencies, and Lifecycle for evaluation.",
        "audience": ["evaluator", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
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
        "title": "Datadog application telemetry",
        "description": "Add standard Datadog labels so Datadog can correlate application telemetry by Environment and Service.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["telemetry", "datadog", "kubernetes"]
      }
    }, {
      name: "using-mission-control",
      route: "/docs/tips/using-mission-control",
      frontMatter: {
        "title": "Use the Mission Control comment",
        "description": "Select Services, change sources, set Environment overrides, and request actions from Lifecycle's editable pull-request comment.",
        "audience": ["application-developer"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["pull request", "comment", "environment"]
      }
    }]
  }, {
    name: "troubleshooting",
    route: "/docs/troubleshooting",
    children: [{
      data: docs_troubleshooting_meta
    }, {
      name: "access-and-api",
      route: "/docs/troubleshooting/access-and-api",
      frontMatter: {
        "title": "Troubleshoot access and API errors",
        "description": "Diagnose Lifecycle sign-in, GitHub linking, API key, scope, repository, and feature-policy failures while credentials stay secret.",
        "audience": ["api-user", "application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["troubleshooting", "authentication", "api"]
      }
    }, {
      name: "build-issues",
      route: "/docs/troubleshooting/build-issues",
      frontMatter: {
        "title": "Troubleshoot a failed build",
        "description": "Identify the failed Service build, examine the correct job logs, correct the source or build configuration, and check a redeploy.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["troubleshooting", "build", "logs"]
      }
    }, {
      name: "deploy-issues",
      route: "/docs/troubleshooting/deploy-issues",
      frontMatter: {
        "title": "Troubleshoot a failed deployment",
        "description": "Find the failed Service, examine the related logs, correct the cause, and redeploy an Environment.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["deploy", "troubleshooting", "errors", "logs"]
      }
    }, {
      name: "github-app-webhooks",
      route: "/docs/troubleshooting/github-app-webhooks",
      frontMatter: {
        "title": "Missing PR comment",
        "description": "Diagnose failed GitHub App webhook deliveries without exposing credentials.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["mission control", "comment", "missing", "issue", "setup"]
      }
    }, {
      name: "index",
      route: "/docs/troubleshooting",
      frontMatter: {
        "title": "Troubleshooting",
        "description": "Start from a Lifecycle symptom and open the guide for the failed phase with safe evidence and recovery steps.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["troubleshooting", "support"]
      }
    }, {
      name: "stuck-environment",
      route: "/docs/troubleshooting/stuck-environment",
      frontMatter: {
        "title": "Troubleshoot a stuck Environment",
        "description": "Find the last Lifecycle phase that changed and distinguish queue, build, deployment, readiness, and teardown delays.",
        "audience": ["application-developer", "platform-operator"],
        "lastVerified": "2026-07-24",
        "verificationBaseline": "2026-07-24-comprehensive-audit",
        "contentProfile": "asd-ste100",
        "tags": ["troubleshooting", "environment", "queue"]
      }
    }]
  }, {
    name: "what-is-lifecycle",
    route: "/docs/what-is-lifecycle",
    frontMatter: {
      "title": "What is Lifecycle?",
      "description": "Understand how Lifecycle creates connected, isolated application Environments for pull requests and API-driven workflows.",
      "audience": ["evaluator"],
      "lastVerified": "2026-07-24",
      "verificationBaseline": "2026-07-24-comprehensive-audit",
      "contentProfile": "asd-ste100",
      "tags": ["core", "lifecycle", "concepts"]
    }
  }]
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "title": "Lifecycle · every pull request gets a real environment",
    "description": "Each pull request gets a connected multi-service preview. Builds itself, runs on its own URL, tears down on merge. Apache 2.0, maintained by GoodRx OSS."
  }
}];