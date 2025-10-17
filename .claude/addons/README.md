# Claude Code Addons

Addons are modular extensions that enhance Claude Code with pre-configured
hooks, workflows, and integrations. They're designed to be tooling-agnostic by
default while allowing you to activate specific toolchains instantly.

## Quick Start

### Using an Addon

1. **Browse available addons**:

   ```bash
   ls .claude/addons/hooks/
   ```

2. **Activate addons** with a simple config file:

   ```bash
   # For Node.js projects
   echo '{"addons": ["hooks/safety", "hooks/node-typescript"]}' > .claude-local/active-addons.json

   # For Python projects
   echo '{"addons": ["hooks/safety", "hooks/python-modern"]}' > .claude-local/active-addons.json
   ```

3. **Verify activation**: Ask Claude: "What addons are active?" to confirm
   what's loaded.

## Available Core Addons

### 🛡️ safety

**Universal safety checks that work everywhere**

- Warns before destructive file operations
- Prevents accidental secret commits
- Auto-detects project type
- Shows git status before commits

### 📦 node-typescript

**Node.js + TypeScript development**

- Prettier formatting on save
- ESLint linting with auto-fix suggestions
- TypeScript type checking
- Tests run before commit
- Security audit before push

### 🐍 python-modern

**Modern Python development**

- Ruff linting with auto-fix
- Black code formatting
- mypy type checking
- pytest before commit
- Bandit security scanning

### 🎯 agent-quality

**Quality gates for specific agents**

- Tests after coder agent makes changes
- Security scan before reviewer agent
- Secret detection for security-auditor
- Dependency scanning
- Agent-specific automation

### 🔀 git-workflow

**Enhanced Git operations**

- Commit message formatting
- PR description templates
- Branch protection rules
- Pre-push validation
- Conventional commits

## Creating Your Own Addon

### Addon Structure

```
my-addon/
├── addon.json    # Metadata and requirements
└── hooks.json    # Hook definitions
```

### addon.json Format

```json
{
  "name": "my-custom-addon",
  "version": "1.0.0",
  "description": "My project-specific hooks",
  "requires": ["package.json"], // Files that must exist
  "tooling": ["npm", "jest"], // Tools used by hooks
  "author": "your-name"
}
```

### hooks.json Format

```json
{
  "hooks": {
    "post-tool-use": [
      {
        "name": "format-on-save",
        "matcher": {
          "tool": "Edit",
          "file_patterns": ["*.js", "*.ts"]
        },
        "command": "npm run format $FILE 2>/dev/null || true",
        "timeout": 5000
      }
    ]
  }
}
```

## Best Practices

1. **Start with safety**: Always activate `safety` for basic protections
2. **One toolchain at a time**: Don't mix Node and Python addons
3. **Use local activation**: Keep your preferences in `.claude-local/`
4. **Non-blocking commands**: Use `|| true` to prevent workflow interruption
5. **Appropriate timeouts**: Fast operations (5s), builds (30s), tests (60s)

## Community Addons

Share your addons in `.claude/addons/community/`. Guidelines:

1. Must include clear `addon.json` metadata
2. Commands should be non-destructive
3. Include fallbacks for missing tools
4. Document any special requirements
5. Test across different environments

## Troubleshooting

**Hooks not running?**

- Check if addon is activated: `cat .claude-local/active-addons.json`
- Verify required files exist (check `addon.json` requires field)
- Look for error messages in Claude's output

**Hooks blocking workflow?**

- Add `|| true` to commands to make them non-blocking
- Increase timeout values in `hooks.json`
- Temporarily disable:
  `mv .claude-local/active-addons.json .claude-local/active-addons.json.bak`

**Tool not found errors?**

- Addon may require tools not installed in your environment
- Check `addon.json` tooling field for requirements
- Either install tools or use a different addon

## Advanced Usage

### Combining Multiple Addons

```json
{
  "addons": ["hooks/safety", "hooks/node-typescript", "hooks/git-workflow"]
}
```

### Extending Addons

Create `.claude-local/custom-hooks.json`:

```json
{
  "extends": ["hooks/node-typescript"],
  "hooks": {
    "post-tool-use": [
      // Your additional hooks here
    ]
  }
}
```

### Environment-Specific Activation

```bash
# Development
cp .claude/addons/profiles/dev.json .claude-local/active-addons.json

# Production
cp .claude/addons/profiles/prod.json .claude-local/active-addons.json
```

```text
                  _    _
  __ _ _ __   ___| | _(_)
 / _` | '_ \ / _ \ |/ / |
| (_| | | | |  __/   <| |
 \__,_|_| |_|\___|_|\_\_|

  === ᚢ · ᚦ · ᚲ ===
```
